const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const path = require('path');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const ADMIN_PASS = process.env.ADMIN_PASS || 'admin';

function adminAuth(req, res, next) {
  const token = req.headers.authorization;
  if (token === `Bearer ${ADMIN_PASS}`) return next();
  res.status(401).json({ error: 'unauthorized' });
}

const db = new sqlite3.Database(path.join(__dirname, 'hotel.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room TEXT,
    type TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT UNIQUE,
    qr TEXT
  )`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => console.log('user disconnected'));
});

function broadcastUpdate() {
  db.all('SELECT * FROM requests ORDER BY created_at DESC', (err, rows) => {
    if (!err) io.emit('requests', rows);
  });
}

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    res.json({ token: ADMIN_PASS });
  } else {
    res.status(401).json({ error: 'invalid' });
  }
});

app.get('/api/requests', adminAuth, (req, res) => {
  db.all('SELECT * FROM requests ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/requests', (req, res) => {
  const { room, type, message } = req.body;
  db.run('INSERT INTO requests (room,type,message) VALUES (?,?,?)', [room, type, message], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    broadcastUpdate();
    res.json({ id: this.lastID });
  });
});

app.put('/api/requests/:id', adminAuth, (req, res) => {
  const { status } = req.body;
  db.run('UPDATE requests SET status=? WHERE id=?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    broadcastUpdate();
    res.json({ updated: this.changes });
  });
});

app.get('/api/rooms', adminAuth, (req, res) => {
  db.all('SELECT * FROM rooms ORDER BY number', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/rooms', adminAuth, async (req, res) => {
  const { number } = req.body;
  if (!number) return res.status(400).json({ error: 'number required' });
  try {
    const url = `${req.protocol}://${req.headers.host}/client/${number}`;
    const qr = await QRCode.toDataURL(url);
    db.run('INSERT INTO rooms (number, qr) VALUES (?,?)', [number, qr], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, qr });
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/rooms/:room/requests', (req, res) => {
  db.all('SELECT * FROM requests WHERE room=? ORDER BY created_at DESC', [req.params.room], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/qrcode/:room', async (req, res) => {
  try {
    const url = `${req.protocol}://${req.headers.host}/client/${req.params.room}`;
    const qr = await QRCode.toDataURL(url);
    res.json({ qr });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const staticPath = path.join(__dirname, 'client/dist');
app.use(express.static(staticPath));
app.use((_, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('Server running on', PORT);
});

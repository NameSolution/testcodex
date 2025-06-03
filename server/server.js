const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

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

app.get('/api/requests', (req, res) => {
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

app.put('/api/requests/:id', (req, res) => {
  const { status } = req.body;
  db.run('UPDATE requests SET status=? WHERE id=?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    broadcastUpdate();
    res.json({ updated: this.changes });
  });
});

app.get('/api/rooms/:room/requests', (req, res) => {
  db.all('SELECT * FROM requests WHERE room=? ORDER BY created_at DESC', [req.params.room], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/qrcode/:room', async (req, res) => {
  try {
    const url = `${req.protocol}://${req.headers.host}/client?room=${req.params.room}`;
    const qr = await QRCode.toDataURL(url);
    res.json({ qr });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const staticPath = path.join(__dirname, '../client/dist');
app.use(express.static(staticPath));
app.use((_, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('Server running on', PORT);
});

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initDB } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const db = initDB();

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});

app.get('/api/requests', (req, res) => {
  const rows = db.prepare('SELECT * FROM requests ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/requests', (req, res) => {
  const { room, type, message } = req.body;
  const info = db
    .prepare('INSERT INTO requests (room, type, message) VALUES (?,?,?)')
    .run(room, type, message);
  const request = db
    .prepare('SELECT * FROM requests WHERE id = ?')
    .get(info.lastInsertRowid);
  io.emit('new-request', request);
  res.json(request);
});

app.put('/api/requests/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE requests SET status = ? WHERE id = ?').run(status, req.params.id);
  const request = db
    .prepare('SELECT * FROM requests WHERE id = ?')
    .get(req.params.id);
  io.emit('update-request', request);
  res.json(request);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

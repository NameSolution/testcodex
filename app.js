import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Database from 'better-sqlite3';

const db = new Database('./hotel.db');
db.exec(`CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room TEXT,
  type TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`);

const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Socket connected');
});

app.get('/api/requests', (req, res) => {
  const rows = db.prepare('SELECT * FROM requests ORDER BY created_at DESC').all();
  res.json(rows);
});

app.post('/api/requests', (req, res) => {
  const { room, type, message } = req.body;
  const info = db.prepare('INSERT INTO requests (room, type, message) VALUES (?,?,?)').run(room, type, message);
  const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(info.lastInsertRowid);
  io.emit('new-request', request);
  res.json(request);
});

app.put('/api/requests/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE requests SET status = ? WHERE id = ?').run(status, req.params.id);
  const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
  io.emit('update-request', request);
  res.json(request);
});

const html = String.raw`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Hotel Requests</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="/socket.io/socket.io.js"></script>
</head>
<body class="p-4">
<h1 class="text-xl font-semibold mb-4">Client Requests</h1>
<form id="req-form" class="space-y-2 mb-4">
  <input class="border p-2 w-full" name="room" placeholder="Room" required />
  <select class="border p-2 w-full" name="type">
    <option>room service</option>
    <option>cleaning</option>
    <option>maintenance</option>
    <option>taxi</option>
  </select>
  <textarea class="border p-2 w-full" name="message" placeholder="Message"></textarea>
  <button class="px-4 py-2 bg-blue-600 text-white" type="submit">Send</button>
</form>
<ul id="list" class="space-y-1"></ul>
<script>
const socket = io();
fetch('/api/requests').then(r => r.json()).then(show);

socket.on('new-request', req => add(req));
socket.on('update-request', req => update(req));

document.getElementById('req-form').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd.entries());
  const res = await fetch('/api/requests', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const data = await res.json();
  add(data);
  e.target.reset();
});

function show(list){
  list.forEach(add);
}
function add(r){
  const li = document.createElement('li');
  li.id = 'req-' + r.id;
  li.className = 'border p-2 flex justify-between items-center';
  li.innerHTML = '<span>#' + r.room + ' ' + r.type + ' - <span class="status">' + r.status + '</span></span>' +
    '<div class="space-x-1"><button class="in progress px-2 py-1 bg-yellow-500 text-white">In Progress</button>' +
    '<button class="resolve px-2 py-1 bg-green-600 text-white">Resolve</button></div>';
  li.querySelector('.in').onclick = () => change(r.id, 'in_progress');
  li.querySelector('.resolve').onclick = () => change(r.id, 'resolved');
  document.getElementById('list').prepend(li);
}
function update(r){
  const li = document.getElementById('req-' + r.id);
  if(li){
    li.querySelector('.status').textContent = r.status;
  }
}
async function change(id, status){
  await fetch('/api/requests/' + id, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status})});
}
</script>
</body>
</html>`;

app.get('/', (req, res) => {
  res.send(html);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Running on http://localhost:' + PORT));

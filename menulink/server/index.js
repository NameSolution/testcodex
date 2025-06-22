const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'menu.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS menus (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    menu_id TEXT,
    name TEXT,
    price REAL,
    allergens TEXT,
    image_url TEXT,
    available INTEGER DEFAULT 1,
    FOREIGN KEY(menu_id) REFERENCES menus(id)
  )`);
});

function checkToken(req, res, next) {
  const { token } = req.query;
  const menuId = req.params.id;
  db.get('SELECT token FROM menus WHERE id = ?', [menuId], (err, row) => {
    if (err || !row || row.token !== token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });
}

app.post('/api/admin/create', (req, res) => {
  const id = uuidv4();
  const token = uuidv4();
  db.run('INSERT INTO menus(id, token) VALUES (?, ?)', [id, token], err => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({
      adminUrl: `/edit/${id}?token=${token}`,
      publicUrl: `/menu/${id}`
    });
  });
});

app.get('/api/menu/:id', (req, res) => {
  const id = req.params.id;
  db.all('SELECT * FROM items WHERE menu_id = ? AND available = 1', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows);
  });
});

app.get('/api/admin/menu/:id', checkToken, (req, res) => {
  const id = req.params.id;
  db.all('SELECT * FROM items WHERE menu_id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows);
  });
});

app.post('/api/admin/menu/:id/item', checkToken, (req, res) => {
  const id = req.params.id;
  const item = { id: uuidv4(), menu_id: id, ...req.body };
  db.run(
    'INSERT INTO items(id, menu_id, name, price, allergens, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [item.id, id, item.name, item.price, item.allergens, item.image_url, item.available ? 1 : 0],
    err => {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json(item);
    }
  );
});

app.put('/api/admin/menu/:id/item/:itemId', checkToken, (req, res) => {
  const { id, itemId } = req.params;
  const item = req.body;
  db.run(
    'UPDATE items SET name=?, price=?, allergens=?, image_url=?, available=? WHERE id=? AND menu_id=?',
    [item.name, item.price, item.allergens, item.image_url, item.available ? 1 : 0, itemId, id],
    err => {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json({ ...item, id: itemId });
    }
  );
});

app.delete('/api/admin/menu/:id/item/:itemId', checkToken, (req, res) => {
  const { id, itemId } = req.params;
  db.run('DELETE FROM items WHERE id=? AND menu_id=?', [itemId, id], err => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ success: true });
  });
});

app.get('/api/menu/:id/qrcode', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/menu/${req.params.id}`;
  QRCode.toDataURL(url, (err, dataUrl) => {
    if (err) return res.status(500).json({ error: 'qrcode error' });
    const base64 = dataUrl.split(',')[1];
    const img = Buffer.from(base64, 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

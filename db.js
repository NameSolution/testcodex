import Database from 'better-sqlite3';

export function initDB() {
  const db = new Database('./hotel.db');
  db.exec(`CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room TEXT,
    type TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);
  return db;
}

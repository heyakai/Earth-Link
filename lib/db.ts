import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'markers.db'));

// Create markers table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS markers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    website TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

export function addMarker(latitude: number, longitude: number, website: string) {
  const stmt = db.prepare('INSERT INTO markers (latitude, longitude, website) VALUES (?, ?, ?)');
  return stmt.run(latitude, longitude, website);
}

export function getMarkers() {
  const stmt = db.prepare('SELECT * FROM markers');
  return stmt.all();
}

export default db; 
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'markers.db'));

interface MarkerRecord {
  id: number
  latitude: number
  longitude: number
  website: string
  siteName: string
  siteDescription: string | null
  ownerName: string | null
  ownerDescription: string | null
  ownerWebsite: string | null
  isAnonymous: number
  created_at: string
}

// Create markers table if it doesn't exist
db.exec(`
  DROP TABLE IF EXISTS markers;
  CREATE TABLE IF NOT EXISTS markers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    website TEXT NOT NULL,
    siteName TEXT NOT NULL,
    siteDescription TEXT,
    ownerName TEXT,
    ownerDescription TEXT,
    ownerWebsite TEXT,
    isAnonymous BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

interface MarkerData {
  latitude: number
  longitude: number
  website: string
  siteName: string
  siteDescription?: string
  ownerName?: string
  ownerDescription?: string
  ownerWebsite?: string
  isAnonymous?: boolean
}

export function addMarker(data: MarkerData) {
  const stmt = db.prepare(`
    INSERT INTO markers (
      latitude, longitude, website, siteName, siteDescription,
      ownerName, ownerDescription, ownerWebsite, isAnonymous
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);
  
  return stmt.run(
    data.latitude,
    data.longitude,
    data.website,
    data.siteName,
    data.siteDescription || null,
    data.ownerName || null,
    data.ownerDescription || null,
    data.ownerWebsite || null,
    data.isAnonymous ? 1 : 0
  );
}

export function getMarkers() {
  const stmt = db.prepare('SELECT * FROM markers');
  const markers = stmt.all() as MarkerRecord[];
  return markers.map(marker => ({
    ...marker,
    isAnonymous: Boolean(marker.isAnonymous)
  }));
}

export default db; 
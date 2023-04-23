import Database from 'better-sqlite3'

// Create a new database instance
const db = new Database("C:\\Users\\daps0n!c\\Documents\\database-mongodb\\WAD\\pointsofinterest.db");

export function addPOI(data) {
    const {name, type, country, region, lon, lat, description, recommendations = 0} =data;

    if (!name || !type || !country || !region || !lon || !lat || !description) {
        throw new Error('Missing required fields');
    }

    const stmt = db.prepare('INSERT INTO pointsofinterest(name, type, country, region, lon, lat, description, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    const info =stmt.run(name, type, country, region, lon, lat, description, recommendations)
    console.log("Data inserted, new ID:", info.lastInsertRowid);
    return info.lastInsertRowid;
}

export function getAllPOI() {
    const stmt = db.prepare('SELECT * FROM pointsofinterest');
    return stmt.all();
}

export function getPOIById(id) {
    const stmt = db.prepare('SELECT * FROM pointsofinterest WHERE id=?');
    return stmt.get(id);
}

export function getPOIByRegion(region) {
    const stmt = db.prepare('SELECT * FROM pointsofinterest WHERE region=?');
    return stmt.all(region);
}
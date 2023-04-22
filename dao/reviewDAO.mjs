import Database from 'better-sqlite3';

// Create a new database instance
const db = new Database("C:\\Users\\daps0n!c\\Documents\\database-mongodb\\WAD\\pointsofinterest.db");

export function addReview(poiId, review){
    return new Promise((resolve, reject) =>{
        if(!poiId) {
            reject(new Error('Invalid poiId parameter'))
            return;
        }
        if (!review) {
            reject(new Error('Review cannot be left blank'));
            return;
        }
        const poiStmt = db.prepare('SELECT * FROM pointsofinterest WHERE id=?');
        const poi = poiStmt.get(poiId);
        if(!poi){
            reject(new Error('Point of Interest not found'));
            return;
        }
        const stmt = db.prepare('INSERT INTO poi_reviews(poi_id, review) VALUES (?, ?)');
        try{
            const info = stmt.run(poiId, review)
            console.log(`Review added successfully for POI id ${poiId}: ${review}`);
            resolve({ id: info.lastInsertRowid });
        } catch (err) {
            console.error('Error adding review to the database', err);
            reject(err);
        }
        

    });
}


export function getReviewByPoiId(poiId){
    const stmt =db.prepare('SELECT * FROM poi_reviews WHERE poi_id=?');
    return stmt.all(poiId);
}

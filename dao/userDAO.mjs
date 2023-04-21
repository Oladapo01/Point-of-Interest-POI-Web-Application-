import Database from 'better-sqlite3';

// Create a new database instance
const db = new Database("C:\\Users\\daps0n!c\\Documents\\database-mongodb\\WAD\\pointsofinterest.db");

class UserDAO {
    static getUserByUsernameAndPassword(username, password) {
        const stmt = db.prepare('SELECT * FROM poi_users WHERE username=? AND password=?');
        return stmt.get(username, password)
    }
}

export default UserDAO;
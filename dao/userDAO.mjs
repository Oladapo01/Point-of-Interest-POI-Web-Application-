import Database from 'better-sqlite3';
import dotenv from 'dotenv'

// Load the environment variables from the .env file
dotenv.config({path: '.env'});

// Create a new database instance using the DB_PATH variable from the .env file
const db = new Database(process.env.DB_PATH);

class UserDAO {
    static getUserByUsernameAndPassword(username, password) {
        const stmt = db.prepare('SELECT * FROM poi_users WHERE username=? AND password=?');
        return stmt.get(username, password)
    }
}

export default UserDAO;
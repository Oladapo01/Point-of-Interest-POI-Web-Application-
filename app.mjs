//import dependencies 
import express from 'express';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

// Create a new express app instance
const app = express();
// Load the database 
const db = new Database('C:\\Users\\daps0n!c\\Documents\\database-mongodb\\WAD\\pointsofinterest.db');

// Enable the reading of JSON from the body og the POST requests
app.use(express.json());

dotenv.config({path: '.env'});
const port = process.env.PORT || 3200;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

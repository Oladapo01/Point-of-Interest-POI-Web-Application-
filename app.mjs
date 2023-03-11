//import dependencies 
import express from 'express';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

// Create a new express app instance
const app = express();
// Load the database 
const db = new Database("C:\\Users\\daps0n!c\\Documents\\database-mongodb\\WAD\\pointsofinterest.db");

// Enable the reading of JSON from the body og the POST requests
app.use(express.json());

dotenv.config({path: '.env'});
const port = process.env.PORT || 5000;

app.use(express.static('public'));

app.get('/', (req, res) => {   
    console.log('Received  reqquest from the root');
    res.send('Hello World!');
});

app.get('/regions/:region', (req, res) => {
    try{
        const regionName = req.params.region;
        const stmt = db.prepare('SELECT * FROM pointsofinterest WHERE region=?');
        const rows = stmt.all(regionName);
        res.json(rows);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

app.post('/poi', (req, res) => {
    const poi = req.body;
    const stmt = db.prepare('INSERT INTO poi (name, type, region, lon, lat, description, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(poi.name, poi.region, poi.description);
    res.json(info);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost/${port}`);
})

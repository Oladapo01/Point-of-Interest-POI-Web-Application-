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

//Endpoint to look up all point of interest and returnns the result as JSON
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

app.post('/poi/add', (req, res) => {
    try{
        //if(!req.body.name || !req.body.type|| !req.body.country || !req.body.region || !req.body.lon || !req.body.lat || !req.body.description || !req.body.recommendations){
        //    res.status(400).json({error: 'Missing parameters'});
        //    return;
        //}else{
            const poi = req.body;
            const stmt = db.prepare('INSERT INTO pointsofinterest(name, type, country, region, lon, lat, description, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            const info = stmt.run(poi.name, poi.type, poi.country, poi.region, poi.lon, poi.lat, poi.description, poi.recommendations);
            res.json({id: info.lastInsertRowid});
        //}
        
    } catch(error) {
        res.status(500).json({error: error});
    }
    ;
});

app.post('/poi/:id/recommend', (req, res) => {
    try {
        const ids = req.params.id;
        const stmt = db.prepare('UPDATE pointsofinterest SET recommendations=recommendations+1 WHERE id=?');
        const info = stmt.run(ids);
        if(info.changes == 1){
            res.json({message: 'Recommendation added'});
        }else{
            res.status(404).json({error: 'Point of interest not found'});
        }
    } catch(error) {
        res.status(500).json({error: error});
    }
    
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost/${port}`);
})

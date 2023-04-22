//import dependencies 
import express from 'express';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';
import { addPOI } from './dao/poiDao.mjs'
import { addReview } from './dao/reviewDAO.mjs'
import UserDAO from './dao/userDAO.mjs'

// Create a new express app instance
const app = express();
// Load the database 
const db = new Database("C:\\Users\\daps0n!c\\Documents\\database-mongodb\\WAD\\pointsofinterest.db");

// Create sqlite dtabase to store session
const sessDb = new Database('session.db');

// Create a session store
const sessionStore = betterSqlite3Session(expressSession, sessDb);

app.use(expressSession({
    // Specify the session to be used 
    store: new sessionStore(),

    // Specify the secret key to sign the session ID cookie
    secret: 'Incognito',

    // Regenrate session on each request (keeping the session active)
    resave: true,

    // Save the session even if it is not modified (disabled as this unnecessarily creates empty sessions)
    saveUninitialized: true,

    // reset cookie for every HTTP response. The cookie expiration time will be reset, to 'maxAge' milliseconds beyond the time of the response. 
    // Thus, the session cookie will expire after 10 mins of *inactivity* (no HTTP request made and consequently no response sent) when 'rolling' is true.
    // If 'rolling' is false, the session cookie would expire after 10 minutes even if the user was interacting with the site, which would be very
    // annoying - so true is the sensible setting.
    rolling: true,

    // Destroy session (remove it from the data store when it is set to null or deleted)
    unset: 'destroy',

    // Useful if using a proxy to access your access your server, this would allow the session cookie to pas through the proxy 
    proxy: true,

    // The cookie will expire after 10 minutes of inactivity
    cookie: { 
        // 600000 ms = 10 mins expiry time
        maxAge: 600000,
        // The cookie will only be sent over HTTPS
        httpOnly: true
     }
}))

// Enable the reading of JSON from the body of the POST requests
app.use(express.json());


// Load the environment variables from the .env file
dotenv.config({path: '.env'});
const port = process.env.PORT || 5000;

app.use(express.static('public'));

//Testing the routes file 
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

//login route
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if(!username || !password){
        res.status(400).json({error: 'Missing username or password'});
        return;
    }
    const user = UserDAO.getUserByUsernameAndPassword(username, password);
    if(user){
        // Store the user in the session
        req.session.user = {
            id: user.id,
            username: user.username
        };
        res.json({message: 'Login successful'});
    } else {
        res.status(401).json({error: 'Invalid username or password'});
    }
   
});

// 'GET' login route - useful for client to obtain currently logged in user
app.get('/login', (req, res) => {
    if(req.session.user){
        res.json(req.session.user);
    }else{
        res.status(401).json({error: 'Not logged in'});
    }
});


//logout route
app.get('/logout', (req, res) =>{
    req.session.destroy(()=>{
        res.json({message: 'Logout successful'});
    });
});

// Middleware which protects any routes using POST or DELETE from access by users who are not logged in
app.use((req, res, next)=>{
    if(["POST", "DELETE"].indexOf(req.method) == -1) {
        next();
    } else{
        if(req.session.user) {
            next();
        } else {
            res.status(401).json({error: 'Not logged in. Login'});
        }
    }
});


//Endpoint to add a new point of interest
app.post('/poi/add', isLoggedIn, (req, res) => {
    try {
        const id = addPOI(req.body);
        res.json({ id });
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
   
});


app.post('/poi/:id/recommend', isLoggedIn, (req, res) => {
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

app.post('/poi/:id/addReview', isLoggedIn, (req, res) => {
    const poiId = req.params.id;
    const userReview = req.body.review;
    console.log('Received review:', userReview) //Check userReview
    console.log('Received poiId:', poiId) // Check poiId

    addReview(poiId, userReview)
        .then(reviewId => {
            res.json({message: 'Review added', reviewId});
        })
        .catch(err => {
            res.status(500).json({ err: err.message });
        });
    
    
})

function isLoggedIn(req, res, next){
    if(req.session.user){
        next();
    }else{
        res.status(401).json({Error: 'Not logged in. Please log in to add a point of interest'});
    }
}

app.listen(port, () => {
    console.log(`[${new Date().toLocaleString()}] Server is running on http://localhost/${port}`);
})

//import dependencies 
import express from 'express';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';
import userRouter from './routes/userRouter.mjs'
import reviewRouter from './routes/reviewRouter.mjs'
import { poiGetRouter, poiPostRouter } from './routes/poiRouter.mjs';

// Create a new express app instance
const app = express();
// Load the environment variable from the .env file
dotenv.config({path: '.env'});

// Create a new database instance using the DB_PATH variable from the .env file
const db = new Database(process.env.DB_PATH);

// Create sqlite database to store session
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

app.use(express.static('views'))

// Enable the reading of JSON from the body of the POST requests
app.use(express.json());


// Load the environment variables from the .env file
dotenv.config({path: '.env'});
const port = process.env.PORT || 5000;

app.use(express.static('public'));

//Testing the routes file 
app.get('/', (req, res) => {   
    console.log('Received request from the root');
    res.redirect('/index.html');
});

app.get('add', (req, res) => {   
    console.log('Add');
    res.redirect('/add.html');
});

// Mount the routers for the point of interest
app.use('/api/poi', poiGetRouter);
app.use('/api/poi', poiPostRouter);

// For the user 
app.use('/api/users', userRouter);



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




//Add a review to the POI
app.use('/api/reviews', isLoggedIn, reviewRouter);

// Add a recommendation to the POI
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

import express from 'express';
import { getAllPOIRouter, getPOIByIdRouter, getPOIByRegionRouter } from '../controller/poiController.mjs';
import { addPOIRouter } from '../controller/poiController.mjs';


// Router for the GET requests
const poiGetRouter = express.Router();

poiGetRouter.get('/', getAllPOIRouter);
poiGetRouter.get('/:id', getPOIByIdRouter);
poiGetRouter.get('/region/:region', getPOIByRegionRouter);

// Router for the POST requests
const poiPostRouter = express.Router();
function isLoggedIn(req, res, next){
    if(req.session.user){
        next();
    }else{
        res.status(401).json({error: 'Not logged in. Login'});
    }
}
poiPostRouter.post('/', isLoggedIn, addPOIRouter);

export { poiGetRouter, poiPostRouter };
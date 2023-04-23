import { addPOI , getAllPOI, getPOIById, getPOIByRegion } from "../dao/poiDao.mjs";

export async function addPOIRouter(req, res) {
    const data = req.body;
    try {
        const poiId = await addPOI(data);
        res.status(201).json({ message: 'POI added', poiId});
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
}

export async function getAllPOIRouter(req, res) {
    try {
        const pois = await getAllPOI();
        res.status(200).json(pois);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

export async function getPOIByIdRouter(req, res) {
    const poiId = req.params.id;
    try {
        const poi = await getPOIById(poiId);
        if(poi){
            res.status(200).json(poi);
        }else{
            res.status(404).json({error: 'POI not found'});
        }
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

export async function getPOIByRegionRouter(req, res) {
    const region = req.params.region;
    try {
        const pois = await getPOIByRegion(region);
        if(pois){
            res.status(200).json(pois);
        }else{
            res.status(404).json({error: 'POI not found'});
        }
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

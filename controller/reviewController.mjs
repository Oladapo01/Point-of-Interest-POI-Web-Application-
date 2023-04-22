import { addReview, getReviewByPoiId } from '../dao/reviewDAO.mjs'

export async function postAddReview(req, res) {
    const poiId = req.params.id;
    const userReview = req.body.review;
    try {
        const reviewId = await addReview(poiId, userReview);
        res.status(201).json({ message: 'Review added', reviewId });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

export async function getReviewsByPoiId(req, res) {
    const poiId = req.params.id;
    try {
        const reviews = await getReviewByPoiId(poiId);
        res.status(200).json(reviews)
    } catch (err) {
        console.error(err)
        res.status(500).json({ err: err.message });
    }
}
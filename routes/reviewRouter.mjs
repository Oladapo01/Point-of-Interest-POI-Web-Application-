import express from 'express';
import { postAddReview, getReviewsByPoiId } from '../controller/reviewController.mjs'

const reviewRouter = express.Router();

reviewRouter.post('/:id/addReview', postAddReview);
reviewRouter.get('/:id/reviews', getReviewsByPoiId);

export default reviewRouter;
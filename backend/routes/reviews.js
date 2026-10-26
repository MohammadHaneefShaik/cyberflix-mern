import express from 'express';
import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.get('/:productId', asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
}));
router.post('/:productId', protect, asyncHandler(async (req, res) => {
  const review = await Review.create({ product: req.params.productId, user: req.user._id, name: req.user.name, ...req.body });
  const reviews = await Review.find({ product: req.params.productId });
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(req.params.productId, { rating: avg.toFixed(1), numReviews: reviews.length });
  res.status(201).json({ success: true, data: review });
}));
export default router;

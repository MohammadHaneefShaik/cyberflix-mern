import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
const router = express.Router();
router.use(protect, admin);
router.get('/stats', asyncHandler(async (req, res) => {
  const [totalOrders, totalRevenue, totalProducts, totalUsers] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'user' }),
  ]);
  const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10);
  res.json({ success: true, data: { totalOrders, totalRevenue: totalRevenue[0]?.total || 0, totalProducts, totalUsers, recentOrders } });
}));
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
}));
export default router;

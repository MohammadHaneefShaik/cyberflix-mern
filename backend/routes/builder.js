import express from 'express';
import asyncHandler from 'express-async-handler';
import Build from '../models/Build.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { checkCompatibility, estimatePerformance } from '../utils/compatibilityEngine.js';
const router = express.Router();

// Check compatibility
router.post('/check', asyncHandler(async (req, res) => {
  const { components } = req.body;
  const productIds = Object.values(components).filter(Boolean);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = {};
  products.forEach(p => { productMap[p._id.toString()] = p; });
  const resolvedComponents = {};
  Object.entries(components).forEach(([key, id]) => { if (id && productMap[id]) resolvedComponents[key] = productMap[id]; });
  const compat = checkCompatibility(resolvedComponents);
  const perf = estimatePerformance(resolvedComponents);
  const total = Object.values(resolvedComponents).reduce((s, p) => s + (p.price || 0), 0);
  res.json({ success: true, data: { compatibility: compat, performance: perf, totalPrice: total } });
}));

// Save build (auth required)
router.post('/save', protect, asyncHandler(async (req, res) => {
  const { name, components, compatibilityStatus, performanceScores, totalPrice } = req.body;
  const build = await Build.create({ user: req.user._id, name, components, compatibilityStatus, performanceScores, totalPrice });
  res.status(201).json({ success: true, data: build });
}));

// Get my builds
router.get('/my', protect, asyncHandler(async (req, res) => {
  const builds = await Build.find({ user: req.user._id })
    .populate('components.cpu components.gpu components.motherboard components.ram components.storage components.psu components.case components.cooling components.fans', 'name brand price emoji')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: builds });
}));

// Delete build
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  await Build.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ success: true, message: 'Build deleted' });
}));

export default router;

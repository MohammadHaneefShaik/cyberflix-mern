import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.brand) filter.brand = { $in: req.query.brand.split(',') };
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice);
  }
  if (req.query.inStock === 'true') filter.stock = { $gt: 0 };

  const sortMap = {
    price_asc: { price: 1 }, price_desc: { price: -1 },
    rating: { rating: -1 }, newest: { createdAt: -1 },
    popular: { soldCount: -1 }, default: { isBestseller: -1, rating: -1 }
  };
  const sort = sortMap[req.query.sort] || sortMap.default;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) {
    res.status(404); throw new Error('Product not found');
  }
  res.json({ success: true, data: product });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const [products, total] = await Promise.all([
    Product.find({ category, isActive: true }).sort({ isBestseller: -1, rating: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments({ category, isActive: true })
  ]);
  res.json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, $or: [{ isFeatured: true }, { isBestseller: true }] })
    .sort({ isBestseller: -1, rating: -1 }).limit(12).lean();
  res.json({ success: true, data: products });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) { res.json({ success: true, data: [] }); return; }
  const products = await Product.find(
    { $text: { $search: q }, isActive: true },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } }).limit(20).lean();
  res.json({ success: true, data: products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Product deactivated' });
});

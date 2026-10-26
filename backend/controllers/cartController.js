import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name brand price emoji stock isActive');
  res.json({ success: true, data: cart || { items: [] } });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) { res.status(404); throw new Error('Product not found'); }
  if (product.stock < qty) { res.status(400); throw new Error('Insufficient stock'); }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find(i => i.product.toString() === productId);
  if (existing) existing.qty = Math.min(existing.qty + qty, product.stock);
  else cart.items.push({ product: productId, qty, price: product.price });

  await cart.save();
  const populated = await cart.populate('items.product', 'name brand price emoji stock');
  res.json({ success: true, data: populated });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  const populated = await cart.populate('items.product', 'name brand price emoji stock');
  res.json({ success: true, data: populated });
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Cart cleared' });
});

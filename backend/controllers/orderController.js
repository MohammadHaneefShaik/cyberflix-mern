import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, isBuildOrder } = req.body;
  if (!orderItems?.length) { res.status(400); throw new Error('No order items'); }

  let itemsPrice = 0;
  const enrichedItems = [];
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) { res.status(404); throw new Error(`Product ${item.product} not found`); }
    if (product.stock < item.qty) { res.status(400); throw new Error(`${product.name} is out of stock`); }
    itemsPrice += product.price * item.qty;
    enrichedItems.push({ product: product._id, name: product.name, emoji: product.emoji, brand: product.brand, price: product.price, qty: item.qty });
  }

  const taxPrice = Math.round(itemsPrice * 0.18);
  const shippingPrice = itemsPrice > 50000 ? 0 : 499;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Create Razorpay order
  const rpOrder = await razorpay.orders.create({ amount: totalPrice * 100, currency: 'INR', receipt: `receipt_${Date.now()}` });

  const order = await Order.create({
    user: req.user._id, orderItems: enrichedItems, shippingAddress,
    itemsPrice, taxPrice, shippingPrice, totalPrice, isBuildOrder,
    paymentResult: { razorpayOrderId: rpOrder.id }
  });

  res.status(201).json({ success: true, data: { order, razorpayOrderId: rpOrder.id, amount: totalPrice * 100, currency: 'INR', key: process.env.RAZORPAY_KEY_ID } });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
  hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const digest = hmac.digest('hex');

  if (digest !== razorpaySignature) { res.status(400); throw new Error('Invalid payment signature'); }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'confirmed';
  order.paymentResult = { razorpayOrderId, razorpayPaymentId, razorpaySignature, status: 'paid', updatedAt: new Date() };
  await order.save();

  // Decrement stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty, soldCount: item.qty } });
  }
  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.json({ success: true, data: order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, data: order });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const [orders, total] = await Promise.all([
    Order.find().populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments()
  ]);
  res.json({ success: true, data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id,
    { status: req.body.status, ...(req.body.trackingNumber && { trackingNumber: req.body.trackingNumber }) },
    { new: true }
  );
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json({ success: true, data: order });
});

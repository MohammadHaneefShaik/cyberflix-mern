import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('Please provide all fields');
  }
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('User already exists'); }
  const user = await User.create({ name, email, password });
  res.status(201).json({
    success: true,
    data: {
      _id: user._id, name: user.name, email: user.email,
      role: user.role, avatar: user.avatar,
      token: generateToken(user._id)
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  res.json({
    success: true,
    data: {
      _id: user._id, name: user.name, email: user.email,
      role: user.role, avatar: user.avatar, phone: user.phone,
      addresses: user.addresses, wishlist: user.wishlist,
      token: generateToken(user._id)
    }
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('wishlist', 'name brand price emoji category');
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.avatar = req.body.avatar || user.avatar;
  if (req.body.password) user.password = req.body.password;
  if (req.body.addresses) user.addresses = req.body.addresses;
  const updated = await user.save();
  res.json({
    success: true,
    data: {
      _id: updated._id, name: updated.name, email: updated.email,
      role: updated.role, avatar: updated.avatar, phone: updated.phone,
      addresses: updated.addresses, token: generateToken(updated._id)
    }
  });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const idx = user.wishlist.indexOf(productId);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(productId);
  await user.save();
  res.json({ success: true, data: user.wishlist });
});

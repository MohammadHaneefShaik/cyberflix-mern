import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/', protect, clearCart);
router.delete('/:productId', protect, removeFromCart);
export default router;

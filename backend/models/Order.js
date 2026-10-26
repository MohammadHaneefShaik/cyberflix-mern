import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, emoji: String, brand: String, image: String, price: Number, qty: { type: Number, default: 1 } }],
  shippingAddress: { name: String, line1: String, line2: String, city: String, state: String, pincode: String, phone: String },
  paymentMethod: { type: String, default: 'Razorpay' },
  paymentResult: { razorpayOrderId: String, razorpayPaymentId: String, razorpaySignature: String, status: String, updatedAt: Date },
  itemsPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  status: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'], default: 'pending' },
  trackingNumber: String,
  notes: String,
  isBuildOrder: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);

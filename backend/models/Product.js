import mongoose from 'mongoose';
const specSchema = new mongoose.Schema({ key: String, value: String }, { _id: false });
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true, lowercase: true },
  brand: { type: String, required: true },
  category: { type: String, required: true, enum: ['cpu','gpu','motherboard','ram','storage','psu','case','cooling','fans','monitors','peripherals','accessories'] },
  description: { type: String, default: '' },
  shortDesc: { type: String, default: '' },
  images: [{ url: String, publicId: String }],
  emoji: { type: String, default: 'box' },
  price: { type: Number, required: true, min: 0 },
  originalPrice: Number,
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, unique: true, sparse: true },
  tags: [String],
  specs: [specSchema],
  socket: String,
  ramType: String,
  formFactor: String,
  tdp: Number,
  wattage: Number,
  ramSpeed: Number,
  storageType: String,
  capacity: String,
  isBestseller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
}, { timestamps: true });
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') + '-' + Date.now();
  }
  next();
});
productSchema.index({ name: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
export default mongoose.model('Product', productSchema);

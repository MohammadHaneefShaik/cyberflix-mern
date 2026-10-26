import mongoose from 'mongoose';
const buildSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, default: 'My Build' },
  components: {
    cpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    motherboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    gpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ram: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    storage: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    psu: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    case: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    cooling: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    fans: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  },
  totalPrice: { type: Number, default: 0 },
  compatibilityStatus: { isCompatible: { type: Boolean, default: true }, issues: [String], warnings: [String] },
  performanceScores: { gaming: Number, workstation: Number, general: Number },
  isPublic: { type: Boolean, default: false },
  shareToken: String,
}, { timestamps: true });
export default mongoose.model('Build', buildSchema);

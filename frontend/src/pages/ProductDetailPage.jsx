import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiHeart, FiArrowLeft, FiCheck, FiPackage, FiShield, FiTruck, FiZap } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { productAPI } from '../services/api';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { authAPI } from '../services/api';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

// Deterministic image selection by product category
const CATEGORY_IMAGES = {
  cpu: [
    'https://images.unsplash.com/photo-1555617981-dac3772ef4e4?w=600&q=80',
    'https://images.unsplash.com/photo-1591799265444-d66432b91588?w=600&q=80',
  ],
  gpu: [
    'https://images.unsplash.com/photo-1622502197071-0d5d0cb5b200?w=600&q=80',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80',
  ],
  motherboard: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    'https://images.unsplash.com/photo-1562976540-1502c2145851?w=600&q=80',
  ],
  ram: [
    'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=600&q=80',
    'https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?w=600&q=80',
  ],
  storage: [
    'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=600&q=80',
    'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80',
  ],
  psu: [
    'https://images.unsplash.com/photo-1640955014216-75201056c829?w=600&q=80',
    'https://images.unsplash.com/photo-1555617766-c77e7cd5a04e?w=600&q=80',
  ],
  case: [
    'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=600&q=80',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80',
  ],
  cooling: [
    'https://images.unsplash.com/photo-1589652717521-10c0d09aef69?w=600&q=80',
    'https://images.unsplash.com/photo-1555617766-c77e7cd5a04e?w=600&q=80',
  ],
  monitors: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    'https://images.unsplash.com/photo-1616763355603-9755a912a1c0?w=600&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1593640408182-31c228dbee4c?w=600&q=80',
  ],
};

function getProductImage(product) {
  if (product.images?.[0]?.url) return product.images[0].url;
  const imgs = CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.default;
  const hash = (product.name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return imgs[hash % imgs.length];
}

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(s => (
          <FiStar
            key={s}
            size={14}
            className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-brand-border'}
          />
        ))}
      </div>
      <span className="text-brand-muted text-sm">{rating.toFixed(1)} ({count} reviews)</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [wishlist, setWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    productAPI.getById(id)
      .then(res => {
        setProduct(res.data.data);
        if (user?.wishlist?.includes(id)) setWishlist(true);
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    await addToCart(product, qty);
    toast.success(`${product.name} added to cart`);
    setAddingToCart(false);
  };

  const toggleWishlist = async () => {
    if (!user) { toast.error('Please login to save to wishlist'); return; }
    try {
      await authAPI.toggleWishlist(id);
      setWishlist(w => !w);
      toast.success(wishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Something went wrong'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg pt-16 px-6">
        <div className="max-w-7xl mx-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-brand-bg-card rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-brand-bg-card rounded w-1/4" />
              <div className="h-10 bg-brand-bg-card rounded w-4/5" />
              <div className="h-6 bg-brand-bg-card rounded w-2/5" />
              <div className="h-32 bg-brand-bg-card rounded" />
              <div className="h-12 bg-brand-bg-card rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const image = getProductImage(product);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-brand-bg pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-brand-muted mb-8">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-white transition-colors">Products</button>
          <span>/</span>
          <button
            onClick={() => navigate(`/products?category=${product.category}`)}
            className="hover:text-white transition-colors capitalize"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-brand-bg-card border border-brand-border relative">
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-brand-red text-white text-xs font-barlow font-black px-3 py-1 rounded uppercase tracking-wider">
                  -{discount}%
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-xs font-barlow font-black px-3 py-1 rounded uppercase tracking-wider">
                  NEW
                </div>
              )}
              <img
                src={image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = CATEGORY_IMAGES.default[0]; }}
              />
            </div>
            {/* Thumbnails placeholder */}
            <div className="flex gap-3 mt-4">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    i === 0 ? 'border-brand-red' : 'border-brand-border hover:border-brand-muted'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-brand-red text-xs font-barlow font-bold uppercase tracking-widest">{product.brand}</span>
                <span className="text-brand-border">•</span>
                <span className="text-brand-muted text-xs uppercase tracking-wider">{product.category}</span>
                {product.isBestseller && (
                  <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs px-2 py-0.5 rounded font-barlow font-bold uppercase tracking-wider">
                    Bestseller
                  </span>
                )}
              </div>
              <h1 className="font-barlow text-3xl lg:text-4xl font-black uppercase text-white leading-tight tracking-tight">
                {product.name}
              </h1>
            </div>

            <StarRating rating={product.rating || 0} count={product.numReviews || 0} />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-barlow text-4xl font-black text-white">{fmt(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-brand-muted text-xl line-through">{fmt(product.originalPrice)}</span>
                  <span className="text-green-400 text-sm font-bold">Save {fmt(product.originalPrice - product.price)}</span>
                </>
              )}
            </div>

            <p className="text-brand-muted text-sm leading-relaxed">
              {product.shortDesc || product.description || 'Premium PC component for your build.'}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    In Stock {product.stock < 10 && `— Only ${product.stock} left`}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-red-400 text-sm font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex gap-3 pt-2">
              <div className="flex items-center border border-brand-border rounded overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-brand-muted hover:text-white hover:bg-brand-bg-card transition-all text-lg"
                >
                  -
                </button>
                <span className="px-5 py-3 text-white font-bold border-x border-brand-border">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-3 text-brand-muted hover:text-white hover:bg-brand-bg-card transition-all text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="btn-red flex-1 flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                ) : (
                  <FiShoppingCart size={16} />
                )}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <button
                onClick={toggleWishlist}
                className={`w-12 h-12 border rounded flex items-center justify-center transition-all ${
                  wishlist
                    ? 'border-brand-red bg-brand-red/10 text-brand-red'
                    : 'border-brand-border text-brand-muted hover:text-brand-red hover:border-brand-red'
                }`}
              >
                <FiHeart size={18} className={wishlist ? 'fill-brand-red' : ''} />
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: FiTruck, text: 'Free shipping over ₹50,000' },
                { icon: FiShield, text: '1-Year manufacturer warranty' },
                { icon: FiPackage, text: 'Genuine, sealed product' },
                { icon: FiZap, text: 'Fast delivery across India' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-brand-muted">
                  <Icon className="text-brand-red shrink-0" size={14} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Specs / Description Tabs */}
        <div className="border border-brand-border rounded-xl overflow-hidden">
          <div className="flex border-b border-brand-border">
            {['specs', 'description', 'compatibility'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-barlow font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-brand-red bg-brand-bg-card -mb-px'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 bg-brand-bg-card">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.specs?.length > 0 ? product.specs.map(({ key, value }, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-brand-border/50">
                    <span className="text-brand-muted text-sm">{key}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                )) : (
                  <p className="text-brand-muted text-sm col-span-2">No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  {product.description || product.shortDesc || 'No description available for this product.'}
                </p>
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-xs border border-brand-border text-brand-muted px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'compatibility' && (
              <div className="space-y-4">
                <p className="text-brand-muted text-sm">Key compatibility information for this component:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    product.socket && { label: 'CPU Socket', value: product.socket },
                    product.ramType && { label: 'RAM Type', value: product.ramType },
                    product.formFactor && { label: 'Form Factor', value: product.formFactor },
                    product.tdp && { label: 'TDP', value: `${product.tdp}W` },
                    product.wattage && { label: 'PSU Wattage', value: `${product.wattage}W` },
                    product.ramSpeed && { label: 'RAM Speed', value: `${product.ramSpeed}MHz` },
                    product.storageType && { label: 'Storage Type', value: product.storageType },
                    product.capacity && { label: 'Capacity', value: product.capacity },
                  ].filter(Boolean).map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3 bg-brand-bg-1 rounded-lg px-4 py-3">
                      <FiCheck className="text-green-400 shrink-0" size={16} />
                      <div>
                        <p className="text-brand-muted text-xs">{label}</p>
                        <p className="text-white text-sm font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                  {!product.socket && !product.ramType && !product.formFactor && !product.tdp && (
                    <p className="text-brand-muted text-sm col-span-2">Use the PC Builder tool to check full compatibility.</p>
                  )}
                </div>
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-2 mt-4 text-sm btn-outline-red py-2.5 px-5"
                >
                  <FiZap size={14} />
                  Open in PC Builder
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

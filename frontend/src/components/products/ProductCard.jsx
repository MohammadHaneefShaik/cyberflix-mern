import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiArrowUpRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const fmt = (n) => '\u20B9' + Number(n).toLocaleString('en-IN');

// ─── Category accent colors for gradient fallback ───────────────────────────
const CATEGORY_META = {
  cpu:          { label: 'CPU',         color: '#3B82F6', bg: '#1a2a3a' },
  gpu:          { label: 'GPU',         color: '#8B5CF6', bg: '#2a1a3a' },
  motherboard:  { label: 'MOBO',        color: '#10B981', bg: '#1a2a25' },
  ram:          { label: 'RAM',         color: '#F59E0B', bg: '#2a251a' },
  storage:      { label: 'SSD/HDD',    color: '#06B6D4', bg: '#1a2529' },
  psu:          { label: 'PSU',         color: '#EF4444', bg: '#2a1a1a' },
  case:         { label: 'CASE',        color: '#E53E2D', bg: '#2a1a18' },
  cooling:      { label: 'COOLER',      color: '#67E8F9', bg: '#1a2a2c' },
  fans:         { label: 'FANS',        color: '#A3E635', bg: '#1f2a1a' },
  monitors:     { label: 'MONITOR',     color: '#F472B6', bg: '#2a1a28' },
  peripherals:  { label: 'PERIPHERAL',  color: '#FB923C', bg: '#2a221a' },
  accessories:  { label: 'ACCESSORY',   color: '#94A3B8', bg: '#1e2027' },
};

// ─── Verified working Unsplash photo IDs (tested) ──────────────────────────
const CATEGORY_IMAGES = {
  cpu: [
    'https://images.unsplash.com/photo-1555617981-dac3772ef4e4?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591799265444-d66432b91588?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80&auto=format&fit=crop',
  ],
  gpu: [
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593640408182-31c228dbee4c?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&q=80&auto=format&fit=crop',
  ],
  motherboard: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1562976540-1502c2145851?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540829917886-91ab031b1764?w=500&q=80&auto=format&fit=crop',
  ],
  ram: [
    'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1562976540-1502c2145851?w=500&q=80&auto=format&fit=crop',
  ],
  storage: [
    'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500&q=80&auto=format&fit=crop',
  ],
  psu: [
    'https://images.unsplash.com/photo-1555617981-dac3772ef4e4?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80&auto=format&fit=crop',
  ],
  case: [
    'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=500&q=80&auto=format&fit=crop',
  ],
  cooling: [
    'https://images.unsplash.com/photo-1555617981-dac3772ef4e4?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=500&q=80&auto=format&fit=crop',
  ],
  fans: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80&auto=format&fit=crop',
  ],
  monitors: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616763355603-9755a912a1c0?w=500&q=80&auto=format&fit=crop',
  ],
  peripherals: [
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&q=80&auto=format&fit=crop',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&q=80&auto=format&fit=crop',
  ],
};

function getProductImage(product) {
  // Priority 1: database image
  if (product.images?.[0]?.url) return product.images[0].url;
  // Priority 2: deterministic Unsplash by category + name hash
  const imgs = CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.cpu;
  const hash = (product.name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return imgs[hash % imgs.length];
}

// Beautiful CSS gradient placeholder when image fails to load
function CategoryPlaceholder({ category, name }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.accessories;
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${meta.bg} 0%, #111111 100%)` }}
    >
      <div
        className="font-barlow font-black text-4xl mb-1 select-none"
        style={{ color: meta.color, opacity: 0.8 }}
      >
        {meta.label}
      </div>
      <div
        className="text-xs font-barlow uppercase tracking-widest text-center px-3 line-clamp-2 opacity-40"
        style={{ color: meta.color }}
      >
        {name?.split(' ').slice(0, 3).join(' ')}
      </div>
    </div>
  );
}

export default function ProductCard({ product, index = 0 }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addToCart } = useCartStore();
  const { user, toggleWishlist, isInWishlist } = useAuthStore();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(product._id);
  const imgSrc = getProductImage(product);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCart(product);
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Sign in to save to wishlist');
      return;
    }
    await toggleWishlist(product._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="group bg-[#111111] border border-[#222222] rounded-xl overflow-hidden hover:border-[#333333] transition-all duration-300"
    >
      <Link to={`/products/${product._id}`} className="flex flex-col h-full">
        {/* ── Image area ── */}
        <div className="relative overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: '4/3' }}>
          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-[#E53E2D] text-white text-[10px] font-barlow font-black px-2 py-0.5 rounded uppercase tracking-wider">
                -{discount}%
              </span>
            </div>
          )}
          {/* New badge */}
          {product.isNew && !discount && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-green-500 text-white text-[10px] font-barlow font-black px-2 py-0.5 rounded uppercase tracking-wider">
                New
              </span>
            </div>
          )}

          {/* Image or fallback */}
          {imgError ? (
            <CategoryPlaceholder category={product.category} name={product.name} />
          ) : (
            <>
              {/* Shimmer while loading */}
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#222222] to-[#1a1a1a] animate-pulse" />
              )}
              <img
                src={imgSrc}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => { setImgError(true); setImgLoaded(true); }}
                loading="lazy"
              />
            </>
          )}

          {/* Bestseller ribbon */}
          {product.isBestseller && (
            <div className="absolute bottom-2 left-2 z-10">
              <span className="text-[9px] font-barlow font-bold uppercase tracking-wider bg-[#111]/80 backdrop-blur-sm text-[#E53E2D] px-2 py-0.5 rounded border border-[#E53E2D]/20">
                Bestseller
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="text-[#888] text-xs font-semibold border border-[#333] px-3 py-1.5 rounded bg-[#111]">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 w-7 h-7 rounded border flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100 ${
              inWishlist
                ? 'bg-[#E53E2D]/20 border-[#E53E2D]/40 text-[#E53E2D]'
                : 'bg-[#111]/80 backdrop-blur-sm border-[#333] text-[#666] hover:text-[#E53E2D] hover:border-[#E53E2D]/30'
            }`}
          >
            <FiHeart className={`w-3 h-3 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* View details on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <div className="bg-[#111]/90 backdrop-blur-sm border-t border-[#222] py-2">
              <span className="flex items-center justify-center gap-1.5 text-[11px] text-[#888] font-medium">
                <FiArrowUpRight className="w-3 h-3" /> View Details
              </span>
            </div>
          </div>
        </div>

        {/* ── Product Info ── */}
        <div className="p-4 flex flex-col flex-1">
          {/* Brand */}
          <p className="text-[#E53E2D] text-[10px] font-semibold uppercase tracking-widest mb-1.5">{product.brand}</p>

          {/* Name */}
          <h3 className="text-white text-[13px] font-medium leading-snug mb-2 line-clamp-2 flex-1">
            {product.name}
          </h3>

          {/* Key specs pills */}
          {product.specs?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.specs.slice(0, 2).map((s, i) => (
                <span key={i} className="text-[9px] bg-[#0a0a0a] border border-[#1e1e1e] px-1.5 py-0.5 rounded text-[#666]">
                  {s.value || s}
                </span>
              ))}
            </div>
          )}

          {/* Star rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex gap-px">
              {[1, 2, 3, 4, 5].map(s => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-sm ${s <= Math.round(product.rating || 0) ? 'bg-amber-400' : 'bg-[#222]'}`}
                />
              ))}
            </div>
            <span className="text-[#666] text-[10px]">
              {(product.rating || 0).toFixed(1)} ({(product.numReviews || 0).toLocaleString()})
            </span>
          </div>

          {/* Price + Add to cart */}
          <div className="flex items-end justify-between gap-2 pt-3 border-t border-[#1e1e1e]">
            <div>
              <div className="text-white font-bold text-[15px] leading-none">
                {fmt(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-[#555] text-[11px] line-through mt-0.5">
                  {fmt(product.originalPrice)}
                </div>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-[11px] font-semibold transition-all flex-shrink-0 ${
                product.stock === 0
                  ? 'bg-[#1a1a1a] text-[#555] border border-[#222] cursor-not-allowed'
                  : 'bg-[#E53E2D] text-white hover:bg-[#c93525] active:scale-95'
              }`}
            >
              <FiShoppingCart className="w-3 h-3" />
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

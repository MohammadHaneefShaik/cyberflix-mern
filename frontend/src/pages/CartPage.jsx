import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';

const fmt = (n) => '\u20B9' + Number(n).toLocaleString('en-IN');

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=120&q=80';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQty, clearCart } = useCartStore();

  const subtotal = items.reduce((s, i) => s + (i.price || i.product?.price || 0) * i.qty, 0);
  const gst = Math.round(subtotal * 0.18);
  const shipping = subtotal > 50000 ? 0 : (subtotal === 0 ? 0 : 499);
  const total = subtotal + gst + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-16 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#333] flex items-center justify-center mb-6">
          <FiShoppingBag className="text-[#555]" size={36} />
        </div>
        <h2 className="font-barlow text-3xl font-black uppercase text-white mb-3">Your Cart is Empty</h2>
        <p className="text-[#666] text-sm mb-8 max-w-[320px]">
          Browse our catalog of premium PC components and start building.
        </p>
        <div className="flex gap-3">
          <Link
            to="/products"
            className="bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider px-6 py-3 rounded transition-colors flex items-center gap-2"
          >
            <FiShoppingBag size={16} />
            Shop Components
          </Link>
          <Link
            to="/builder"
            className="border border-[#333] hover:border-white text-white px-6 py-3 rounded transition-all text-sm"
          >
            Use PC Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-1.5 text-[#888] hover:text-white text-sm mb-2 transition-colors"
            >
              <FiArrowLeft size={14} /> Continue Shopping
            </button>
            <h1 className="font-barlow text-4xl font-black uppercase text-white">Shopping Cart</h1>
            <p className="text-[#666] text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-[#666] hover:text-red-400 border border-[#222] hover:border-red-400/30 px-3 py-2 rounded transition-all flex items-center gap-1.5"
          >
            <FiTrash2 size={12} /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => {
              const name  = item.name  || item.product?.name  || 'Product';
              const brand = item.brand || item.product?.brand || '';
              const price = item.price || item.product?.price || 0;
              const qty   = item.qty   || 1;
              const id    = item.product?._id || item.product || item._id;

              return (
                <motion.div
                  key={id || idx}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-4 bg-[#111111] border border-[#222222] rounded-xl p-4"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] shrink-0 overflow-hidden">
                    <img
                      src={item.image || FALLBACK_IMG}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = FALLBACK_IMG; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#888] text-xs uppercase tracking-wider mb-0.5">{brand}</p>
                    <p className="text-white font-medium leading-tight line-clamp-2">{name}</p>
                    <p className="text-[#E53E2D] font-bold text-lg mt-1 font-barlow">
                      {fmt(price * qty)}
                    </p>
                    {qty > 1 && (
                      <p className="text-[#666] text-xs">{fmt(price)} × {qty}</p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => removeFromCart(id)}
                      className="text-[#555] hover:text-red-400 transition-colors"
                    >
                      <FiTrash2 size={15} />
                    </button>
                    <div className="flex items-center border border-[#333] rounded-lg overflow-hidden">
                      <button
                        onClick={() => qty > 1 ? updateQty(id, qty - 1) : removeFromCart(id)}
                        className="px-3 py-2 text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-all"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="px-3 py-2 text-white font-medium text-sm border-x border-[#333]">{qty}</span>
                      <button
                        onClick={() => updateQty(id, qty + 1)}
                        className="px-3 py-2 text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-all"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 sticky top-24">
              <h3 className="font-barlow text-lg font-black uppercase text-white mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-[#888]">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#888]">
                  <span>GST (18%)</span>
                  <span>{fmt(gst)}</span>
                </div>
                <div className="flex justify-between text-[#888]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : fmt(shipping)}
                  </span>
                </div>
                {subtotal < 50000 && (
                  <p className="text-xs text-[#666] bg-[#1a1a1a] rounded px-3 py-2">
                    Add <span className="text-white font-medium">{fmt(50000 - subtotal)}</span> more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-[#222222]">
                  <span>Total</span>
                  <span className="text-[#E53E2D] font-barlow font-black text-2xl">{fmt(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider py-3.5 rounded flex items-center justify-center gap-2 transition-colors"
              >
                Checkout Now <FiArrowRight size={16} />
              </Link>

              <div className="mt-4 space-y-2">
                {['Secure Razorpay Payment', 'Genuine sealed products', '1-Year warranty'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-[#666]">
                    <div className="w-1 h-1 rounded-full bg-[#E53E2D]" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

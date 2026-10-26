import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiShoppingCart, FiArrowRight, FiMinus, FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const fmt = (n) => '\u20B9' + Number(n).toLocaleString('en-IN');

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQty } = useCartStore();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const subtotal = items.reduce((s, i) => s + (i.price || i.product?.price || 0) * i.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 50000 ? 0 : (subtotal === 0 ? 0 : 499);
  const grandTotal = subtotal + tax + shipping;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#111111] border-l border-[#222222] z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#222222] shrink-0">
              <div className="flex items-center gap-3">
                <FiShoppingCart className="text-[#E53E2D]" size={20} />
                <h2 className="font-barlow text-xl font-bold uppercase tracking-wider text-white">
                  Cart <span className="text-[#666] font-normal">({items.length})</span>
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded border border-[#222222] flex items-center justify-center text-[#666] hover:text-white hover:border-[#E53E2D] transition-all"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#333] flex items-center justify-center mb-5">
                    <FiShoppingCart className="text-[#555]" size={28} />
                  </div>
                  <p className="font-barlow text-xl font-bold uppercase text-white mb-2">Cart is Empty</p>
                  <p className="text-[#666] text-sm mb-6 max-w-[220px]">
                    Start building your setup — add components to get going.
                  </p>
                  <Link
                    to="/products"
                    onClick={closeCart}
                    className="bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider text-sm px-5 py-2.5 rounded transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                items.map((item, idx) => (
                  <CartItem
                    key={item._id || item.product?._id || idx}
                    item={item}
                    onRemove={removeFromCart}
                    onQty={updateQty}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#222222] px-6 py-5 shrink-0 space-y-3">
                {/* Price Breakdown */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#888]">
                    <span>Subtotal</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#888]">
                    <span>GST (18%)</span>
                    <span>{fmt(tax)}</span>
                  </div>
                  <div className="flex justify-between text-[#888]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : ''}>
                      {shipping === 0 ? 'FREE' : fmt(shipping)}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < 50000 && (
                    <p className="text-xs text-[#666] bg-[#1a1a1a] rounded px-3 py-1.5">
                      Add{' '}
                      <span className="text-white font-medium">{fmt(50000 - subtotal)}</span>{' '}
                      more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-[#222222]">
                    <span>Total</span>
                    <span>{fmt(grandTotal)}</span>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider py-3 rounded flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  Proceed to Checkout
                  <FiArrowRight size={15} />
                </button>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="w-full border border-[#333] hover:border-white text-white py-2.5 rounded flex items-center justify-center text-sm transition-all"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CartItem({ item, onRemove, onQty }) {
  const name  = item.name  || item.product?.name  || 'Product';
  const brand = item.brand || item.product?.brand || '';
  const price = item.price || item.product?.price || 0;
  const qty   = item.qty   || 1;
  const id    = item.product?._id || item.product || item._id;

  // Fallback image by category
  const FALLBACK = 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=120&q=80';

  return (
    <div className="flex gap-3 bg-[#1a1a1a] rounded-lg p-3 border border-[#222222]">
      <div className="w-14 h-14 rounded-lg bg-[#111] border border-[#2a2a2a] shrink-0 overflow-hidden flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={name} className="w-full h-full object-cover" onError={e => { e.target.src = FALLBACK; }} />
        ) : (
          <div className="text-xl opacity-40 font-barlow font-black text-white">
            {(item.category || 'PC')[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[#888] text-[10px] uppercase tracking-wider font-medium mb-0.5">{brand}</p>
        <p className="text-white text-sm font-medium leading-tight truncate">{name}</p>
        <p className="text-[#E53E2D] text-sm font-bold mt-0.5">
          {'\u20B9'}{Number(price).toLocaleString('en-IN')}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => qty > 1 ? onQty(id, qty - 1) : onRemove(id)}
            className="w-6 h-6 rounded border border-[#333] flex items-center justify-center text-[#888] hover:text-white hover:border-[#E53E2D] transition-all"
          >
            <FiMinus size={10} />
          </button>
          <span className="text-white text-xs font-medium w-4 text-center">{qty}</span>
          <button
            onClick={() => onQty(id, qty + 1)}
            className="w-6 h-6 rounded border border-[#333] flex items-center justify-center text-[#888] hover:text-white hover:border-[#E53E2D] transition-all"
          >
            <FiPlus size={10} />
          </button>
          <button
            onClick={() => onRemove(id)}
            className="ml-auto text-[#555] hover:text-red-400 transition-colors"
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

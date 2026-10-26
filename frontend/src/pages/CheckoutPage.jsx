import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiPhone, FiUser, FiArrowRight, FiShield, FiPackage } from 'react-icons/fi';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { orderAPI } from '../services/api';

const fmt = (n) => '\u20B9' + Number(n).toLocaleString('en-IN');

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

// Lazy-load Razorpay script to avoid 402 errors at page load
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + (i.price || i.product?.price || 0) * i.qty, 0);
  const gst = Math.round(subtotal * 0.18);
  const shipping = subtotal > 50000 ? 0 : 499;
  const total = subtotal + gst + shipping;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.pincode) {
      toast.error('Please complete all required fields');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error('Enter a valid 6-digit PIN code');
      return;
    }
    if (!items.length) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Load Razorpay lazily
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Payment system failed to load. Check your connection.');
        setLoading(false);
        return;
      }

      const orderItems = items.map(i => ({
        product: i.product?._id || i.product,
        qty: i.qty,
      }));

      const { data } = await orderAPI.create({
        orderItems,
        shippingAddress: form,
      });

      const { razorpayOrderId, amount, key, order } = data.data;

      // Launch Razorpay
      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'Cyberflix Systems LLP',
        description: 'PC Components Order',
        order_id: razorpayOrderId,
        prefill: {
          name: user?.name || form.name,
          email: user?.email || '',
          contact: form.phone,
        },
        theme: { color: '#E53E2D' },
        handler: async (response) => {
          try {
            await orderAPI.verifyPayment(order._id, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            await clearCart();
            toast.success('Order placed successfully!');
            navigate('/profile');
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => toast.error('Payment cancelled'),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-barlow text-4xl font-black uppercase text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
            {/* Shipping Details */}
            <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
              <h2 className="font-barlow text-lg font-black uppercase text-white mb-5 flex items-center gap-2">
                <FiMapPin className="text-[#E53E2D]" size={16} />
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666]" size={14} />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white placeholder-[#555] rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666]" size={14} />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white placeholder-[#555] rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={form.line1}
                    onChange={e => set('line1', e.target.value)}
                    placeholder="Flat / House No, Street, Area"
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white placeholder-[#555] rounded-lg px-4 py-3 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                    Address Line 2 (optional)
                  </label>
                  <input
                    type="text"
                    value={form.line2}
                    onChange={e => set('line2', e.target.value)}
                    placeholder="Landmark, Building name"
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white placeholder-[#555] rounded-lg px-4 py-3 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    placeholder="City"
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white placeholder-[#555] rounded-lg px-4 py-3 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={e => set('pincode', e.target.value)}
                    placeholder="6-digit PIN"
                    maxLength={6}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white placeholder-[#555] rounded-lg px-4 py-3 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                    State *
                  </label>
                  <select
                    value={form.state}
                    onChange={e => set('state', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm appearance-none cursor-pointer"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#111111] border border-[#222222] rounded-xl p-6">
              <h2 className="font-barlow text-lg font-black uppercase text-white mb-4 flex items-center gap-2">
                <FiShield className="text-[#E53E2D]" size={16} />
                Payment Method
              </h2>
              <div className="flex items-center gap-4 bg-[#1a1a1a] border border-[#E53E2D]/30 rounded-lg px-5 py-4">
                <div className="w-4 h-4 rounded-full border-2 border-[#E53E2D] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#E53E2D]" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Razorpay — UPI, Cards, Net Banking, Wallets</p>
                  <p className="text-[#888] text-xs">Secured by Razorpay. All transactions are encrypted.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !items.length}
              className="w-full bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
              ) : (
                <>Place Order & Pay {fmt(total)} <FiArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 sticky top-24">
              <h3 className="font-barlow text-lg font-black uppercase text-white mb-4 flex items-center gap-2">
                <FiPackage className="text-[#E53E2D]" size={16} />
                Order Summary
              </h3>

              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const name  = item.name  || item.product?.name  || 'Product';
                  const price = item.price || item.product?.price || 0;
                  const qty   = item.qty   || 1;
                  return (
                    <div key={idx} className="flex justify-between text-sm py-2 border-b border-[#1a1a1a]">
                      <span className="text-[#999] flex-1 pr-2 truncate">{name} × {qty}</span>
                      <span className="text-white shrink-0">{fmt(price * qty)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 text-sm pt-2">
                <div className="flex justify-between text-[#888]">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#888]">
                  <span>GST (18%)</span>
                  <span>{fmt(gst)}</span>
                </div>
                <div className="flex justify-between text-[#888]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : fmt(shipping)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-[#222222]">
                  <span>Total</span>
                  <span className="text-[#E53E2D] font-barlow font-black text-2xl">{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

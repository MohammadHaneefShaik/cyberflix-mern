import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiPackage, FiHeart, FiSettings, FiLogOut, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { orderAPI } from '../services/api';

const fmt = (n) => '\u20B9' + Number(n).toLocaleString('en-IN');

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(res => setOrders(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleSaveProfile = async () => {
    const result = await updateProfile(profileForm);
    if (result?.success) {
      toast.success('Profile updated');
      setEditing(false);
    } else {
      toast.error('Failed to update profile');
    }
  };

  const TABS = [
    { key: 'orders', label: 'My Orders', icon: FiPackage },
    { key: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { key: 'profile', label: 'Account', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 mb-4">
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-16 h-16 rounded-full bg-[#E53E2D]/10 border border-[#E53E2D]/30 flex items-center justify-center mb-3">
                  <span className="font-barlow text-2xl font-black text-[#E53E2D] uppercase">
                    {(user?.name || 'U')[0]}
                  </span>
                </div>
                <p className="text-white font-bold">{user?.name}</p>
                <p className="text-[#666] text-xs">{user?.email}</p>
              </div>

              <nav className="space-y-1">
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                      activeTab === key
                        ? 'bg-[#E53E2D]/10 text-white border border-[#E53E2D]/20'
                        : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <Icon size={15} className={activeTab === key ? 'text-[#E53E2D]' : ''} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <button
              onClick={() => { logout(); toast.success('Logged out'); }}
              className="w-full border border-[#333] hover:border-red-400/30 text-[#888] hover:text-red-400 px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              <FiLogOut size={14} /> Sign Out
            </button>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-barlow text-2xl font-black uppercase text-white mb-5">Order History</h2>

                {loadingOrders ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-[#111] rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-[#111111] border border-[#222222] rounded-xl p-12 text-center">
                    <FiPackage className="mx-auto text-[#444] mb-4" size={40} />
                    <p className="text-white font-barlow text-xl font-bold uppercase mb-2">No orders yet</p>
                    <p className="text-[#666] text-sm mb-5">Your completed orders will appear here.</p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider px-5 py-2.5 rounded text-sm transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="bg-[#111111] border border-[#222222] rounded-xl p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-[#666] text-xs mb-1">Order ID</p>
                            <p className="text-white font-mono text-sm">{order._id.slice(-12).toUpperCase()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#666] text-xs mb-1">Date</p>
                            <p className="text-white text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-[#666] text-xs mb-1">Total</p>
                            <p className="text-[#E53E2D] font-barlow font-black text-lg">{fmt(order.totalPrice)}</p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full border font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-[#1a1a1a] text-[#888] border-[#333]'}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#666] space-y-1">
                          {order.orderItems?.slice(0, 3).map((item, i) => (
                            <span key={i} className="inline-block bg-[#1a1a1a] rounded px-2 py-1 mr-2 mb-1">{item.name}</span>
                          ))}
                          {order.orderItems?.length > 3 && (
                            <span className="text-[#E53E2D]">+{order.orderItems.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-barlow text-2xl font-black uppercase text-white mb-5">Wishlist</h2>
                <div className="bg-[#111111] border border-[#222222] rounded-xl p-12 text-center">
                  <FiHeart className="mx-auto text-[#444] mb-4" size={40} />
                  <p className="text-white font-barlow text-xl font-bold uppercase mb-2">Wishlist is empty</p>
                  <p className="text-[#666] text-sm mb-5">Save products you like by clicking the heart icon.</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider px-5 py-2.5 rounded text-sm transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-barlow text-2xl font-black uppercase text-white">Account Settings</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 border border-[#333] hover:border-[#E53E2D] text-[#888] hover:text-white px-4 py-2 rounded-lg text-sm transition-all"
                    >
                      <FiEdit2 size={13} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-1.5 bg-[#E53E2D] hover:bg-[#c93525] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        <FiCheck size={13} /> Save
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-1.5 border border-[#333] text-[#888] hover:text-white px-4 py-2 rounded-lg text-sm transition-all"
                      >
                        <FiX size={13} /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-5">
                  {[
                    { label: 'Full Name', icon: FiUser, key: 'name', value: profileForm.name, type: 'text' },
                    { label: 'Email Address', icon: FiMail, key: null, value: user?.email, type: 'email', disabled: true },
                    { label: 'Mobile Number', icon: FiPhone, key: 'phone', value: profileForm.phone, type: 'tel' },
                  ].map(({ label, icon: Icon, key, value, type, disabled }) => (
                    <div key={label}>
                      <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                        {label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={14} />
                        <input
                          type={type}
                          value={value}
                          onChange={key && editing ? e => setProfileForm(f => ({ ...f, [key]: e.target.value })) : undefined}
                          disabled={!editing || disabled}
                          className={`w-full bg-[#0a0a0a] border text-white rounded-lg px-4 py-3 pl-11 text-sm transition-colors ${
                            !editing || disabled
                              ? 'border-[#222] text-[#666] cursor-default'
                              : 'border-[#333] focus:outline-none focus:border-[#E53E2D]'
                          }`}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <p className="text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">Account Type</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                      user?.role === 'admin'
                        ? 'bg-[#E53E2D]/10 text-[#E53E2D] border-[#E53E2D]/20'
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

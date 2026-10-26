import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBox, FiPackage, FiUsers, FiTrendingUp, FiDollarSign, FiShoppingCart, FiLogOut, FiGrid } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { adminAPI } from '../services/api';
import AdminProductsPage from './AdminProductsPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminUsersPage from './AdminUsersPage';

const fmt = (n) => '\u20B9' + Number(n).toLocaleString('en-IN');

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: FiGrid, path: '/admin' },
  { key: 'products', label: 'Products', icon: FiBox, path: '/admin/products' },
  { key: 'orders', label: 'Orders', icon: FiPackage, path: '/admin/orders' },
  { key: 'users', label: 'Users', icon: FiUsers, path: '/admin/users' },
];

function DashboardHome({ stats, loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-[#1a1a1a] rounded-xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-[#1a1a1a] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-barlow text-2xl font-black uppercase text-white mb-1">Overview</h2>
        <p className="text-[#666] text-sm">Store performance at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(stats?.totalRevenue || 0), icon: FiDollarSign, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FiShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Active Products', value: stats?.totalProducts || 0, icon: FiBox, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          { label: 'Customers', value: stats?.totalUsers || 0, icon: FiUsers, color: 'text-[#E53E2D]', bg: 'bg-[#E53E2D]/10', border: 'border-[#E53E2D]/20' },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-[#111111] border ${border} rounded-xl p-5`}>
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={color} size={18} />
            </div>
            <p className={`font-barlow text-3xl font-black ${color}`}>{value}</p>
            <p className="text-[#666] text-xs mt-0.5 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NAV.slice(1).map(({ key, label, icon: Icon, path }) => (
          <Link key={key} to={path} className="bg-[#111111] border border-[#222] hover:border-[#E53E2D]/40 rounded-xl p-5 flex items-center gap-4 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-[#E53E2D]/10 group-hover:bg-[#E53E2D]/20 flex items-center justify-center transition-colors">
              <Icon className="text-[#E53E2D]" size={18} />
            </div>
            <div>
              <p className="text-white font-barlow font-bold uppercase tracking-wide text-sm">Manage {label}</p>
              <p className="text-[#666] text-xs">View and edit all {label.toLowerCase()}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#111111] border border-[#222] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1e1e1e]">
          <h3 className="font-barlow text-base font-black uppercase text-white">Recent Orders</h3>
        </div>
        {!stats?.recentOrders?.length ? (
          <div className="py-12 text-center text-[#555] text-sm">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#1a1a1a]">
                <tr className="text-[#666] text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Order ID</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {stats.recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3 font-mono text-[#888] text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3">
                      <p className="text-white text-sm">{order.user?.name || 'Guest'}</p>
                      <p className="text-[#666] text-xs">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-3 text-[#888]">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3 text-[#E53E2D] font-barlow font-black">{fmt(order.totalPrice)}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full border capitalize bg-[#1a1a1a] text-[#888] border-[#333]">{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  // Determine active page from URL
  const path = location.pathname;
  const activePage = path.includes('/admin/products') ? 'products'
    : path.includes('/admin/orders') ? 'orders'
    : path.includes('/admin/users') ? 'users'
    : 'dashboard';

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            <div className="bg-[#111111] border border-[#222] rounded-xl p-4 sticky top-24">
              {/* Admin badge */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#1e1e1e]">
                <div className="w-9 h-9 rounded-lg bg-[#E53E2D]/10 border border-[#E53E2D]/20 flex items-center justify-center">
                  <span className="font-barlow font-black text-[#E53E2D] text-base">{(user?.name||'A')[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
                  <p className="text-[#E53E2D] text-[10px] font-barlow font-bold uppercase tracking-wider">Admin</p>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="space-y-1">
                {NAV.map(({ key, label, icon: Icon, path: navPath }) => (
                  <Link
                    key={key}
                    to={navPath}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      activePage === key
                        ? 'bg-[#E53E2D]/10 text-white border border-[#E53E2D]/20'
                        : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <Icon size={15} className={activePage === key ? 'text-[#E53E2D]' : ''} />
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-4 border-t border-[#1e1e1e]" />

              <Link
                to="/"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#666] hover:text-white hover:bg-[#1a1a1a] transition-all"
              >
                <FiTrendingUp size={15} />
                View Store
              </Link>
              <button
                onClick={() => { logout(); toast.success('Signed out'); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#666] hover:text-red-400 hover:bg-red-400/5 transition-all mt-1"
              >
                <FiLogOut size={15} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {activePage === 'dashboard' && <DashboardHome stats={stats} loading={loadingStats} />}
            {activePage === 'products' && <AdminProductsPage />}
            {activePage === 'orders' && <AdminOrdersPage />}
            {activePage === 'users' && <AdminUsersPage />}
          </main>
        </div>
      </div>
    </div>
  );
}

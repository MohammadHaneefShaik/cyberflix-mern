import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiChevronDown, FiPackage, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { adminAPI } from '../services/api';

const fmt = (n) => '\u20B9' + Number(n).toLocaleString('en-IN');

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];

const STATUS_COLORS = {
  pending:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  shipped:    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  delivered:  'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
  refunded:   'bg-[#333] text-[#888] border-[#444]',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [updating, setUpdating] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await adminAPI.getAllOrders(params);
      setOrders(data.data || []);
      setPagination(data.pagination || { pages: 1, total: 0 });
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to "${newStatus}"`);
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const filtered = search
    ? orders.filter(o =>
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-barlow text-2xl font-black uppercase text-white">Orders</h2>
          <p className="text-[#666] text-sm">{pagination.total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..." className="w-full bg-[#111] border border-[#333] text-white placeholder-[#555] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
        </div>
        <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}} className="bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D] appearance-none cursor-pointer">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111111] border border-[#222] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({length:8}).map((_,i)=><div key={i} className="h-16 bg-[#1a1a1a] rounded animate-pulse"/>)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#1a1a1a]">
                <tr className="text-[#666] text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Order</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 font-medium">Payment</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-[#555]">No orders found.</td></tr>
                ) : filtered.map(order => (
                  <>
                    <tr
                      key={order._id}
                      className="hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    >
                      <td className="px-5 py-3">
                        <p className="text-white font-mono text-xs">#{order._id.slice(-10).toUpperCase()}</p>
                        <p className="text-[#666] text-xs">{order.orderItems?.length} item(s)</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-white text-sm">{order.user?.name || 'Guest'}</p>
                        <p className="text-[#666] text-xs">{order.user?.email}</p>
                      </td>
                      <td className="px-5 py-3 text-[#888]">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3 text-[#E53E2D] font-bold font-barlow">{fmt(order.totalPrice)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${order.isPaid ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${STATUS_COLORS[order.status] || ''}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end" onClick={e => e.stopPropagation()}>
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={e => handleStatusChange(order._id, e.target.value)}
                              disabled={updating === order._id}
                              className="bg-[#1a1a1a] border border-[#333] text-[#888] hover:text-white rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#E53E2D] cursor-pointer appearance-none pr-7 disabled:opacity-50"
                            >
                              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                            </select>
                            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" size={10} />
                          </div>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded row — order items */}
                    {expandedOrder === order._id && (
                      <tr key={order._id + '-expand'} className="bg-[#0d0d0d]">
                        <td colSpan={7} className="px-5 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Items */}
                            <div>
                              <p className="text-[#666] text-xs uppercase tracking-wider mb-2">Order Items</p>
                              <div className="space-y-1.5">
                                {order.orderItems?.map((item, i) => (
                                  <div key={i} className="flex justify-between text-xs">
                                    <span className="text-[#999]">{item.name} × {item.qty}</span>
                                    <span className="text-white">{fmt(item.price * item.qty)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Shipping */}
                            <div>
                              <p className="text-[#666] text-xs uppercase tracking-wider mb-2">Shipping Address</p>
                              {order.shippingAddress ? (
                                <div className="text-xs text-[#999] space-y-0.5">
                                  <p className="text-white">{order.shippingAddress.name}</p>
                                  <p>{order.shippingAddress.line1}</p>
                                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                                  <p>📞 {order.shippingAddress.phone}</p>
                                </div>
                              ) : <p className="text-[#555] text-xs">No shipping address</p>}
                            </div>
                          </div>
                          <div className="flex gap-4 mt-3 pt-3 border-t border-[#1a1a1a] text-xs text-[#666]">
                            <span>Subtotal: {fmt(order.itemsPrice)}</span>
                            <span>GST: {fmt(order.taxPrice)}</span>
                            <span>Shipping: {order.shippingPrice === 0 ? 'FREE' : fmt(order.shippingPrice)}</span>
                            <span className="text-white font-bold">Total: {fmt(order.totalPrice)}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-4 py-2 border border-[#333] text-[#888] hover:text-white hover:border-[#E53E2D] rounded text-sm transition-all disabled:opacity-40">Prev</button>
          <span className="text-[#666] text-sm">Page {page} of {pagination.pages}</span>
          <button disabled={page>=pagination.pages} onClick={()=>setPage(p=>p+1)} className="px-4 py-2 border border-[#333] text-[#888] hover:text-white hover:border-[#E53E2D] rounded text-sm transition-all disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}

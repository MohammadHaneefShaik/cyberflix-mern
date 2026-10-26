import { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiShield, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { adminAPI } from '../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    adminAPI.getUsers()
      .then(res => setUsers(res.data.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchRole = roleFilter ? u.role === roleFilter : true;
    const matchSearch = search
      ? u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-barlow text-2xl font-black uppercase text-white">Users</h2>
        <p className="text-[#666] text-sm">{users.length} total accounts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full bg-[#111] border border-[#333] text-white placeholder-[#555] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
        </div>
        <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D] appearance-none cursor-pointer">
          <option value="">All Roles</option>
          <option value="user">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'text-white' },
          { label: 'Customers', value: users.filter(u=>u.role==='user').length, color: 'text-blue-400' },
          { label: 'Admins', value: users.filter(u=>u.role==='admin').length, color: 'text-[#E53E2D]' },
          { label: 'With Phone', value: users.filter(u=>u.phone).length, color: 'text-green-400' },
        ].map(({label, value, color}) => (
          <div key={label} className="bg-[#111111] border border-[#222] rounded-xl p-4">
            <p className={`font-barlow text-2xl font-black ${color}`}>{value}</p>
            <p className="text-[#666] text-xs uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({length:9}).map((_,i)=><div key={i} className="h-32 bg-[#111] rounded-xl animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-[#555]">No users found.</div>
          ) : filtered.map(user => (
            <div key={user._id} className="bg-[#111111] border border-[#222] rounded-xl p-5 hover:border-[#333] transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-barlow font-black text-lg ${user.role === 'admin' ? 'bg-[#E53E2D]/10 text-[#E53E2D] border border-[#E53E2D]/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                  {(user.name||'U')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{user.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${user.role === 'admin' ? 'bg-[#E53E2D]/10 text-[#E53E2D] border-[#E53E2D]/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                    {user.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-[#888]">
                <div className="flex items-center gap-2">
                  <FiMail size={11} className="text-[#555] shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone size={11} className="text-[#555] shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FiCalendar size={11} className="text-[#555] shrink-0" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
                {user.wishlist?.length > 0 && (
                  <p className="text-[#555]">{user.wishlist.length} item(s) in wishlist</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

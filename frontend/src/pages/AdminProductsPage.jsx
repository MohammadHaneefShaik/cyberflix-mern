import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck, FiChevronDown, FiPackage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { adminAPI, productAPI } from '../services/api';

const CATEGORIES = ['cpu','gpu','motherboard','ram','storage','psu','case','cooling','fans','monitors','peripherals','accessories'];
const fmt = (n) => '\u20B9' + Number(n).toLocaleString('en-IN');

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#333] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] shrink-0">
          <h3 className="font-barlow text-xl font-black uppercase text-white">{title}</h3>
          <button onClick={onClose} className="text-[#666] hover:text-white transition-colors"><FiX size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { name:'', brand:'', category:'cpu', price:'', originalPrice:'', stock:'', shortDesc:'', description:'', socket:'', ramType:'', formFactor:'', tdp:'', wattage:'', isFeatured:false, isBestseller:false, isNew:false };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (catFilter) params.category = catFilter;
      const { data } = await productAPI.getAll(params);
      setProducts(data.data || []);
      setPagination(data.pagination || { pages: 1, total: 0 });
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [page, catFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingProduct(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name||'', brand: p.brand||'', category: p.category||'cpu',
      price: p.price||'', originalPrice: p.originalPrice||'', stock: p.stock||'',
      shortDesc: p.shortDesc||'', description: p.description||'',
      socket: p.socket||'', ramType: p.ramType||'', formFactor: p.formFactor||'',
      tdp: p.tdp||'', wattage: p.wattage||'',
      isFeatured: p.isFeatured||false, isBestseller: p.isBestseller||false, isNew: p.isNew||false,
    });
    setEditingProduct(p);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.price) { toast.error('Name, Brand and Price are required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock) || 0,
        tdp: form.tdp ? Number(form.tdp) : undefined,
        wattage: form.wattage ? Number(form.wattage) : undefined,
      };
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct._id, payload);
        toast.success('Product updated');
      } else {
        await adminAPI.createProduct(payload);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product removed');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    : products;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-barlow text-2xl font-black uppercase text-white">Products</h2>
          <p className="text-[#666] text-sm">{pagination.total} total products</p>
        </div>
        <button onClick={openAdd} className="bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider px-5 py-2.5 rounded flex items-center gap-2 text-sm transition-colors">
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-[#111] border border-[#333] text-white placeholder-[#555] rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D] transition-colors"
          />
        </div>
        <select
          value={catFilter}
          onChange={e => { setCatFilter(e.target.value); setPage(1); }}
          className="bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D] appearance-none cursor-pointer min-w-[160px]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#222] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({length:8}).map((_,i) => <div key={i} className="h-12 bg-[#1a1a1a] rounded animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#1a1a1a]">
                <tr className="text-[#666] text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Product</th>
                  <th className="text-left px-5 py-3 font-medium">Category</th>
                  <th className="text-left px-5 py-3 font-medium">Price</th>
                  <th className="text-left px-5 py-3 font-medium">Stock</th>
                  <th className="text-left px-5 py-3 font-medium">Flags</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-[#555]">No products found.</td></tr>
                ) : filtered.map(p => (
                  <tr key={p._id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-white font-medium line-clamp-1">{p.name}</p>
                      <p className="text-[#666] text-xs">{p.brand}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-[#1a1a1a] border border-[#333] text-[#888] text-xs px-2 py-0.5 rounded uppercase">{p.category}</span>
                    </td>
                    <td className="px-5 py-3 text-[#E53E2D] font-bold font-barlow">{fmt(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium ${p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {p.isFeatured && <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] px-1.5 py-0.5 rounded">Featured</span>}
                        {p.isBestseller && <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] px-1.5 py-0.5 rounded">Bestseller</span>}
                        {p.isNew && <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] px-1.5 py-0.5 rounded">New</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="text-[#888] hover:text-white border border-[#333] hover:border-[#E53E2D] p-1.5 rounded transition-all"><FiEdit2 size={13} /></button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="text-[#888] hover:text-red-400 border border-[#333] hover:border-red-400/40 p-1.5 rounded transition-all"><FiTrash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-4 py-2 border border-[#333] text-[#888] hover:text-white hover:border-[#E53E2D] rounded text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
          <span className="text-[#666] text-sm">Page {page} of {pagination.pages}</span>
          <button disabled={page>=pagination.pages} onClick={()=>setPage(p=>p+1)} className="px-4 py-2 border border-[#333] text-[#888] hover:text-white hover:border-[#E53E2D] rounded text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editingProduct ? 'Edit Product' : 'Add New Product'} onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">Product Name *</label>
              <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. AMD Ryzen 9 9950X" className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* Brand */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">Brand *</label>
              <input value={form.brand} onChange={e=>set('brand',e.target.value)} placeholder="AMD, Intel, NVIDIA..." className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">Category *</label>
              <select value={form.category} onChange={e=>set('category',e.target.value)} className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D] cursor-pointer">
                {CATEGORIES.map(c=><option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>
            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e=>set('price',e.target.value)} placeholder="25000" className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* Original Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e=>set('originalPrice',e.target.value)} placeholder="30000 (for sale)" className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* Stock */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">Stock Quantity</label>
              <input type="number" value={form.stock} onChange={e=>set('stock',e.target.value)} placeholder="50" className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* Socket */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">Socket (CPU/MOBO)</label>
              <input value={form.socket} onChange={e=>set('socket',e.target.value)} placeholder="AM5, LGA1700..." className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* RAM Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">RAM Type</label>
              <input value={form.ramType} onChange={e=>set('ramType',e.target.value)} placeholder="DDR5, DDR4..." className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* TDP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">TDP (Watts)</label>
              <input type="number" value={form.tdp} onChange={e=>set('tdp',e.target.value)} placeholder="125" className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* Wattage */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">PSU Wattage</label>
              <input type="number" value={form.wattage} onChange={e=>set('wattage',e.target.value)} placeholder="850" className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* Short Desc */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">Short Description</label>
              <input value={form.shortDesc} onChange={e=>set('shortDesc',e.target.value)} placeholder="One-line product tagline" className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D]" />
            </div>
            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1.5">Full Description</label>
              <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3} placeholder="Detailed product description..." className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E53E2D] resize-none" />
            </div>
            {/* Flags */}
            <div className="sm:col-span-2 flex gap-6">
              {[['isFeatured','Featured'],['isBestseller','Bestseller'],['isNew','New Arrival']].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[key]} onChange={e=>set(key, e.target.checked)} className="w-4 h-4 accent-[#E53E2D]" />
                  <span className="text-[#888] text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-5 border-t border-[#222]">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider py-3 rounded transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> : <FiCheck size={16} />}
              {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </button>
            <button onClick={() => setShowModal(false)} className="px-5 border border-[#333] text-[#888] hover:text-white rounded transition-all">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

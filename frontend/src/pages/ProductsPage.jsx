import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiFilter, FiX, FiSearch, FiChevronDown, FiGrid, FiList, FiSliders } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const CATEGORIES = [
  { key: '', label: 'All Products' },
  { key: 'cpu', label: 'CPUs' },
  { key: 'gpu', label: 'Graphics Cards' },
  { key: 'motherboard', label: 'Motherboards' },
  { key: 'ram', label: 'Memory' },
  { key: 'storage', label: 'Storage' },
  { key: 'psu', label: 'Power Supplies' },
  { key: 'case', label: 'PC Cases' },
  { key: 'cooling', label: 'CPU Cooling' },
  { key: 'fans', label: 'Case Fans' },
  { key: 'monitors', label: 'Monitors' },
  { key: 'peripherals', label: 'Peripherals' },
  { key: 'accessories', label: 'Accessories' },
];

const BRANDS = ['AMD', 'Intel', 'NVIDIA', 'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'G.Skill', 'Kingston', 'Samsung', 'WD', 'Seagate', 'be quiet!', 'Noctua', 'DeepCool', 'Lian Li', 'NZXT', 'Fractal', 'Cooler Master', 'Thermaltake'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'New Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

function SkeletonCard() {
  return (
    <div className="bg-brand-bg-card border border-brand-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-brand-bg-1" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-brand-bg-1 rounded w-1/3" />
        <div className="h-4 bg-brand-bg-1 rounded w-4/5" />
        <div className="h-4 bg-brand-bg-1 rounded w-3/5" />
        <div className="h-5 bg-brand-bg-1 rounded w-2/5" />
        <div className="h-9 bg-brand-bg-1 rounded" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'default';
  const page = parseInt(searchParams.get('page') || '1');
  const searchQ = searchParams.get('q') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, sort, limit: 24 };
      if (category) params.category = category;
      if (selectedBrands.length) params.brand = selectedBrands.join(',');
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;
      if (inStockOnly) params.inStock = true;
      if (searchQ) {
        const res = await productAPI.search(searchQ);
        setProducts(res.data.data || []);
        setPagination({ page: 1, pages: 1, total: res.data.data?.length || 0 });
      } else {
        const res = await productAPI.getAll(params);
        setProducts(res.data.data || []);
        setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort, page, selectedBrands, priceRange, inStockOnly, searchQ]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
    setSearchParams({});
  };

  const activeFilterCount = selectedBrands.length + (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0) + (inStockOnly ? 1 : 0) + (category ? 1 : 0);

  const currentCategory = CATEGORIES.find(c => c.key === category);

  return (
    <div className="min-h-screen bg-brand-bg pt-16">
      {/* Page Header */}
      <div className="bg-brand-bg-1 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <nav className="text-xs text-brand-muted mb-3 flex items-center gap-1.5">
            <span className="hover:text-white cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span className="text-white">Products</span>
            {currentCategory?.label && currentCategory.label !== 'All Products' && (
              <>
                <span>/</span>
                <span className="text-brand-red">{currentCategory.label}</span>
              </>
            )}
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="heading-xl text-4xl">
                {searchQ ? `Search: "${searchQ}"` : (currentCategory?.label || 'All Products')}
              </h1>
              <p className="text-brand-muted text-sm mt-1">
                {loading ? 'Loading...' : `${pagination.total} products found`}
              </p>
            </div>
            {/* Search bar */}
            <form
              className="flex gap-2 w-full md:w-[320px]"
              onSubmit={e => { e.preventDefault(); setParam('q', e.target.q.value); }}
            >
              <input
                name="q"
                defaultValue={searchQ}
                placeholder="Search products..."
                className="input flex-1 text-sm py-2"
              />
              <button type="submit" className="btn-red py-2 px-4">
                <FiSearch size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-brand-bg-1 border-b border-brand-border overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 py-3 min-w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setParam('category', cat.key)}
              className={`px-4 py-1.5 rounded text-xs font-barlow font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 ${
                category === cat.key
                  ? 'bg-brand-red text-white'
                  : 'text-brand-muted hover:text-white hover:bg-brand-bg-card border border-transparent hover:border-brand-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar — Desktop */}
          <aside className="hidden lg:block w-60 shrink-0 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-barlow text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <FiSliders size={14} className="text-brand-red" />
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-brand-red hover:text-red-300 transition-colors">
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>

            {/* In Stock */}
            <FilterSection title="Availability">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-brand-red"
                />
                <span className="text-brand-muted text-sm group-hover:text-white transition-colors">In Stock Only</span>
              </label>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={priceRange.min}
                  onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                  className="input text-xs py-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={priceRange.max}
                  onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                  className="input text-xs py-2 w-full"
                />
              </div>
              <button
                onClick={fetchProducts}
                className="w-full mt-2 text-xs py-1.5 border border-brand-border text-brand-muted hover:text-white hover:border-brand-red rounded transition-all"
              >
                Apply Price Filter
              </button>
            </FilterSection>

            {/* Brands */}
            <FilterSection title="Brand">
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                {BRANDS.map(brand => (
                  <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 accent-brand-red shrink-0"
                    />
                    <span className="text-brand-muted text-sm group-hover:text-white transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 text-sm text-brand-muted border border-brand-border rounded px-3 py-2 hover:text-white hover:border-brand-red transition-all"
              >
                <FiFilter size={14} />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              <div className="hidden lg:block" />

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-brand-muted text-xs hidden sm:block">Sort by</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setParam('sort', e.target.value)}
                    className="bg-brand-bg-card border border-brand-border text-white text-sm rounded px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-brand-red cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" size={14} />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-brand-border flex items-center justify-center mx-auto mb-5">
                  <FiSearch className="text-brand-muted" size={28} />
                </div>
                <p className="font-barlow text-2xl font-bold uppercase text-white mb-2">No Products Found</p>
                <p className="text-brand-muted text-sm mb-6">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn-red text-sm py-2.5 px-6">Clear Filters</button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.4) }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setParam('page', Math.max(1, page - 1).toString())}
                  disabled={page <= 1}
                  className="px-4 py-2 border border-brand-border rounded text-sm text-brand-muted hover:text-white hover:border-brand-red transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setParam('page', p.toString())}
                      className={`w-9 h-9 rounded text-sm transition-all ${
                        page === p
                          ? 'bg-brand-red text-white border border-brand-red'
                          : 'border border-brand-border text-brand-muted hover:text-white hover:border-brand-red'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setParam('page', Math.min(pagination.pages, page + 1).toString())}
                  disabled={page >= pagination.pages}
                  className="px-4 py-2 border border-brand-border rounded text-sm text-brand-muted hover:text-white hover:border-brand-red transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[200]"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 bg-brand-bg-card border-r border-brand-border z-[201] overflow-y-auto p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-barlow text-lg font-bold uppercase tracking-wider text-white">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-brand-muted hover:text-white">
                  <FiX size={20} />
                </button>
              </div>

              {activeFilterCount > 0 && (
                <button onClick={() => { clearFilters(); setShowFilters(false); }} className="text-xs text-brand-red hover:text-red-300 transition-colors">
                  Clear all ({activeFilterCount})
                </button>
              )}

              <FilterSection title="Availability">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-brand-red" />
                  <span className="text-brand-muted text-sm">In Stock Only</span>
                </label>
              </FilterSection>

              <FilterSection title="Price Range">
                <div className="flex gap-2">
                  <input type="number" placeholder="Min ₹" value={priceRange.min} onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))} className="input text-xs py-2 w-full" />
                  <input type="number" placeholder="Max ₹" value={priceRange.max} onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))} className="input text-xs py-2 w-full" />
                </div>
              </FilterSection>

              <FilterSection title="Brand">
                <div className="space-y-2">
                  {BRANDS.map(brand => (
                    <label key={brand} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="w-4 h-4 accent-brand-red" />
                      <span className="text-brand-muted text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <button onClick={() => setShowFilters(false)} className="w-full btn-red py-3">Apply Filters</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-brand-border pb-5">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="font-barlow text-xs font-bold uppercase tracking-[0.12em] text-white/70 group-hover:text-white transition-colors">
          {title}
        </span>
        <FiChevronDown
          size={13}
          className={`text-brand-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

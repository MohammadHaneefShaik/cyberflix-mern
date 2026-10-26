import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiChevronDown, FiUser, FiGlobe, FiHeadphones } from 'react-icons/fi';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const SHOP_MEGA = [
  {
    section: 'Processors',
    items: [
      { label: 'AMD Ryzen 9000 Series', to: '/products?category=cpu&brand=AMD', tag: 'New' },
      { label: 'Intel Core Ultra Series', to: '/products?category=cpu&brand=Intel', tag: 'New' },
      { label: 'AMD Ryzen Threadripper', to: '/products?category=cpu', tag: 'HEDT' },
      { label: 'All Processors', to: '/products?category=cpu' },
    ]
  },
  {
    section: 'Graphics Cards',
    items: [
      { label: 'NVIDIA RTX 50 Series', to: '/products?category=gpu&brand=NVIDIA', tag: 'Latest' },
      { label: 'AMD Radeon RX 9000', to: '/products?category=gpu&brand=AMD', tag: 'New' },
      { label: 'RTX 40 Series', to: '/products?category=gpu' },
      { label: 'All Graphics Cards', to: '/products?category=gpu' },
    ]
  },
  {
    section: 'Memory & Storage',
    items: [
      { label: 'DDR5 RAM Kits', to: '/products?category=ram' },
      { label: 'NVMe SSD PCIe 4.0', to: '/products?category=storage' },
      { label: 'High-Capacity HDD', to: '/products?category=storage' },
      { label: 'View All Storage', to: '/products?category=storage' },
    ]
  },
  {
    section: 'Build Essentials',
    items: [
      { label: 'Motherboards', to: '/products?category=motherboard' },
      { label: 'Power Supplies', to: '/products?category=psu' },
      { label: 'PC Cases', to: '/products?category=case' },
      { label: 'Cooling Solutions', to: '/products?category=cooling' },
    ]
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopOpen, setShopOpen] = useState(false);
  const { items, openCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') { setSearchOpen(false); setShopOpen(false); }};
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top strip */}
      <div className="bg-brand-bg-1 border-b border-brand-border h-8 hidden lg:flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] font-inter text-brand-muted tracking-wider uppercase">
            <span>PC Experts</span>
            <span className="text-brand-border">•</span>
            <span>Components</span>
            <span className="text-brand-border">•</span>
            <span>Custom Builds</span>
          </div>
          <div className="flex items-center gap-5 text-[11px] font-inter text-brand-muted">
            <button className="flex items-center gap-1.5 hover:text-white transition-colors uppercase tracking-wide">
              <FiGlobe className="w-3 h-3" /> India
            </button>
            <button className="flex items-center gap-1.5 hover:text-white transition-colors uppercase tracking-wide">
              <FiHeadphones className="w-3 h-3" /> Support
              <FiChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-bg/95 backdrop-blur-xl border-b border-brand-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-brand-bg border-b border-brand-border/60'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-[62px] gap-8">

            {/* Logo */}
            <Link to="/" className="flex flex-col flex-shrink-0 group">
              <span className="font-barlow font-black text-white text-[22px] leading-none tracking-tight group-hover:text-brand-red transition-colors duration-200">
                CYBERFLIX
              </span>
              <span className="text-brand-muted text-[9px] font-inter tracking-[0.3em] uppercase leading-none mt-0.5">
                SYSTEMS LLP
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {/* Shop Components Mega */}
              <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
                <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-inter font-medium rounded transition-colors duration-150 ${shopOpen ? 'text-white bg-white/5' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}>
                  Shop Components <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-[680px] bg-brand-bg-1 border border-brand-border rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
                    >
                      <div className="grid grid-cols-4 gap-0 p-5">
                        {SHOP_MEGA.map((col) => (
                          <div key={col.section} className="pr-4">
                            <p className="text-brand-red text-[10px] font-inter font-semibold uppercase tracking-widest mb-3">{col.section}</p>
                            <ul className="space-y-0.5">
                              {col.items.map(item => (
                                <li key={item.label}>
                                  <Link to={item.to} onClick={() => setShopOpen(false)} className="flex items-center gap-2 text-brand-muted text-[13px] font-inter py-1.5 hover:text-white transition-colors group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-150">{item.label}</span>
                                    {item.tag && <span className="text-[9px] bg-brand-red/15 text-brand-red px-1.5 py-0.5 rounded-sm font-semibold uppercase">{item.tag}</span>}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-brand-border px-5 py-3 bg-brand-bg-2 flex items-center justify-between">
                        <span className="text-brand-muted text-xs font-inter">Looking for a complete build?</span>
                        <Link to="/builder" onClick={() => setShopOpen(false)} className="text-brand-red text-xs font-semibold hover:text-brand-red-light transition-colors">Configure Your PC →</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/builder" className={({ isActive }) =>
                `px-4 py-2 text-sm font-inter font-medium rounded transition-colors duration-150 ${isActive ? 'text-white' : 'text-brand-muted hover:text-white hover:bg-white/5'}`
              }>Custom PC Builder</NavLink>

              <NavLink to="/products" className={({ isActive }) =>
                `px-4 py-2 text-sm font-inter font-medium rounded transition-colors duration-150 ${isActive ? 'text-white' : 'text-brand-muted hover:text-white hover:bg-white/5'}`
              }>Pre-Built PCs</NavLink>

              <div className="relative group">
                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-inter font-medium text-brand-muted hover:text-white hover:bg-white/5 rounded transition-colors duration-150">
                  Support <FiChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-44 bg-brand-bg-1 border border-brand-border rounded-lg shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 py-1">
                  {['Build Guides', 'Compatibility FAQ', 'Warranty & Returns', 'Contact Us'].map(item => (
                    <Link key={item} to="/" className="block px-4 py-2.5 text-[13px] text-brand-muted hover:text-white hover:bg-white/5 transition-colors">{item}</Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-ghost w-9 h-9 p-0 flex items-center justify-center rounded"
                title="Search"
              >
                <FiSearch className="w-4.5 h-4.5" />
              </button>

              <button onClick={openCart} className="relative btn-ghost w-9 h-9 p-0 flex items-center justify-center rounded" title="Cart">
                <FiShoppingCart className="w-4.5 h-4.5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-inter leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative group hidden lg:block">
                  <button className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded border border-brand-border bg-brand-bg-2 text-sm font-inter text-brand-muted hover:text-white hover:border-brand-border-light transition-all">
                    <div className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center text-white text-[10px] font-bold">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    {user.name?.split(' ')[0]}
                    <FiChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-brand-bg-1 border border-brand-border rounded-lg shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 py-1">
                    <div className="px-4 py-3 border-b border-brand-border">
                      <p className="text-white text-sm font-semibold font-inter">{user.name}</p>
                      <p className="text-brand-muted text-xs truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2.5 text-[13px] text-brand-muted hover:text-white hover:bg-white/5 transition-colors">My Orders</Link>
                    <Link to="/profile" className="block px-4 py-2.5 text-[13px] text-brand-muted hover:text-white hover:bg-white/5 transition-colors">My Builds</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2.5 text-[13px] text-brand-red hover:bg-brand-red/5 transition-colors font-medium">Admin Panel</Link>
                    )}
                    <div className="border-t border-brand-border mt-1 pt-1">
                      <button onClick={logout} className="block w-full text-left px-4 py-2.5 text-[13px] text-brand-muted hover:text-white hover:bg-white/5 transition-colors">Sign Out</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hidden lg:flex btn-outline-red items-center gap-2 text-sm">
                  <FiUser className="w-3.5 h-3.5" /> Sign In
                </Link>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden btn-ghost w-9 h-9 p-0 flex items-center justify-center rounded">
                {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-brand-border bg-brand-bg-1 overflow-hidden"
            >
              <div className="px-5 py-4 space-y-1">
                {[
                  { label: 'Shop Components', to: '/products' },
                  { label: 'Custom PC Builder', to: '/builder' },
                  { label: 'All Products', to: '/products' },
                ].map(l => (
                  <Link key={l.to + l.label} to={l.to} onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-brand-muted hover:text-white hover:bg-white/5 rounded transition-colors font-inter text-sm"
                  >{l.label}</Link>
                ))}
                <div className="pt-3 border-t border-brand-border">
                  {user ? (
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 text-brand-muted hover:text-white text-sm font-inter">Sign Out</button>
                  ) : (
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-red w-full justify-center mt-2">Sign In</Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted w-5 h-5" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search processors, graphics cards, memory..."
                    className="w-full bg-brand-bg-1 border border-brand-border rounded-lg pl-14 pr-6 py-5 text-white text-lg font-inter placeholder:text-brand-subtle focus:outline-none focus:border-brand-red transition-colors"
                  />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 btn-red text-sm py-2">Search</button>
                </div>
              </form>
              <p className="text-brand-subtle text-xs font-inter mt-4 text-center tracking-wide">
                Press <kbd className="px-1.5 py-0.5 bg-brand-bg-2 border border-brand-border rounded text-brand-muted text-[10px]">ESC</kbd> to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiCheckCircle, FiCpu, FiZap, FiTruck, FiHeadphones, FiShield, FiChevronRight } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

/* ─── Category images using real Unsplash PC hardware photos ─── */
const HERO_CATEGORIES = [
  {
    title: 'Processors',
    desc: 'Intel & AMD CPUs\nfor every build',
    to: '/products?category=cpu',
    img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80',
    imgAlt: 'AMD Ryzen CPU',
    accent: '#E53E2D',
  },
  {
    title: 'Graphics Cards',
    desc: 'High-performance\nGPUs for gaming\nand creation',
    to: '/products?category=gpu',
    img: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=500&q=80',
    imgAlt: 'NVIDIA RTX GPU',
    accent: '#E53E2D',
  },
  {
    title: 'Memory & Storage',
    desc: 'RAM, SSDs and HDDs\nfor faster performance',
    to: '/products?category=ram',
    img: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=500&q=80',
    imgAlt: 'Kingston Fury RAM',
    accent: '#E53E2D',
  },
  {
    title: 'Cooling & Cases',
    desc: 'Keep it cool.\nBuild it your way.',
    to: '/products?category=cooling',
    img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
    imgAlt: 'PC Case with RGB cooling',
    accent: '#E53E2D',
  },
];

const BRANDS = [
  'AMD', 'INTEL', 'NVIDIA', 'ASUS ROG', 'MSI', 'GIGABYTE', 'CORSAIR',
  'G.SKILL', 'NOCTUA', 'LIAN LI', 'SEASONIC', 'SAMSUNG', 'WD'
];

const TRUST_ITEMS = [
  { icon: FiShield, title: 'Genuine Products', desc: 'Authorized Brands' },
  { icon: FiTruck, title: 'Fast & Secure Delivery', desc: 'Across India' },
  { icon: FiHeadphones, title: 'Expert Support', desc: 'Build with Confidence' },
];

/* ─── Animated fade-in-up utility ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    productAPI.getFeatured()
      .then(({ data }) => setFeatured(data.data || []))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-bg" style={{ minHeight: '88vh' }}>
        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Dark base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0D0D0D] to-[#0A0A0A]" />
          {/* Red dramatic glow — right center */}
          <div className="absolute right-0 top-0 bottom-0 w-[60%] bg-gradient-radial"
            style={{ background: 'radial-gradient(ellipse 70% 80% at 75% 50%, rgba(229,62,45,0.13) 0%, rgba(229,62,45,0.04) 40%, transparent 70%)' }}
          />
          {/* Subtle left glow */}
          <div className="absolute left-0 top-0 bottom-0 w-[40%]"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 10% 60%, rgba(229,62,45,0.05) 0%, transparent 70%)' }}
          />
          {/* Horizontal light beam */}
          <div className="absolute top-[35%] left-[30%] right-0 h-px opacity-20"
            style={{ background: 'linear-gradient(90deg, transparent, #E53E2D60, #FF6633, transparent)' }}
          />
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 h-full" style={{ minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
          <div className="grid lg:grid-cols-12 gap-6 items-center w-full py-12">

            {/* ─ LEFT: Headline ─ */}
            <div className="lg:col-span-4 z-10">
              {/* Label */}
              <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-5">
                <div className="w-8 h-[2px] bg-brand-red" />
                <span className="text-brand-muted text-[11px] font-inter font-semibold tracking-[0.2em] uppercase">
                  Premium PC Components &amp; Custom Builds
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.div {...fadeUp(0.08)}>
                <h1 className="heading-xl text-white" style={{ fontSize: 'clamp(52px, 7vw, 88px)' }}>
                  ENGINEER
                  <br />YOUR
                  <br />
                  <span style={{ color: '#E53E2D' }}>NEXT BUILD.</span>
                </h1>
              </motion.div>

              {/* Subtext */}
              <motion.p {...fadeUp(0.16)} className="text-brand-muted font-inter text-[15px] leading-relaxed mt-5 mb-8 max-w-sm">
                Precision components. Intelligent compatibility.<br />
                Performance built around you.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-3 mb-10">
                <Link to="/builder" className="btn-red px-7 py-3.5 text-[15px] font-semibold">
                  Configure Your PC <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/products" className="btn-outline-white px-7 py-3.5 text-[15px]">
                  Explore Components
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div {...fadeUp(0.28)} className="flex flex-wrap gap-6">
                {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full border border-brand-border bg-brand-bg-1 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-brand-muted" />
                    </div>
                    <div>
                      <p className="text-white text-[12px] font-inter font-semibold leading-none">{title}</p>
                      <p className="text-brand-muted text-[11px] font-inter mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ─ CENTER: PC Showcase Image ─ */}
            <div className="lg:col-span-5 relative flex items-center justify-center z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="relative w-full"
              >
                {/* Glow behind image */}
                <div className="absolute inset-0 scale-75"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(229,62,45,0.25) 0%, transparent 70%)', filter: 'blur(40px)' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1593640408182-31c228eb7a3c?auto=format&fit=crop&w=900&q=85"
                  alt="High-performance gaming PC build with RGB lighting"
                  className="relative w-full object-contain"
                  style={{ filter: 'drop-shadow(0 0 60px rgba(229,62,45,0.3))' }}
                  onError={(e) => {
                    // Fallback to a styled div if image fails
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback */}
                <div className="hidden w-full aspect-square items-center justify-center rounded-2xl border border-brand-border-light bg-brand-bg-1" style={{ display: 'none' }}>
                  <div className="text-center">
                    <div className="text-8xl mb-4">🖥️</div>
                    <p className="text-brand-muted font-inter text-sm">PC Build Showcase</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card: Build Compatibility */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -left-8 top-[15%] w-52 bg-brand-bg-1 border border-brand-border rounded-lg p-4 shadow-card"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded bg-brand-bg-2 border border-brand-border flex items-center justify-center">
                    <FiCpu className="w-4 h-4 text-brand-muted" />
                  </div>
                  <div>
                    <p className="text-white text-[12px] font-inter font-bold uppercase tracking-wide leading-none">Build Compatibility</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-[10px] font-inter font-semibold">LIVE CHECK</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {['CPU & Motherboard', 'RAM Support', 'GPU Clearance', 'PSU Wattage', 'All Systems Go'].map((item, i) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${i < 4 ? 'border-brand-red bg-brand-red/20' : 'border-green-400 bg-green-400/20'}`}>
                        <div className={`w-1 h-1 rounded-full ${i < 4 ? 'bg-brand-red' : 'bg-green-400'}`} />
                      </div>
                      <span className={`text-[11px] font-inter ${i < 4 ? 'text-brand-muted' : 'text-white font-semibold'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ─ RIGHT: Feature Cards ─ */}
            <div className="lg:col-span-3 space-y-3 z-10">
              {/* GPU Performance card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-brand-bg-1 border border-brand-border rounded-lg p-4 cursor-pointer hover:border-brand-red/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-brand-bg-2 border border-brand-border flex items-center justify-center">
                      <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v4H3V3zm0 7h18v4H3v-4zm0 7h18v4H3v-4z"/></svg>
                    </div>
                    <div>
                      <p className="text-white text-[12px] font-inter font-bold uppercase tracking-wide">GPU Performance</p>
                      <p className="text-brand-red text-[10px] font-inter font-semibold mt-0.5">READY TO CONFIGURE</p>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-brand-subtle group-hover:text-brand-red transition-colors" />
                </div>
                <img
                  src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=300&q=75"
                  alt="NVIDIA GPU"
                  className="w-full h-20 object-cover rounded opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </motion.div>

              {/* Custom Configuration card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="bg-brand-bg-1 border border-brand-border rounded-lg p-4 cursor-pointer hover:border-brand-red/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white text-[12px] font-inter font-bold uppercase tracking-wide">Custom Configuration</p>
                    <p className="text-brand-red text-[10px] font-inter font-semibold mt-0.5">YOUR SPEC, YOUR RULES</p>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-brand-subtle group-hover:text-brand-red transition-colors" />
                </div>
                <div className="space-y-1.5">
                  {['Choose Components', 'Check Compatibility', 'Visualize Your Build', 'Add to Cart'].map(step => (
                    <div key={step} className="flex items-center gap-2">
                      <FiCheckCircle className="w-3 h-3 text-brand-red flex-shrink-0" />
                      <span className="text-brand-muted text-[11px] font-inter">{step}</span>
                    </div>
                  ))}
                </div>
                <Link to="/builder" onClick={e => e.stopPropagation()} className="mt-3 flex items-center gap-1 text-brand-red text-[11px] font-inter font-semibold hover:gap-2 transition-all">
                  Start Building <FiArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORY TILES (matching reference exactly)
      ═══════════════════════════════════════ */}
      <section className="bg-brand-bg border-t border-brand-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {HERO_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                {...fadeUp(i * 0.08)}
              >
                <Link
                  to={cat.to}
                  className="group relative block overflow-hidden border-r border-b border-brand-border last:border-r-0 lg:[&:nth-child(4n)]:border-r-0 aspect-[4/3] lg:aspect-auto lg:h-72"
                  style={{ borderRight: i === 3 ? 'none' : undefined }}
                >
                  {/* Background image */}
                  <div className="absolute inset-0">
                    <img
                      src={cat.img}
                      alt={cat.imgAlt}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {/* Dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent" />
                    {/* Red overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'linear-gradient(to top, rgba(229,62,45,0.15) 0%, transparent 60%)' }}
                    />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="heading-lg text-white text-2xl lg:text-3xl mb-1 group-hover:text-white transition-colors">{cat.title}</h3>
                    <p className="text-brand-muted text-[13px] font-inter leading-snug mb-4 whitespace-pre-line">{cat.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-red text-[11px] font-inter font-semibold uppercase tracking-wider group-hover:tracking-widest transition-all duration-300">
                        Shop Now
                      </span>
                      <div className="w-7 h-7 rounded-full border border-brand-red/40 bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red transition-all duration-300">
                        <FiArrowRight className="w-3 h-3 text-brand-red group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BRAND STRIP
      ═══════════════════════════════════════ */}
      <div className="border-y border-brand-border bg-brand-bg-1 py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={`${brand}-${i}`} className="inline-flex items-center gap-8 px-6">
              <span className="text-brand-subtle font-inter font-semibold text-[11px] tracking-[0.2em] uppercase hover:text-white transition-colors cursor-default">{brand}</span>
              <span className="text-brand-border text-lg">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════ */}
      <section className="bg-brand-bg py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-3">
                <div className="w-6 h-[2px] bg-brand-red" />
                <span className="text-brand-red text-[11px] font-inter font-semibold uppercase tracking-widest">Top Picks</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.06)} className="heading-xl text-white" style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}>
                FEATURED COMPONENTS
              </motion.h2>
            </div>
            <motion.div {...fadeUp(0.1)}>
              <Link to="/products" className="flex items-center gap-2 text-brand-muted text-sm font-inter hover:text-white transition-colors group">
                View All <FiArrowUpRight className="w-4 h-4 group-hover:text-brand-red transition-colors" />
              </Link>
            </motion.div>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton rounded aspect-[3/4]" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featured.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            /* Empty state — professional, no AI vibes */
            <div className="border border-brand-border rounded-lg p-16 text-center bg-brand-bg-1">
              <div className="w-16 h-16 rounded-full border border-brand-border bg-brand-bg-2 flex items-center justify-center mx-auto mb-5">
                <FiZap className="w-7 h-7 text-brand-subtle" />
              </div>
              <h3 className="heading-lg text-white text-2xl mb-2">Ready to Launch</h3>
              <p className="text-brand-muted font-inter text-sm max-w-sm mx-auto mb-6">
                Run the database seeder to populate your catalog with 58 premium PC components.
              </p>
              <code className="block bg-brand-bg-2 border border-brand-border rounded px-4 py-3 text-brand-muted text-xs font-mono text-left max-w-xs mx-auto">
                cd backend && npm run seed
              </code>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PC BUILDER CTA — Full-width dark section
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-bg-1 border-y border-brand-border">
        {/* Background glow */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 100% at 100% 50%, rgba(229,62,45,0.08) 0%, transparent 70%)' }}
        />

        <div className="max-w-[1400px] mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-brand-red" />
                <span className="text-brand-red text-[11px] font-inter font-semibold uppercase tracking-widest">Intelligent Build Tool</span>
              </motion.div>
              <motion.h2 {...fadeUp(0.06)} className="heading-xl text-white mb-5" style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}>
                BUILD YOUR PC<br />
                <span style={{ color: '#E53E2D' }}>THE RIGHT WAY.</span>
              </motion.h2>
              <motion.p {...fadeUp(0.12)} className="text-brand-muted font-inter text-[15px] leading-relaxed mb-8 max-w-lg">
                Our PC Builder checks socket compatibility, RAM type, PSU wattage, and clearance — all in real time. Select components, verify compatibility, then add everything to cart in one click.
              </motion.p>
              <motion.ul {...fadeUp(0.16)} className="space-y-3 mb-10">
                {[
                  'Real-time socket & chipset compatibility',
                  'Power consumption & PSU analysis',
                  'Gaming & workstation performance scoring',
                  'Save & share builds with your community',
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-[14px] font-inter text-brand-muted">
                    <FiCheckCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </motion.ul>
              <motion.div {...fadeUp(0.2)}>
                <Link to="/builder" className="btn-red px-8 py-4 text-[15px] font-semibold">
                  Configure Your PC <FiArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>

            {/* Visual — component grid */}
            <motion.div {...fadeUp(0.1)} className="relative">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { slot: 'CPU', icon: '🔲', filled: true, name: 'Ryzen 9 9950X', price: '₹72,999' },
                  { slot: 'GPU', icon: '🎮', filled: true, name: 'RTX 5080 Super', price: '₹89,999' },
                  { slot: 'Motherboard', icon: '🖥️', filled: true, name: 'ASUS ROG X870E', price: '₹64,999' },
                  { slot: 'RAM', icon: '💾', filled: true, name: 'G.Skill 32GB DDR5', price: '₹18,999' },
                  { slot: 'Storage', icon: '💿', filled: true, name: 'Samsung 990 Pro 2TB', price: '₹14,999' },
                  { slot: 'PSU', icon: '⚡', filled: true, name: 'Corsair HX1500i', price: '₹29,999' },
                  { slot: 'Case', icon: '🗄️', filled: true, name: 'Lian Li O11D EVO', price: '₹18,999' },
                  { slot: 'Cooler', icon: '❄️', filled: false, name: '', price: '' },
                  { slot: 'Fans', icon: '🌀', filled: false, name: '', price: '' },
                ].map((item) => (
                  <div
                    key={item.slot}
                    className={`rounded border p-3 transition-all duration-300 ${
                      item.filled
                        ? 'bg-brand-bg border-brand-red/20 bg-gradient-to-br from-brand-bg-2 to-brand-bg'
                        : 'bg-brand-bg-2 border-brand-border border-dashed opacity-50'
                    }`}
                  >
                    <div className="text-xl mb-1.5">{item.icon}</div>
                    <p className="text-brand-muted text-[9px] font-inter uppercase tracking-wider mb-0.5">{item.slot}</p>
                    {item.filled ? (
                      <>
                        <p className="text-white text-[10px] font-inter font-semibold leading-tight line-clamp-1">{item.name}</p>
                        <p className="text-brand-red text-[10px] font-inter font-bold mt-0.5">{item.price}</p>
                      </>
                    ) : (
                      <p className="text-brand-subtle text-[10px] font-inter">+ Add</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Compatibility badge */}
              <div className="mt-4 flex items-center gap-3 bg-brand-bg-2 border border-green-500/20 rounded-lg px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <div>
                  <p className="text-white text-xs font-inter font-semibold">All components compatible</p>
                  <p className="text-brand-muted text-[10px] font-inter">Estimated total: ₹3,30,993</p>
                </div>
                <div className="ml-auto">
                  <span className="text-green-400 text-[10px] font-semibold font-inter bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-sm">✓ PASS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST / WHY CYBERFLIX
      ═══════════════════════════════════════ */}
      <section className="bg-brand-bg py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-brand-border rounded-lg overflow-hidden">
            {[
              { icon: '🧾', title: 'GST Invoice', desc: 'Official tax bills included with every order.' },
              { icon: '✅', title: 'Authorised Stock', desc: 'Direct from brand-certified Indian distributors.' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay-powered checkout. 100% safe.' },
              { icon: '📞', title: 'Build Support', desc: 'Expert help over call & WhatsApp, Mon–Sat.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.06)}
                className="bg-brand-bg-1 p-8 flex flex-col items-start gap-4 hover:bg-brand-bg-2 transition-colors duration-200"
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="heading-lg text-white text-lg mb-1">{item.title}</p>
                  <p className="text-brand-muted text-[13px] font-inter leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

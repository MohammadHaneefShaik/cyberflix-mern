import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiAlertTriangle, FiInfo, FiPlus, FiX, FiSave, FiShoppingCart, FiZap, FiSearch, FiCpu, FiMonitor } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import useBuilderStore from '../store/useBuilderStore';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { productAPI } from '../services/api';

import cpuImage from '../assets/images/cpu.jpeg';
import gpuImage from '../assets/images/gpu.jpg';
import motherboardImage from '../assets/images/motherboard.jpeg';
import ramImage from '../assets/images/ram.jpeg';
import storageImage from '../assets/images/storage.jpeg';
import psuImage from '../assets/images/psu.jpeg';
import caseImage from '../assets/images/case.jpeg';
import coolingImage from '../assets/images/cooling.jpeg';
import fansImage from '../assets/images/fans.jpeg';


const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

// Component slot definitions
const SLOTS = [
  { key: 'cpu', label: 'Processor', short: 'CPU', icon: '🔲', category: 'cpu', required: true },
  { key: 'motherboard', label: 'Motherboard', short: 'MOBO', icon: '🖥️', category: 'motherboard', required: true },
  { key: 'gpu', label: 'Graphics Card', short: 'GPU', icon: '🎮', category: 'gpu', required: false },
  { key: 'ram', label: 'Memory', short: 'RAM', icon: '💾', category: 'ram', required: true },
  { key: 'storage', label: 'Storage', short: 'SSD/HDD', icon: '💿', category: 'storage', required: true },
  { key: 'psu', label: 'Power Supply', short: 'PSU', icon: '⚡', category: 'psu', required: true },
  { key: 'case', label: 'PC Case', short: 'CASE', icon: '🖥️', category: 'case', required: true },
  { key: 'cooling', label: 'CPU Cooler', short: 'COOLER', icon: '❄️', category: 'cooling', required: false },
  { key: 'fans', label: 'Case Fans', short: 'FANS', icon: '🌀', category: 'fans', required: false },
];

const CATEGORY_IMAGES = {
  cpu: cpuImage,
  gpu: gpuImage,
  motherboard: motherboardImage,
  ram: ramImage,
  storage: storageImage,
  psu: psuImage,
  case: caseImage,
  cooling: coolingImage,
  fans: fansImage,
};

// Component Selector Modal
function ComponentModal({ slot, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const { selectComponent } = useBuilderStore();

  useEffect(() => {
    productAPI.getAll({ category: slot.category, limit: 50 })
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [slot.category]);

  const filtered = q
    ? products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.brand.toLowerCase().includes(q.toLowerCase())
    )
    : products;

  const handleSelect = (product) => {
    selectComponent(slot.key, product);
    toast.success(`${product.name} selected`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-brand-bg-card border border-brand-border rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border shrink-0">
          <div>
            <h3 className="font-barlow text-xl font-black uppercase tracking-wider text-white">
              Select {slot.label}
            </h3>
            <p className="text-brand-muted text-xs mt-0.5">{filtered.length} products available</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded border border-brand-border flex items-center justify-center text-brand-muted hover:text-white hover:border-brand-red transition-all"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-brand-border shrink-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
            <input
              type="text"
              placeholder={`Search ${slot.label.toLowerCase()}...`}
              value={q}
              onChange={e => setQ(e.target.value)}
              className="input w-full pl-9 text-sm py-2"
              autoFocus
            />
          </div>
        </div>

        {/* Products List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-brand-bg-1 rounded-lg animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-brand-muted">No products found.</div>
          ) : (
            filtered.map(product => (
              <button
                key={product._id}
                onClick={() => handleSelect(product)}
                className="w-full flex items-center gap-4 bg-brand-bg-1 hover:bg-brand-bg border border-brand-border hover:border-brand-red rounded-lg p-4 transition-all group text-left"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#111] shrink-0 border border-brand-border">
                  <img
                    src={
                      product.image ||
                      product.images?.[0] ||
                      CATEGORY_IMAGES[slot.category] ||
                      cpuImage
                    } alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-brand-muted font-medium uppercase tracking-wider mb-0.5">{product.brand}</p>
                  <p className="text-white text-sm font-medium leading-tight line-clamp-1">{product.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-brand-red text-sm font-bold">{fmt(product.price)}</span>
                    {product.stock > 0 ? (
                      <span className="text-green-400 text-xs">In Stock</span>
                    ) : (
                      <span className="text-red-400 text-xs">Out of Stock</span>
                    )}
                  </div>
                </div>
                <div className="text-brand-muted group-hover:text-brand-red transition-colors shrink-0">
                  <FiPlus size={18} />
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Performance bar component
function PerfBar({ label, score, color = 'bg-brand-red' }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-brand-muted uppercase tracking-wider font-medium">{label}</span>
        <span className="text-white font-bold">{score || 0}/99</span>
      </div>
      <div className="h-2 bg-brand-bg-1 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score || 0}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const {
    components, compatibility, performance, totalPrice,
    removeComponent, checkCompatibility, saveBuild, clearBuild,
  } = useBuilderStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const [activeSlot, setActiveSlot] = useState(null);
  const [buildName, setBuildName] = useState('My Cyberflix Build');
  const [saving, setSaving] = useState(false);

  const selectedCount = Object.values(components).filter(Boolean).length;

  const handleSave = async () => {
    if (!user) { toast.error('Please login to save your build'); return; }
    setSaving(true);
    const result = await saveBuild(buildName);
    if (result) toast.success('Build saved successfully!');
    else toast.error('Failed to save build');
    setSaving(false);
  };

  const handleAddAllToCart = async () => {
    const items = Object.values(components).filter(Boolean);
    if (!items.length) { toast.error('No components selected'); return; }
    for (const item of items) await addToCart(item, 1);
    toast.success(`${items.length} components added to cart`);
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-16">
      {/* Hero Strip */}
      <div className="bg-gradient-to-r from-brand-red/20 via-brand-bg-1 to-brand-bg-1 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-brand-red text-xs font-barlow font-bold uppercase tracking-[0.2em] mb-1">PC Builder Tool</p>
              <h1 className="heading-xl text-4xl md:text-5xl">Build Your Beast</h1>
              <p className="text-brand-muted text-sm mt-1.5 max-w-lg">
                Select components, get real-time compatibility checks, and order everything in one click.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-brand-muted text-sm">{selectedCount}/9 components</span>
              <button
                onClick={clearBuild}
                className="btn-outline-white text-xs py-2 px-4"
              >
                Clear Build
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Component Slots */}
          <div className="xl:col-span-2 space-y-3">
            <h2 className="font-barlow text-lg font-bold uppercase tracking-wider text-white mb-4">
              Component Selection
            </h2>

            {SLOTS.map((slot) => {
              const selected = components[slot.key];
              return (
                <motion.div
                  key={slot.key}
                  layout
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${selected
                    ? 'border-brand-red/40 bg-brand-bg-card'
                    : 'border-brand-border bg-brand-bg-card hover:border-brand-muted/50'
                    }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Slot Label */}
                    <div className="w-16 text-center shrink-0">
                      <p className="font-barlow text-xs font-bold uppercase tracking-wider text-brand-muted">{slot.short}</p>
                      {slot.required && (
                        <p className="text-brand-red text-[9px] font-medium mt-0.5">Required</p>
                      )}
                    </div>

                    <div className="w-px h-10 bg-brand-border" />

                    {/* Selected Product or Empty */}
                    {selected ? (
                      <>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#111] border border-brand-border shrink-0">
                          <img
                            src={CATEGORY_IMAGES[slot.category] || CATEGORY_IMAGES.cpu}
                            alt={selected.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-brand-muted font-medium mb-0.5">{selected.brand}</p>
                          <p className="text-white text-sm font-medium leading-tight line-clamp-1">{selected.name}</p>
                          <p className="text-brand-red text-sm font-bold mt-0.5">{fmt(selected.price)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setActiveSlot(slot)}
                            className="text-xs text-brand-muted hover:text-white border border-brand-border hover:border-brand-red px-3 py-1.5 rounded transition-all"
                          >
                            Change
                          </button>
                          <button
                            onClick={() => removeComponent(slot.key)}
                            className="w-7 h-7 rounded border border-brand-border flex items-center justify-center text-brand-muted hover:text-red-400 hover:border-red-400 transition-all"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-brand-border shrink-0 flex items-center justify-center text-brand-border">
                          <FiPlus size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{slot.label}</p>
                          <p className="text-brand-muted text-xs">Click to select a component</p>
                        </div>
                        <button
                          onClick={() => setActiveSlot(slot)}
                          className="shrink-0 btn-outline-white text-xs py-2 px-4"
                        >
                          + Add
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Panel */}
          <div className="space-y-5">
            {/* Price Summary */}
            <div className="bg-brand-bg-card border border-brand-border rounded-xl p-5">
              <h3 className="font-barlow text-sm font-bold uppercase tracking-wider text-white mb-4">Build Summary</h3>

              <div className="space-y-2 mb-4">
                {Object.entries(components).filter(([, v]) => v).map(([key, product]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-brand-muted capitalize">{key}</span>
                    <span className="text-white font-medium">{fmt(product.price)}</span>
                  </div>
                ))}
              </div>

              {selectedCount === 0 ? (
                <p className="text-brand-muted text-xs text-center py-2">No components selected yet.</p>
              ) : (
                <>
                  <div className="border-t border-brand-border pt-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-brand-muted text-sm">Subtotal</span>
                      <span className="text-white font-bold text-lg">{fmt(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-brand-muted text-xs">+ GST (18%)</span>
                      <span className="text-brand-muted text-xs">{fmt(Math.round(totalPrice * 0.18))}</span>
                    </div>
                    <div className="flex justify-between mt-1.5 pt-2 border-t border-brand-border">
                      <span className="text-white font-bold text-sm">Total</span>
                      <span className="text-brand-red font-black text-xl font-barlow">
                        {fmt(Math.round(totalPrice * 1.18))}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleAddAllToCart}
                      className="w-full btn-red py-3 flex items-center justify-center gap-2 text-sm"
                    >
                      <FiShoppingCart size={15} />
                      Add All to Cart
                    </button>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={buildName}
                        onChange={e => setBuildName(e.target.value)}
                        className="input text-xs py-2 flex-1"
                        placeholder="Build name"
                      />
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-outline-white text-xs py-2 px-3 flex items-center gap-1 shrink-0 disabled:opacity-50"
                      >
                        <FiSave size={12} />
                        {saving ? '...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Compatibility Status */}
            {compatibility && (
              <div className="bg-brand-bg-card border border-brand-border rounded-xl p-5">
                <h3 className="font-barlow text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <FiZap size={14} className="text-brand-red" />
                  Compatibility Check
                </h3>

                <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${compatibility.isCompatible
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                  {compatibility.isCompatible ? (
                    <FiCheck className="text-green-400 shrink-0" size={16} />
                  ) : (
                    <FiAlertTriangle className="text-red-400 shrink-0" size={16} />
                  )}
                  <span className={`text-sm font-medium ${compatibility.isCompatible ? 'text-green-400' : 'text-red-400'}`}>
                    {compatibility.isCompatible ? 'All components compatible' : 'Compatibility issues found'}
                  </span>
                </div>

                {compatibility.issues?.map((issue, i) => (
                  <div key={i} className="flex gap-2 text-xs text-red-400 bg-red-500/5 rounded p-2.5 mb-2">
                    <FiAlertTriangle className="shrink-0 mt-0.5" size={12} />
                    <span>{issue}</span>
                  </div>
                ))}

                {compatibility.warnings?.map((warn, i) => (
                  <div key={i} className="flex gap-2 text-xs text-yellow-400 bg-yellow-500/5 rounded p-2.5 mb-2">
                    <FiInfo className="shrink-0 mt-0.5" size={12} />
                    <span>{warn}</span>
                  </div>
                ))}

                {compatibility.ok?.map((msg, i) => (
                  <div key={i} className="flex gap-2 text-xs text-green-400 bg-green-500/5 rounded p-2.5 mb-2">
                    <FiCheck className="shrink-0 mt-0.5" size={12} />
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Performance Scores */}
            {performance && (performance.gaming > 0 || performance.workstation > 0) && (
              <div className="bg-brand-bg-card border border-brand-border rounded-xl p-5">
                <h3 className="font-barlow text-sm font-bold uppercase tracking-wider text-white mb-4">
                  Estimated Performance
                </h3>
                <div className="space-y-4">
                  <PerfBar label="Gaming" score={performance.gaming} color="bg-brand-red" />
                  <PerfBar label="Workstation" score={performance.workstation} color="bg-blue-500" />
                  <PerfBar label="General Use" score={performance.general} color="bg-purple-500" />
                </div>
                <p className="text-brand-muted text-xs mt-4">
                  * Estimates based on component specs. Actual performance varies.
                </p>
              </div>
            )}

            {/* Check Compatibility Button */}
            {selectedCount >= 2 && (
              <button
                onClick={checkCompatibility}
                className="w-full btn-outline-red py-3 text-sm flex items-center justify-center gap-2"
              >
                <FiZap size={14} />
                Run Compatibility Check
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Component Selector Modal */}
      <AnimatePresence>
        {activeSlot && (
          <ComponentModal slot={activeSlot} onClose={() => setActiveSlot(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

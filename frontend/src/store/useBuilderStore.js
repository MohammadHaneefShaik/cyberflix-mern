import { create } from 'zustand';
import { builderAPI } from '../services/api';

const COMPONENT_SLOTS = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu', 'case', 'cooling', 'fans'];

const SLOT_META = {
  cpu:         { label: 'CPU',          emoji: '🔲', description: 'The brain of your build' },
  motherboard: { label: 'Motherboard',  emoji: '🖥️', description: 'The backbone connecting everything' },
  gpu:         { label: 'GPU',          emoji: '🎮', description: 'Powers your graphics and gaming' },
  ram:         { label: 'RAM',          emoji: '💾', description: 'Working memory for multitasking' },
  storage:     { label: 'Storage',      emoji: '💿', description: 'SSD or HDD for your data' },
  psu:         { label: 'Power Supply', emoji: '⚡', description: 'Powers the entire system' },
  case:        { label: 'PC Case',      emoji: '🗄️', description: 'Houses all your components' },
  cooling:     { label: 'CPU Cooler',   emoji: '❄️', description: 'Keeps your CPU temperatures in check' },
  fans:        { label: 'Case Fans',    emoji: '🌀', description: 'Improves overall airflow' },
};

const useBuilderStore = create((set, get) => ({
  // Selected components { cpu: productObj|null, ... }
  components: Object.fromEntries(COMPONENT_SLOTS.map(s => [s, null])),

  // UI state
  activeSlot: null,
  showModal: false,
  isChecking: false,

  // Results
  compatibility: null,
  performance: null,
  totalPrice: 0,

  // Constants
  SLOTS: COMPONENT_SLOTS,
  SLOT_META,

  // Actions
  setActiveSlot: (slot) => set({ activeSlot: slot, showModal: true }),
  closeModal: () => set({ showModal: false, activeSlot: null }),

  selectComponent: (slot, product) => {
    set((state) => ({
      components: { ...state.components, [slot]: product },
      showModal: false,
      activeSlot: null,
      compatibility: null,
      performance: null,
    }));
    // Auto-check compatibility after selection
    setTimeout(() => get().checkCompatibility(), 100);
  },

  removeComponent: (slot) => {
    set((state) => ({
      components: { ...state.components, [slot]: null },
      compatibility: null,
      performance: null,
    }));
    setTimeout(() => get().checkCompatibility(), 100);
  },

  checkCompatibility: async () => {
    const { components } = get();
    const ids = {};
    Object.entries(components).forEach(([slot, prod]) => {
      if (prod) ids[slot] = prod._id;
    });

    if (Object.keys(ids).length === 0) return;

    set({ isChecking: true });
    try {
      const { data } = await builderAPI.checkCompatibility(ids);
      set({
        compatibility: data.data.compatibility,
        performance: data.data.performance,
        totalPrice: data.data.totalPrice,
        isChecking: false,
      });
    } catch (e) {
      // Fallback to local compatibility check
      const local = localCheckCompatibility(components);
      const localTotal = Object.values(components).reduce((s, p) => s + (p?.price || 0), 0);
      set({ compatibility: local, totalPrice: localTotal, isChecking: false });
    }
  },

  saveBuild: async (name) => {
    const { components, compatibility, performance, totalPrice } = get();
    const componentIds = {};
    Object.entries(components).forEach(([slot, prod]) => {
      if (prod) componentIds[slot] = prod._id;
    });
    try {
      const { data } = await builderAPI.saveB({ name, components: componentIds, compatibilityStatus: compatibility, performanceScores: performance, totalPrice });
      return { success: true, data: data.data };
    } catch (e) {
      return { success: false, error: e.response?.data?.message || 'Failed to save build' };
    }
  },

  clearBuild: () => set({
    components: Object.fromEntries(COMPONENT_SLOTS.map(s => [s, null])),
    compatibility: null, performance: null, totalPrice: 0, activeSlot: null, showModal: false,
  }),

  getFilledCount: () => Object.values(get().components).filter(Boolean).length,
  isComplete: () => Object.values(get().components).every(Boolean),
}));

// Local compatibility check (fallback when API fails)
function localCheckCompatibility(components) {
  const { cpu, motherboard, ram, psu, gpu, cooling } = components;
  const issues = [], warnings = [], ok = [];

  if (cpu && motherboard) {
    if (cpu.socket && motherboard.socket && cpu.socket !== motherboard.socket)
      issues.push(`CPU socket mismatch: ${cpu.name} uses ${cpu.socket} but motherboard supports ${motherboard.socket}`);
    else if (cpu.socket && motherboard.socket) ok.push(`CPU and Motherboard share ${cpu.socket} socket ✓`);
  }
  if (cpu && ram && cpu.ramType && ram.ramType && cpu.ramType !== ram.ramType)
    issues.push(`RAM type mismatch: CPU supports ${cpu.ramType} but RAM is ${ram.ramType}`);
  if (!cooling && cpu)
    warnings.push(cpu.tdp > 125 ? `High TDP CPU (${cpu.tdp}W) — dedicated cooler strongly recommended` : `No CPU cooler selected`);
  if (!gpu && cpu)
    warnings.push(`No GPU selected — ensure CPU has integrated graphics`);

  return { isCompatible: issues.length === 0, issues, warnings, ok };
}

export default useBuilderStore;

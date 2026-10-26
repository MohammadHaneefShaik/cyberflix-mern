import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading: loading } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const result = await registerUser(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Account created! Welcome to Cyberflix.');
      navigate('/');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#111111] border-r border-[#1e1e1e] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #E53E2D 0%, transparent 50%)',
        }} />

        <Link to="/" className="relative z-10">
          <span className="font-barlow text-3xl font-black uppercase tracking-widest text-white">
            CYBER<span className="text-[#E53E2D]">FLIX</span>
          </span>
        </Link>

        <div className="relative z-10">
          <p className="font-barlow text-4xl font-black uppercase text-white leading-tight mb-4">
            Join the<br />
            <span className="text-[#E53E2D]">Builder's Circle.</span>
          </p>
          <p className="text-[#666] text-sm leading-relaxed max-w-sm mb-8">
            Create your free account and get access to exclusive deals, the PC Builder tool, saved builds, and fast-tracked order support.
          </p>
          <div className="space-y-3">
            {[
              'Free account — no credit card required',
              'Save builds and share them',
              'Member-exclusive discounts',
              'Priority order support',
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-[#888] text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E53E2D] shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#555] text-xs relative z-10">
          © {new Date().getFullYear()} Cyberflix Systems LLP
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="inline-block mb-8 lg:hidden">
            <span className="font-barlow text-2xl font-black uppercase tracking-widest text-white">
              CYBER<span className="text-[#E53E2D]">FLIX</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="font-barlow text-3xl font-black uppercase tracking-tight text-white mb-1">
              Create Account
            </h1>
            <p className="text-[#666] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#E53E2D] hover:text-red-400 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={15} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-[#111111] border border-[#333] text-white placeholder-[#555] rounded-lg px-4 py-3 pl-11 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={15} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-[#111111] border border-[#333] text-white placeholder-[#555] rounded-lg px-4 py-3 pl-11 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-[#888] mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" size={15} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#111111] border border-[#333] text-white placeholder-[#555] rounded-lg px-4 py-3 pl-11 pr-11 focus:outline-none focus:border-[#E53E2D] transition-colors text-sm"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                >
                  {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E53E2D] hover:bg-[#c93525] text-white font-barlow font-black uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
              ) : (
                <>Create Account <FiArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1e1e1e] text-center">
            <p className="text-[#555] text-xs">
              By creating an account, you agree to our{' '}
              <span className="text-[#888] hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              {' '}and{' '}
              <span className="text-[#888] hover:text-white cursor-pointer transition-colors">Privacy Policy</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

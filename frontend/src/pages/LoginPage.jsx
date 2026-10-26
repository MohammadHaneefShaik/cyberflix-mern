import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading: loading } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-bg-1 border-r border-brand-border flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #E53E2D 0%, transparent 50%), radial-gradient(circle at 75% 75%, #E53E2D 0%, transparent 50%)',
        }} />

        <Link to="/" className="relative z-10">
          <span className="font-barlow text-3xl font-black uppercase tracking-widest text-white">
            CYBER<span className="text-brand-red">FLIX</span>
          </span>
        </Link>

        <div className="relative z-10">
          <blockquote className="mb-8">
            <p className="font-barlow text-4xl font-black uppercase text-white leading-tight mb-4">
              Your Next Build<br />
              <span className="text-brand-red">Starts Here.</span>
            </p>
            <p className="text-brand-muted text-sm leading-relaxed max-w-sm">
              Access your orders, saved builds, wishlist, and exclusive member pricing — all in one place.
            </p>
          </blockquote>

          <div className="space-y-4">
            {[
              'Real-time compatibility checker',
              'Exclusive member-only deals',
              'Track orders with live updates',
              'Save and share your builds',
            ].map(feature => (
              <div key={feature} className="flex items-center gap-3 text-brand-muted text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="text-brand-muted text-xs relative z-10">
          © {new Date().getFullYear()} Cyberflix Systems LLP — Bengaluru, India
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="inline-block mb-8 lg:hidden">
            <span className="font-barlow text-2xl font-black uppercase tracking-widest text-white">
              CYBER<span className="text-brand-red">FLIX</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="font-barlow text-3xl font-black uppercase tracking-tight text-white mb-1">
              Sign In
            </h1>
            <p className="text-brand-muted text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-red hover:text-red-400 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-barlow font-bold uppercase tracking-wider text-brand-muted mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={15} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input w-full pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-barlow font-bold uppercase tracking-wider text-brand-muted">
                  Password
                </label>
                <button type="button" className="text-xs text-brand-red hover:text-red-400 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={15} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input w-full pl-11 pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-red py-3.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-brand-border text-center">
            <p className="text-brand-muted text-xs">
              By signing in, you agree to our{' '}
              <span className="text-white/60 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              {' '}and{' '}
              <span className="text-white/60 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

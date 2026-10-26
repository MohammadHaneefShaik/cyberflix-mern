import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiYoutube, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { SiDiscord } from 'react-icons/si';

const FOOTER_LINKS = {
  'Shop': [
    { label: 'CPUs / Processors', href: '/products?category=cpu' },
    { label: 'Graphics Cards', href: '/products?category=gpu' },
    { label: 'Motherboards', href: '/products?category=motherboard' },
    { label: 'Memory / RAM', href: '/products?category=ram' },
    { label: 'Storage / SSD', href: '/products?category=storage' },
    { label: 'Power Supplies', href: '/products?category=psu' },
    { label: 'PC Cases', href: '/products?category=case' },
    { label: 'CPU Coolers', href: '/products?category=cooling' },
    { label: 'Monitors', href: '/products?category=monitors' },
  ],
  'Tools': [
    { label: 'PC Builder', href: '/builder' },
    { label: 'Compatibility Check', href: '/builder' },
    { label: 'Build Showcase', href: '/builder' },
    { label: 'Performance Estimator', href: '/builder' },
    { label: 'Compare Products', href: '/products' },
  ],
  'Company': [
    { label: 'About Us', href: '/' },
    { label: 'Blog & Reviews', href: '/' },
    { label: 'Careers', href: '/' },
    { label: 'Press & Media', href: '/' },
    { label: 'Contact Us', href: '/' },
  ],
  'Support': [
    { label: 'Track Your Order', href: '/profile' },
    { label: 'Returns & Refunds', href: '/' },
    { label: 'Warranty Policy', href: '/' },
    { label: 'FAQ', href: '/' },
    { label: 'Shipping Info', href: '/' },
  ],
};

const SOCIAL = [
  { icon: FiInstagram, href: '#', label: 'Instagram' },
  { icon: FiYoutube, href: '#', label: 'YouTube' },
  { icon: FiTwitter, href: '#', label: 'Twitter/X' },
  { icon: SiDiscord, href: '#', label: 'Discord' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1e1e1e]">
      {/* Newsletter Banner */}
      <div className="bg-brand-red">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-barlow text-white text-2xl font-black uppercase tracking-wider">Stay Ahead of the Game</p>
            <p className="text-red-100 text-sm mt-0.5">New drops, exclusive deals, and build guides — delivered first.</p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-black/30 border border-white/20 text-white placeholder-white/50 rounded px-4 py-2 text-sm focus:outline-none focus:border-white flex-1 min-w-[240px]"
            />
            <button type="submit" className="bg-white text-brand-red font-barlow font-black uppercase tracking-wider px-6 py-2 rounded text-sm hover:bg-red-50 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-5">
              <span className="font-barlow text-3xl font-black uppercase tracking-widest text-white">
                CYBER<span className="text-brand-red">FLIX</span>
              </span>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed mb-6">
              India's premier destination for premium PC components. We curate the best hardware from global brands, 
              ship fast across India, and back every purchase with expert support.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-brand-muted">
                <FiMapPin className="text-brand-red mt-0.5 shrink-0" />
                <span>Koramangala, Bengaluru — 560034, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3 text-brand-muted">
                <FiPhone className="text-brand-red shrink-0" />
                <span>+91 98800 12345</span>
              </div>
              <div className="flex items-center gap-3 text-brand-muted">
                <FiMail className="text-brand-red shrink-0" />
                <span>support@cyberfixsystems.in</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-7">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded border border-brand-border flex items-center justify-center text-brand-muted hover:text-white hover:border-brand-red hover:bg-brand-red/10 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-barlow text-white text-sm font-bold uppercase tracking-[0.12em] mb-4 border-b border-brand-border pb-2">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        to={href}
                        className="text-brand-muted text-sm hover:text-white transition-colors duration-150 hover:translate-x-0.5 inline-block"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-8 border-t border-brand-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Genuine Products', sub: '100% authentic hardware' },
              { title: 'Secure Payments', sub: 'Razorpay & UPI accepted' },
              { title: 'Pan-India Delivery', sub: 'Fast tracked shipping' },
              { title: '1-Year Warranty', sub: 'On all components' },
            ].map(({ title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-2 h-8 bg-brand-red rounded-full shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-brand-muted text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-brand-muted text-xs">
            <p>© {new Date().getFullYear()} Cyberflix Systems LLP. All rights reserved. GST: 29AABCC1234F1Z5</p>
            <div className="flex gap-5">
              <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

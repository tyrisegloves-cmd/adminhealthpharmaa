import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeartLogo from './HeartLogo';

export default function Footer() {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <HeartLogo size="sm" />
              <span className="text-xl font-extrabold text-white">Heart Pharma</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your trusted neighborhood pharmacy delivering quality healthcare products with care and compassion. 
              We believe in making healthcare accessible for everyone.
            </p>
            <div className="flex gap-3">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
                <button
                  key={social}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                  title={social}
                >
                  {social === 'Facebook' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  )}
                  {social === 'Twitter' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                  )}
                  {social === 'Instagram' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2"/></svg>
                  )}
                  {social === 'YouTube' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#1c1917"/></svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Products', to: '/products' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                ...(!isLoggedIn ? [{ label: 'Sign In', to: '/auth' }] : []),
              ].map((link) => (
                <li key={link.to + link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5">
              {['Medicines', 'Vitamins & Supplements', 'First Aid', 'Personal Care', 'Baby Care', 'Health Devices'].map((cat) => (
                <li key={cat}>
                  <Link to="/products" className="text-sm text-gray-400 hover:text-primary-light transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="text-lg mt-0.5">📍</span>
                <span className="text-sm text-gray-400">123 Health Avenue, Medical District, Mumbai 400001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-lg">📞</span>
                <span className="text-sm text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-lg">✉️</span>
                <span className="text-sm text-gray-400">care@heartpharma.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-lg">🕐</span>
                <span className="text-sm text-gray-400">Mon-Sun: 8AM - 10PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2024 Heart Pharma. All rights reserved. Licensed Pharmacy.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-primary-light transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-light transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-light transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

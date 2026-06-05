import { Link, useLocation } from 'react-router-dom';
import { Truck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  const accentLen = settings.siteNameAccent.length;
  const accentPart = settings.siteName.slice(0, accentLen);
  const restPart = settings.siteName.slice(accentLen);

  const navLink = (path: string, label: string) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors relative ${
          isActive ? c.text : `text-slate-800 ${c.textHover}`
        }`}
      >
        {label}
        {isActive && (
          <span className={`absolute -bottom-1 left-3 right-3 h-0.5 ${c.bg} rounded-full`} />
        )}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`${c.bg} p-1.5 rounded`}>
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              <span className={c.text}>{accentPart || settings.siteName.charAt(0)}</span>
              {restPart}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLink('/', 'Home')}
            {navLink('/about', 'About')}
            {navLink('/services', 'Service')}
            {navLink('/track', 'Track')}
            {navLink('/blog', 'Blog')}
            {navLink('/contact', 'Contact')}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/track"
              className={`${c.bg} ${c.bgHover} text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors`}
            >
              Track Package
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-slate-800"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-3 space-y-1">
            {navLink('/', 'Home')}
            {navLink('/about', 'About')}
            {navLink('/services', 'Service')}
            {navLink('/track', 'Track')}
            {navLink('/blog', 'Blog')}
            {navLink('/contact', 'Contact')}
            <Link
              to="/track"
              onClick={() => setMobileOpen(false)}
              className={`block ${c.bg} ${c.bgHover} text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors text-center mx-3 mt-2`}
            >
              Track Package
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

import { Truck, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

export default function Footer() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  const accentLen = settings.siteNameAccent.length;
  const accentPart = settings.siteName.slice(0, accentLen);
  const restPart = settings.siteName.slice(accentLen);

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className={`${c.bg} p-1.5 rounded`}>
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                <span className={c.text}>{accentPart || settings.siteName.charAt(0)}</span>
                {restPart}
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">{settings.footerAbout}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className={`${c.textHover} transition-colors`}>Home</Link></li>
              <li><Link to="/about" className={`${c.textHover} transition-colors`}>About Us</Link></li>
              <li><Link to="/services" className={`${c.textHover} transition-colors`}>Services</Link></li>
              <li><Link to="/track" className={`${c.textHover} transition-colors`}>Track Shipment</Link></li>
              <li><Link to="/contact" className={`${c.textHover} transition-colors`}>Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li className={`${c.textHover} transition-colors cursor-pointer`}>Air Freight</li>
              <li className={`${c.textHover} transition-colors cursor-pointer`}>Ocean Freight</li>
              <li className={`${c.textHover} transition-colors cursor-pointer`}>Road Transport</li>
              <li className={`${c.textHover} transition-colors cursor-pointer`}>Warehousing</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className={`w-4 h-4 ${c.textLight} mt-0.5 flex-shrink-0`} />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className={`w-4 h-4 ${c.textLight} flex-shrink-0`} />
                <span>{settings.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className={`w-4 h-4 ${c.textLight} flex-shrink-0`} />
                <span>{settings.phone}</span>
              </li>
            </ul>
            <Link
              to="/track"
              className={`inline-flex items-center gap-2 mt-4 ${c.bg} ${c.bgHover} text-white text-sm font-semibold px-4 py-2 rounded transition-colors`}
            >
              Track Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm">
          © {new Date().getFullYear()} {settings.copyrightText}
        </div>
      </div>
    </footer>
  );
}

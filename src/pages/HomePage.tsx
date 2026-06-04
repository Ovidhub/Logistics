import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Truck,
  Ship,
  Plane,
  Package,
  Shield,
  Globe,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

const WAREHOUSE_HERO = 'https://images.pexels.com/photos/4170172/pexels-photo-4170172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1920';
const SHIP_PORT = 'https://images.pexels.com/photos/21234960/pexels-photo-21234960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900';
const PLANE = 'https://images.pexels.com/photos/32010721/pexels-photo-32010721.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700';
const SHIP = 'https://images.pexels.com/photos/24246926/pexels-photo-24246926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700';
const TRUCK = 'https://images.pexels.com/photos/31310062/pexels-photo-31310062.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700';

export default function HomePage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center min-h-[560px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.45)), url(${WAREHOUSE_HERO})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
              {settings.heroTitle}
            </h1>
            <p className="text-slate-200 text-base sm:text-lg mb-8 leading-relaxed">
              {settings.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/track"
                className={`${c.bg} ${c.bgHover} text-white text-sm font-semibold px-6 py-3 rounded transition-colors inline-flex items-center gap-2`}
              >
                {settings.heroCTA} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="bg-white/10 backdrop-blur hover:bg-white/20 text-white text-sm font-semibold px-6 py-3 rounded border border-white/30 transition-colors"
              >
                Our Services
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-10">
              <span className={`w-10 h-1 ${c.bg} rounded-full`}></span>
              <span className="w-10 h-1 bg-white/40 rounded-full"></span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Service Cards (overlapping hero) */}
      <section className="relative -mt-20 z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Truck className="w-7 h-7" />, title: 'Road Transport' },
            { icon: <Plane className="w-7 h-7" />, title: 'Air Freight' },
            { icon: <Ship className="w-7 h-7" />, title: 'Ocean Freight' },
            { icon: <Package className="w-7 h-7" />, title: 'Warehousing' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white shadow-xl rounded p-6 border-t-4 ${c.border} hover:-translate-y-1 transition-transform`}
            >
              <div className={`${c.text} mb-3`}>{s.icon}</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Fast, reliable and secure delivery services for your business needs.
              </p>
              <Link to="/services" className={`${c.text} text-xs font-semibold hover:underline`}>
                Read More
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src={SHIP_PORT} alt="Ship at port" className="rounded shadow-lg w-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Our About Us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
              {settings.aboutTitle}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              {settings.aboutDescription}
            </p>

            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div className={`${c.bgLight} ${c.text} p-3 rounded flex-shrink-0`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Shipping Worldwide</h4>
                  <p className="text-sm text-slate-500">Global network spanning {settings.statCountries} countries with reliable door-to-door delivery service.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`${c.bgLight} ${c.text} p-3 rounded flex-shrink-0`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Safety and Reliability</h4>
                  <p className="text-sm text-slate-500">Your cargo is fully insured and handled with the utmost care throughout the journey.</p>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 ${c.bg} ${c.bgHover} text-white text-sm font-semibold px-6 py-3 rounded transition-colors`}
            >
              Get a quote now! <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Our Service</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Few Reasons Why You Choose Us<br />Protect Yourself
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: PLANE, title: 'Contract Logistic', desc: 'Comprehensive contract logistics services with end-to-end supply chain visibility and management.' },
              { img: SHIP, title: 'Custom Brokerage', desc: 'Expert customs clearance services ensuring fast and compliant cross-border shipping operations.' },
              { img: TRUCK, title: 'Vehicle Service', desc: 'Modern fleet of trucks and vehicles for efficient land-based freight transportation services.' },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-slate-900 text-lg mb-3">{service.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">{service.desc}</p>
                  <Link
                    to="/services"
                    className={`inline-block ${c.bg} ${c.bgHover} text-white text-xs font-semibold px-5 py-2.5 rounded transition-colors`}
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${c.bg} text-white px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: settings.statClients, label: 'Happy Clients' },
            { value: settings.statCountries, label: 'Countries Served' },
            { value: settings.statDeliveries, label: 'Deliveries Made' },
            { value: settings.statYears, label: 'Years Experience' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl sm:text-5xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-sm uppercase tracking-wider opacity-90">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Reliable Logistics Partner</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Real-time GPS tracking',
              '24/7 customer support',
              'Insured & secure cargo',
              'Competitive pricing',
              'On-time delivery guarantee',
              'Eco-friendly fleet',
              'Custom packaging options',
              'Cross-border expertise',
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-start gap-3 bg-slate-50 p-4 rounded border-l-4 ${c.border}`}
              >
                <CheckCircle2 className={`w-5 h-5 ${c.text} flex-shrink-0 mt-0.5`} />
                <span className="text-sm font-semibold text-slate-800">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Ready to ship with {settings.siteName}?</h2>
            <p className="text-slate-300">Get started today and experience hassle-free logistics.</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 text-sm font-semibold px-5 py-3 rounded transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> {settings.phone}
            </a>
            <Link
              to="/track"
              className={`${c.bg} ${c.bgHover} text-white text-sm font-semibold px-6 py-3 rounded transition-colors inline-flex items-center gap-2`}
            >
              Track Shipment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

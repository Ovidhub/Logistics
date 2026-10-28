import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Truck,
  Ship,
  Plane,
  Package,
  Shield,
  Route,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

const HERO = '/images/hero-port.jpg';
const BERTH = '/images/berth.jpg';

export default function HomePage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative bg-cover bg-center min-h-[580px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(9, 16, 30, 0.88) 0%, rgba(9, 16, 30, 0.62) 48%, rgba(9, 16, 30, 0.28) 100%), url(${HERO})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-white/75 text-xs font-bold uppercase tracking-[0.22em] mb-5">
              Road · Ocean · Air · Customs
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.06] mb-5">
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
                to="/contact"
                className="bg-white/10 backdrop-blur hover:bg-white/20 text-white text-sm font-semibold px-6 py-3 rounded border border-white/30 transition-colors"
              >
                Book a lane
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Same-day quotes
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Cargo cover as standard
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> HMRC clearance in-house
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service strip */}
      <section className="relative -mt-16 z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <Truck className="w-7 h-7" />,
              title: 'Road transport',
              desc: 'UK linehauls, Dover and Eurotunnel crossings, GPS on every load.',
            },
            {
              icon: <Ship className="w-7 h-7" />,
              title: 'Ocean freight',
              desc: 'FCL and LCL into Felixstowe, Southampton and London Gateway.',
            },
            {
              icon: <Plane className="w-7 h-7" />,
              title: 'Air freight',
              desc: 'Next-flight-out from Heathrow, Manchester and East Midlands.',
            },
            {
              icon: <Package className="w-7 h-7" />,
              title: 'Warehousing',
              desc: 'Bonded and ambient space in Kent, the Midlands and Manchester.',
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white shadow-xl rounded p-6 border-t-4 ${c.border} hover:-translate-y-1 transition-transform`}
            >
              <div className={`${c.text} mb-3`}>{s.icon}</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{s.desc}</p>
              <Link to="/services" className={`${c.text} text-xs font-semibold hover:underline`}>
                Service detail
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={BERTH}
              alt="Container ship alongside the terminal"
              loading="lazy"
              className="rounded shadow-lg w-full"
            />
            <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white rounded px-4 py-3">
              <p className="text-2xl font-extrabold leading-none">{settings.yearsExperience}</p>
              <p className="text-[11px] uppercase tracking-wider text-white/70">Years clearing UK customs</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Established 2013 · London</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
              {settings.aboutTitle}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              {settings.aboutDescription}
            </p>

            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div className={`${c.bgLight} ${c.text} p-3 rounded flex-shrink-0`}>
                  <Route className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Lanes we run ourselves</h4>
                  <p className="text-sm text-slate-500">
                    Owned trucks and contracted sailings on {settings.statCountries} country pairs — so
                    nobody hands your consignment to a stranger halfway.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`${c.bgLight} ${c.text} p-3 rounded flex-shrink-0`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Paperwork that clears</h4>
                  <p className="text-sm text-slate-500">
                    Entries, bonds and certificates prepared before the ship berths, with cover on the
                    cargo from the moment it leaves your dock.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/services"
              className={`inline-flex items-center gap-2 ${c.bg} ${c.bgHover} text-white text-sm font-semibold px-6 py-3 rounded transition-colors`}
            >
              See how we move <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Under one contract</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight max-w-3xl mx-auto">
              Collection, clearance and delivery — handled by one team.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: '/images/warehouse-800.jpg',
                title: 'Contract warehousing',
                desc: 'Racked storage, pick-and-pack and bonded space with stock counts you can see online — invoiced per pallet, not per surprise.',
              },
              {
                img: '/images/aerial-port-800.jpg',
                title: 'Customs brokerage',
                desc: 'Licensed brokers file entries, classify goods and clear holds before demurrage starts eating your margin.',
              },
              {
                img: '/images/road-freight-800.jpg',
                title: 'Fleet and final mile',
                desc: 'Metro and cross-border trucking with scheduled collections, POD photos and ETAs pushed straight to your customer.',
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-3">{service.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">{service.desc}</p>
                  <Link
                    to="/services"
                    className={`inline-flex items-center gap-2 ${c.text} text-xs font-bold hover:opacity-80 transition-opacity`}
                  >
                    Read the detail <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`py-16 ${c.bg} text-white px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: settings.statClients, label: 'Active shippers' },
            { value: settings.statCountries, label: 'Countries served' },
            { value: settings.statDeliveries, label: 'Consignments booked' },
            { value: settings.statYears, label: 'Years clearing UK customs' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-4xl sm:text-5xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-sm uppercase tracking-wider opacity-90">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Day to day</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">What working with us looks like</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Quote back inside four hours',
              'Scans at every handover',
              'Duty and VAT quoted in sterling',
              'One coordinator per account',
              'Collection windows in writing',
              'Claims settled in-house',
              'Weekly lane performance report',
              'Weekend freight desk staffed',
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-3 bg-slate-50 p-4 rounded border-l-4 ${c.border}`}
              >
                <CheckCircle2 className={`w-5 h-5 ${c.text} flex-shrink-0 mt-0.5`} />
                <span className="text-sm font-semibold text-slate-800">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Put a shipment on the board.</h2>
            <p className="text-slate-300">
              Send the lane and the deadline — {settings.siteName} will come back with routing, transit
              time and a landed price.
            </p>
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
              Track freight <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

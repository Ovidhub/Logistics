import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Truck,
  Plane,
  Ship,
  Package,
  Warehouse,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  DollarSign,
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

const PLANE = 'https://images.pexels.com/photos/32010721/pexels-photo-32010721.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700';
const SHIP = 'https://images.pexels.com/photos/24246926/pexels-photo-24246926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700';
const TRUCK = 'https://images.pexels.com/photos/31310062/pexels-photo-31310062.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700';
const WAREHOUSE = 'https://images.pexels.com/photos/4170172/pexels-photo-4170172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700';
const PORT = 'https://images.pexels.com/photos/15346128/pexels-photo-15346128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700';
const TRUCK2 = 'https://images.pexels.com/photos/15379824/pexels-photo-15379824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700';

const services = [
  {
    icon: <Plane className="w-7 h-7" />,
    image: PLANE,
    title: 'Air Freight',
    desc: 'Fast, reliable air cargo services with global coverage. Perfect for time-sensitive and high-value shipments requiring rapid delivery.',
    features: ['Express delivery', 'Door-to-door service', 'Temperature controlled', 'Dangerous goods'],
  },
  {
    icon: <Ship className="w-7 h-7" />,
    image: SHIP,
    title: 'Ocean Freight',
    desc: 'Cost-effective sea freight solutions for large volume shipments. Full container loads (FCL) and less than container loads (LCL) available.',
    features: ['FCL & LCL options', 'Port-to-port shipping', 'Container tracking', 'Customs clearance'],
  },
  {
    icon: <Truck className="w-7 h-7" />,
    image: TRUCK,
    title: 'Road Transport',
    desc: 'Efficient ground transportation across cities and countries. Our modern fleet ensures safe, timely delivery to any destination.',
    features: ['Full truck load', 'Less than truck load', 'Last-mile delivery', 'Real-time GPS'],
  },
  {
    icon: <Warehouse className="w-7 h-7" />,
    image: WAREHOUSE,
    title: 'Warehousing',
    desc: 'State-of-the-art storage facilities with inventory management, fulfillment services, and 24/7 security monitoring.',
    features: ['Climate controlled', 'Inventory management', 'Pick & pack', 'Distribution'],
  },
  {
    icon: <FileText className="w-7 h-7" />,
    image: PORT,
    title: 'Custom Brokerage',
    desc: 'Expert customs clearance services to navigate international trade regulations smoothly and avoid costly delays.',
    features: ['Documentation', 'Duty calculation', 'Compliance support', 'Trade consulting'],
  },
  {
    icon: <Package className="w-7 h-7" />,
    image: TRUCK2,
    title: 'Express Delivery',
    desc: 'Premium express delivery services for urgent shipments. Same-day, next-day, and time-definite delivery options available.',
    features: ['Same-day delivery', 'Next-day delivery', 'Priority handling', 'Signature required'],
  },
];

const process = [
  { num: '01', title: 'Get Quote', desc: 'Request a free quote for your shipment needs.' },
  { num: '02', title: 'Book Service', desc: 'Choose your service and confirm booking online.' },
  { num: '03', title: 'Pickup', desc: 'Our team picks up your cargo at scheduled time.' },
  { num: '04', title: 'Delivery', desc: 'Track in real-time until safe delivery.' },
];

export default function ServicesPage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  return (
    <div className="bg-white">
      <PageBanner title="Our Services" breadcrumb="Services" />

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Complete Logistics Solutions
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              From air freight to warehousing, we offer end-to-end logistics services tailored to meet your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded shadow-sm overflow-hidden hover:shadow-xl transition-shadow border border-slate-100"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 left-4 ${c.bg} text-white p-2.5 rounded shadow-lg`}>
                    {service.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-slate-900 text-lg mb-3">{service.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{service.desc}</p>

                  <ul className="space-y-1.5 mb-5">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${c.text} flex-shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-bold transition-colors"
                  >
                    Get Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 font-bold text-sm uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Simple 4-Step Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-slate-800 p-6 rounded text-center hover:bg-slate-700 transition-colors"
              >
                <div className="text-5xl font-extrabold text-red-600 mb-3 opacity-30">{step.num}</div>
                <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-slate-400">{step.desc}</p>
                {i < process.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-red-600 w-6 h-6 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-600 font-bold text-sm uppercase tracking-wider mb-3">Why Atrans Services</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Benefits You Get</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Clock className="w-6 h-6" />, title: 'On-Time Delivery', desc: 'We guarantee timely delivery for all your shipments.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Fully Insured', desc: 'Every shipment is covered by comprehensive insurance.' },
              { icon: <DollarSign className="w-6 h-6" />, title: 'Best Prices', desc: 'Competitive rates without compromising on quality.' },
              { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Quality Service', desc: 'Award-winning service trusted by thousands of clients.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-50 rounded p-6 border-l-4 border-red-600"
              >
                <div className="text-red-600 mb-3">{item.icon}</div>
                <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-red-600 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Need a Custom Solution?</h2>
            <p className="text-red-100">Contact our logistics experts for a tailored quote today.</p>
          </div>
          <Link
            to="/contact"
            className="bg-white text-red-600 hover:bg-slate-100 text-sm font-bold px-8 py-3 rounded transition-colors inline-flex items-center gap-2"
          >
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

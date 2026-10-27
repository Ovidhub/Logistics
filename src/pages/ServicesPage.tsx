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
    desc: 'Next-flight-out for the shipment that cannot wait, and consolidated air lanes that keep cost per kilo sensible.',
    features: ['Express and deferred options', 'Door-to-door or airport-to-airport', 'Temperature-controlled cargo', 'Dangerous goods certified'],
  },
  {
    icon: <Ship className="w-7 h-7" />,
    image: SHIP,
    title: 'Ocean Freight',
    desc: 'FCL and LCL sailings on the major trade lanes, with realistic transit times and clearance handled before your container hits the quay.',
    features: ['FCL and LCL options', 'Port-to-port or door-to-door', 'Container-level tracking', 'Customs clearance included'],
  },
  {
    icon: <Truck className="w-7 h-7" />,
    image: TRUCK,
    title: 'Road Transport',
    desc: 'Owned trucks and vetted carriers for regional, cross-border and metro runs — GPS on every load, no exceptions.',
    features: ['Full and partial truckload', 'Cross-border documentation', 'Same-day metro delivery', 'Live GPS tracking'],
  },
  {
    icon: <Warehouse className="w-7 h-7" />,
    image: WAREHOUSE,
    title: 'Warehousing',
    desc: 'Ambient and bonded storage with pick-and-pack, cycle counts and same-day dispatch from our hub network.',
    features: ['Short and long-term storage', 'Pick, pack and fulfilment', 'Real-time inventory portal', '24/7 monitored sites'],
  },
  {
    icon: <FileText className="w-7 h-7" />,
    image: PORT,
    title: 'Customs Brokerage',
    desc: 'Licensed brokers who classify, file and clear — so your goods move off the dock instead of accruing storage fees.',
    features: ['Entry filing', 'Duty and tariff calculation', 'Compliance and audit support', 'Trade consulting'],
  },
  {
    icon: <Package className="w-7 h-7" />,
    image: TRUCK2,
    title: 'Express Delivery',
    desc: 'Time-definite delivery for urgent parts and documents, with proof of delivery the moment it lands.',
    features: ['Same-day and next-day', 'Priority handling', 'Signature or photo POD', 'Dedicated courier'],
  },
];

const process = [
  { num: '01', title: 'Tell us what’s moving', desc: 'Send the lane, the weight and the deadline. We’ll ask the three questions that actually matter.' },
  { num: '02', title: 'Approve the quote', desc: 'One price covering freight, customs and insurance. Same-day turnaround on standard lanes.' },
  { num: '03', title: 'We collect', desc: 'Booked windows, scanned at pickup and on the road the same day wherever possible.' },
  { num: '04', title: 'You watch it land', desc: 'Live tracking, proactive alerts and proof of delivery in your inbox.' },
];

export default function ServicesPage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  return (
    <div className="bg-white">
      <PageBanner title="Our services" breadcrumb="Services" />

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>What we offer</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Every mode, cleared and covered.
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Air, ocean, road, storage and customs under one contract — so you brief one team instead of five.
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
                    loading="lazy"
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
                    className={`inline-flex items-center gap-2 ${c.text} hover:opacity-80 text-sm font-bold transition-opacity`}
                  >
                    Get a quote <ArrowRight className="w-4 h-4" />
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
            <p className={`${c.textLight} font-bold text-sm uppercase tracking-wider mb-3`}>How it works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Four steps, no mystery</h2>
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
                <div className={`text-5xl font-extrabold ${c.textLight} mb-3 opacity-30`}>{step.num}</div>
                <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-slate-400">{step.desc}</p>
                {i < process.length - 1 && (
                  <ArrowRight className={`hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 ${c.textLight} w-6 h-6 z-10`} />
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
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>What you get</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Included in every contract
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'On-time delivery',
                desc: 'Written service levels, and a call the moment a lane slips — not after you notice.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Fully insured',
                desc: 'Full-value cover on every shipment, with claims handled in-house instead of outsourced.',
              },
              {
                icon: <DollarSign className="w-6 h-6" />,
                title: 'Honest pricing',
                desc: 'One transparent quote. No surprise fuel, handling or documentation line items.',
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: 'Real people',
                desc: 'A named contact who knows your lanes and answers on the first ring.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`bg-slate-50 rounded p-6 border-l-4 ${c.border}`}
              >
                <div className={`${c.text} mb-3`}>{item.icon}</div>
                <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 ${c.bg} text-white px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Need something we haven’t listed?</h2>
            <p className="text-white/80">
              Tell us what’s moving and we’ll build the route, the paperwork and the price around it.
            </p>
          </div>
          <Link
            to="/contact"
            className={`bg-white ${c.text} hover:bg-slate-100 text-sm font-bold px-8 py-3 rounded transition-colors inline-flex items-center gap-2`}
          >
            Talk to a specialist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

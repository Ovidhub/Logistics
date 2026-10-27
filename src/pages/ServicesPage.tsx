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

const services = [
  {
    icon: <Plane className="w-7 h-7" />,
    image: '/images/air-freight.jpg',
    title: 'Air freight',
    desc: 'Charter, consolidated and next-flight-out capacity for cargo with a fixed date on it — booked against a real cut-off, not a hopeful one.',
    features: ['Next-flight-out recovery', 'Consolidated economy air', 'Temperature-sensitive cargo', 'Dangerous goods certified'],
  },
  {
    icon: <Ship className="w-7 h-7" />,
    image: '/images/ocean-freight.jpg',
    title: 'Ocean freight',
    desc: 'Weekly FCL sailings and LCL groupage on the trade lanes we know best, with transhipment risk explained before you book.',
    features: ['FCL and LCL', 'Buyer’s consolidation', 'Reefer and OOG cargo', 'Detention and demurrage watch'],
  },
  {
    icon: <Truck className="w-7 h-7" />,
    image: '/images/road-freight.jpg',
    title: 'Road transport',
    desc: 'Owned tractors for scheduled linehauls, vetted carriers for overflow, and a border team that pre-files cross-border paperwork.',
    features: ['FTL and part loads', 'Cross-border bonded moves', 'Metro distribution', 'Live GPS on every load'],
  },
  {
    icon: <Warehouse className="w-7 h-7" />,
    image: '/images/warehouse.jpg',
    title: 'Warehousing',
    desc: 'Racked ambient space, bonded storage and pick-and-pack from hub locations, billed per pallet position with no minimum term.',
    features: ['Bonded and ambient', 'Pick, pack, dispatch', 'Live stock portal', 'Cycle counts weekly'],
  },
  {
    icon: <FileText className="w-7 h-7" />,
    image: '/images/aerial-port.jpg',
    title: 'Customs brokerage',
    desc: 'Licensed brokers who classify, file and clear — including post-entry adjustments and duty drawback when it applies to you.',
    features: ['Entry filing and bonds', 'Tariff classification', 'Duty drawback claims', 'Audit and compliance support'],
  },
  {
    icon: <Package className="w-7 h-7" />,
    image: '/images/express.jpg',
    title: 'Express delivery',
    desc: 'Time-definite delivery for spare parts, samples and documents, with the recipient notified before the van leaves the depot.',
    features: ['Same-day and next-day', 'Dedicated vehicle', 'Photo and signature POD', 'Recipient SMS updates'],
  },
];

const process = [
  { num: '01', title: 'Send the lane', desc: 'Origin, destination, weight, deadline. Four numbers is usually enough to price it.' },
  { num: '02', title: 'Approve one price', desc: 'Freight, duty estimate and cover in a single figure — back inside four working hours.' },
  { num: '03', title: 'We collect and clear', desc: 'Booked window, scanned at pickup, entry filed before the vessel or flight lands.' },
  { num: '04', title: 'You watch it land', desc: 'Scan history, current position and proof of delivery in the same portal.' },
];

export default function ServicesPage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  return (
    <div className="bg-white">
      <PageBanner title="Our services" breadcrumb="Services" />

      {/* Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Six services. One point of accountability.
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Mix the modes you need under a single contract — the same coordinator, the same invoice,
              the same tracking view.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
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
                    Price this service <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.textLight} font-bold text-sm uppercase tracking-wider mb-3`}>The process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Booking freight takes four steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative bg-slate-800 p-6 rounded hover:bg-slate-700 transition-colors"
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

      {/* Included */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Standard terms</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Included on every booking
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Booked transit times',
                desc: 'A date we commit to in writing, with an early call if a lane slips.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Cargo cover',
                desc: 'Full-value insurance as standard, extended cover available on request.',
              },
              {
                icon: <DollarSign className="w-6 h-6" />,
                title: 'One landed price',
                desc: 'Freight, fuel, duty estimate and clearance in a single quote.',
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: 'A named coordinator',
                desc: 'Someone who knows your lanes and answers their own phone.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
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
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Not sure which mode you need?</h2>
            <p className="text-white/80">
              Send the details and a lane specialist will tell you what is fastest, what is cheapest and
              where the risk sits.
            </p>
          </div>
          <Link
            to="/contact"
            className={`bg-white ${c.text} hover:bg-slate-100 text-sm font-bold px-8 py-3 rounded transition-colors inline-flex items-center gap-2`}
          >
            Ask a lane specialist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

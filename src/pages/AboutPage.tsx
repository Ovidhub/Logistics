import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  Award,
  Users,
  Globe,
  Shield,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Heart,
  Zap,
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

const WAREHOUSE = 'https://images.pexels.com/photos/4487363/pexels-photo-4487363.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900';
const TEAM = 'https://images.pexels.com/photos/4483860/pexels-photo-4483860.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900';

export default function AboutPage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  return (
    <div className="bg-white">
      <PageBanner title="About us" breadcrumb="About" />

      {/* Intro Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={WAREHOUSE}
              alt="Warehouse team loading freight"
              loading="lazy"
              className="rounded shadow-lg w-full"
            />
            <div className={`absolute -bottom-6 -right-6 ${c.bg} text-white p-6 rounded shadow-xl hidden md:block`}>
              <p className="text-4xl font-extrabold">{settings.yearsExperience}</p>
              <p className="text-xs uppercase tracking-wider">Years moving freight</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Who we are</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
              We built the logistics company we kept wishing we could hire.
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Atrans started in 2013 with three trucks, two customers and a simple frustration: nobody
              could tell you where a shipment was, or who to call when it went wrong. We decided to be
              the exception — a forwarder that answers the phone and a tracker that tells the truth.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Today we move freight for {settings.statClients} businesses across {settings.statCountries}{' '}
              countries, combining owned road capacity with vetted air and ocean partners. Same
              discipline as day one: one accountable team, clear pricing and a live view of every load.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {['ISO 9001 certified', 'IATA approved', 'GDP compliant', 'AEO authorised'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${c.text} flex-shrink-0`} />
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 ${c.bg} ${c.bgHover} text-white text-sm font-semibold px-6 py-3 rounded transition-colors`}
            >
              Talk to our team <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>What drives us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Mission, vision and the standards we hold
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-7 h-7" />,
                title: 'Our mission',
                desc: 'Make freight predictable — so our customers can promise a delivery date to their customers and keep it, every time.',
              },
              {
                icon: <Eye className="w-7 h-7" />,
                title: 'Our vision',
                desc: 'To be the logistics partner businesses name first, not the one they fall back on when something goes wrong.',
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: 'Our values',
                desc: 'Answers over excuses. Care over volume. We treat every pallet like it is the last one before launch day.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded shadow-sm p-7 border-t-4 ${c.border} hover:-translate-y-1 transition-transform`}
              >
                <div className={`${c.text} mb-4`}>{card.icon}</div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Our people</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
              The people behind your delivery
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Freight is a people business with a tracking number attached. Our drivers, brokers,
              warehouse crews and account managers are the reason shipments arrive on time — so we
              invest in them with proper training, fair pay and the authority to fix problems without
              waiting for approval.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: <Users className="w-5 h-5" />,
                  title: 'One team, one handover',
                  desc: 'Your account manager stays with you from quote to delivery. No re-explaining your business to a new voice each week.',
                },
                {
                  icon: <Award className="w-5 h-5" />,
                  title: 'Recognised for service',
                  desc: 'Repeat industry awards for reliability, and a client retention rate we are quietly proud of.',
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  title: 'Growing where you grow',
                  desc: 'We add lanes, hubs and capacity as our customers do — not a year behind them.',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`${c.bgLight} ${c.text} p-3 rounded flex-shrink-0`}>{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={TEAM}
              alt="Atrans logistics team at work"
              loading="lazy"
              className="rounded shadow-lg w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Why {settings.siteName}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">What sets us apart</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Globe className="w-6 h-6" />, title: 'Global network', desc: 'Vetted partners in 150+ countries, managed from one desk.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Secure handling', desc: 'Full-value insurance and a scan at every handover.' },
              { icon: <Zap className="w-6 h-6" />, title: 'Speed where it counts', desc: 'Express lanes for the shipments your quarter depends on.' },
              { icon: <Award className="w-6 h-6" />, title: 'Accountable service', desc: 'Named contacts, written SLAs, real answers.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded shadow-sm p-6 text-center hover:-translate-y-1 transition-transform"
              >
                <div className={`w-14 h-14 ${c.bgLight} rounded-full ${c.text} flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

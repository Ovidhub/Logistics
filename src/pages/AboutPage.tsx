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

const TEAM_IMG = '/images/team.jpg';
const WAREHOUSE_IMG = '/images/warehouse.jpg';

export default function AboutPage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  return (
    <div className="bg-white">
      <PageBanner title="About us" breadcrumb="About" />

      {/* Intro */}
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
              src={WAREHOUSE_IMG}
              alt="Forklift moving pallets inside the Atrans warehouse"
              loading="lazy"
              className="rounded shadow-lg w-full"
            />
            <div className={`absolute -bottom-6 -right-6 ${c.bg} text-white p-6 rounded shadow-xl hidden md:block`}>
              <p className="text-4xl font-extrabold">{settings.yearsExperience}</p>
              <p className="text-xs uppercase tracking-wider">Years clearing freight</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Our story</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
              Three trucks, one customer, and a promise to call back the same day.
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Atrans began in 2013 handling port-to-door deliveries for a single electronics importer.
              The work was simple; the industry around it was not. Brokers went quiet, tracking went
              stale and invoices arrived with lines nobody could explain.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              We built the opposite. Today a team of coordinators, brokers and drivers moves freight for{' '}
              {settings.statClients} shippers across {settings.statCountries} countries — with clearance
              prepared before arrival, scans recorded at every handover and one person accountable for
              the outcome.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {['ISO 9001:2015', 'IATA accredited', 'AEO authorised', 'GDP compliant'].map((item) => (
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
              Meet the team <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission / vision / values */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>How we work</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              The rules we don’t bend
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-7 h-7" />,
                title: 'Mission',
                desc: 'Move freight so predictably that our customers stop building delay allowances into their own promises.',
              },
              {
                icon: <Eye className="w-7 h-7" />,
                title: 'Vision',
                desc: 'A single tracking view across every mode and border — so a supply chain is as visible as a courier parcel.',
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: 'Values',
                desc: 'Say the hard thing early. Quote the real number. Pick up the phone. Own the mistake, then fix it.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
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

      {/* People */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>The crew</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
              Every consignment has a name attached to it.
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Brokers who know which tariff codes raise questions. Drivers who have run the same border
              post for years. Warehouse leads who count twice. Our people are why a collection window is
              a commitment rather than a suggestion.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: <Users className="w-5 h-5" />,
                  title: 'One coordinator, start to finish',
                  desc: 'You deal with the same person from quote to proof of delivery — with a named backup for holidays.',
                },
                {
                  icon: <Award className="w-5 h-5" />,
                  title: 'Trained, then trusted',
                  desc: 'Customs and dangerous-goods certifications renewed annually, with authority to resolve issues on the spot.',
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  title: 'Measured weekly',
                  desc: 'Lane-level on-time performance reviewed every Monday, shared with customers who want the numbers.',
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
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={TEAM_IMG}
              alt="Atrans coordinators and warehouse team"
              loading="lazy"
              className="rounded shadow-lg w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Why {settings.siteName}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Where we differ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Globe className="w-6 h-6" />, title: 'Audited partners', desc: 'Every overseas agent re-checked annually on service and solvency.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Cover that pays', desc: 'Full-value cargo insurance with claims handled by our own team.' },
              { icon: <Zap className="w-6 h-6" />, title: 'Decisions same day', desc: 'Rates, routing changes and holds answered before close of business.' },
              { icon: <Award className="w-6 h-6" />, title: 'No hidden lines', desc: 'Duty, fuel and handling quoted up front — the invoice matches the quote.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
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

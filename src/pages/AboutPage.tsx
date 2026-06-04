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
      <PageBanner title="About Us" breadcrumb="About" />

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
            <img src={WAREHOUSE} alt="Warehouse" className="rounded shadow-lg w-full" />
            <div className={`absolute -bottom-6 -right-6 ${c.bg} text-white p-6 rounded shadow-xl hidden md:block`}>
              <p className="text-4xl font-extrabold">{settings.yearsExperience}</p>
              <p className="text-xs uppercase tracking-wider">Years of Experience</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Who We Are</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
              Pioneering Excellence in Global Logistics
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Atrans is a leading global logistics provider founded in 2013, dedicated to delivering integrated freight and supply chain solutions to businesses of all sizes. We combine cutting-edge technology with industry expertise to provide reliable, efficient, and cost-effective logistics services.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              With a presence in over 150 countries and a team of 2,500+ logistics professionals, we move millions of shipments every year. Our commitment to innovation, sustainability, and customer satisfaction has made us a trusted partner for businesses worldwide.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {['ISO 9001 Certified', 'IATA Approved', 'GDP Compliant', 'AEO Authorized'].map((item) => (
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
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Our Foundation</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Mission, Vision & Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-7 h-7" />,
                title: 'Our Mission',
                desc: 'To deliver seamless, technology-driven logistics solutions that empower businesses to reach customers anywhere in the world with confidence and ease.',
              },
              {
                icon: <Eye className="w-7 h-7" />,
                title: 'Our Vision',
                desc: 'To be the most trusted global logistics partner, setting new standards in shipping reliability, sustainability, and customer experience worldwide.',
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: 'Our Values',
                desc: 'Integrity, innovation, and customer-centricity guide every decision we make. We treat each shipment as if it were our own most valuable possession.',
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
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Our People</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
              The Heart of Atrans is Our People
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Our success is driven by our dedicated team of logistics experts, drivers, warehouse staff, and customer service professionals. We invest in our people through continuous training, fair compensation, and a culture of respect and collaboration.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: <Users className="w-5 h-5" />,
                  title: '2,500+ Employees',
                  desc: 'A diverse global team across 150+ countries working together.',
                },
                {
                  icon: <Award className="w-5 h-5" />,
                  title: 'Industry Recognition',
                  desc: 'Winner of multiple logistics excellence awards over the years.',
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  title: 'Continuous Growth',
                  desc: 'Expanding our network and capabilities every single year.',
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
            <img src={TEAM} alt="Our team" className="rounded shadow-lg w-full" />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Why {settings.siteName}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">What Sets Us Apart</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Globe className="w-6 h-6" />, title: 'Global Network', desc: 'Operations in 150+ countries worldwide.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Secure Handling', desc: 'Full insurance and tracking on every shipment.' },
              { icon: <Zap className="w-6 h-6" />, title: 'Fast Delivery', desc: 'Express options for time-critical cargo.' },
              { icon: <Award className="w-6 h-6" />, title: 'Award Winning', desc: 'Recognized for service excellence.' },
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

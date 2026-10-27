import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, User, MessageSquare } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

export default function ContactPage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  const inputClass =
    `w-full px-4 py-3 rounded border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 ${c.ring} focus:border-transparent transition-all bg-white`;

  return (
    <div className="bg-white">
      <PageBanner title="Talk to us" breadcrumb="Contact" />

      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <MapPin className="w-7 h-7" />,
                title: 'Office',
                lines: settings.address.split(',').map((s) => s.trim()),
              },
              {
                icon: <Phone className="w-7 h-7" />,
                title: 'Phone',
                lines: [settings.phone, settings.phoneSecondary, `Mon–Fri, ${settings.hoursWeekday}`],
              },
              {
                icon: <Mail className="w-7 h-7" />,
                title: 'Email',
                lines: [settings.email, settings.emailSales, settings.emailSupport],
              },
            ].map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white border border-slate-100 rounded shadow-sm p-7 text-center hover:-translate-y-1 transition-transform border-t-4 ${c.borderT}`}
              >
                <div className={`w-16 h-16 ${c.bgLight} ${c.text} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-3">{info.title}</h3>
                {info.lines.map((line, j) => (
                  <p key={j} className="text-sm text-slate-500">
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Quote request</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                Book a lane, or ask us anything
              </h2>
              <p className="text-slate-600 mb-6">
                Send the lane, the weight and the date it needs to land. A coordinator comes back with
                routing, transit time and one landed price — usually inside four working hours.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border-2 border-emerald-200 rounded p-6 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-lg font-extrabold text-emerald-900 mb-1">That’s in our queue.</h3>
                  <p className="text-sm text-emerald-700">
                    A coordinator will reply within four working hours — sooner if you flagged it urgent.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Your name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`${inputClass} pl-10`}
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Work email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`${inputClass} pl-10`}
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`${inputClass} pl-10`}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">What do you need?</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={inputClass}
                      >
                        <option value="">Choose one…</option>
                        <option value="quote">Quote for a new lane</option>
                        <option value="customs">Customs or clearance question</option>
                        <option value="tracking">A live shipment</option>
                        <option value="warehouse">Warehouse space</option>
                        <option value="supplier">Supplier or carrier enquiry</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Shipment details</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className={`${inputClass} pl-10 resize-none`}
                        placeholder="Origin, destination, weight and deadline — plus anything unusual: hazmat, reefer, oversize."
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`${c.bg} ${c.bgHover} disabled:opacity-60 text-white font-bold px-6 py-3 rounded transition-colors inline-flex items-center gap-2`}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Map & Hours */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="rounded shadow-lg overflow-hidden border border-slate-200">
                <iframe
                  title={`${settings.siteName} head office on Google Maps`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-[300px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <div className="bg-slate-900 text-white p-6 rounded">
                <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2">
                  <Clock className={`w-5 h-5 ${c.textLight}`} />
                  When the desk is staffed
                </h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { day: 'Monday – Friday', hours: settings.hoursWeekday },
                    { day: 'Saturday', hours: settings.hoursSaturday },
                    { day: 'Sunday', hours: settings.hoursSunday },
                    { day: 'Duty freight desk', hours: '24/7' },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-b-0"
                    >
                      <span className="text-slate-300">{item.day}</span>
                      <span className="font-semibold">{item.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`${c.bg} text-white p-6 rounded`}>
                <h3 className="text-lg font-extrabold mb-2">Freight held at the border?</h3>
                <p className="text-sm text-white/90 mb-4">
                  Call the duty desk. A coordinator answers, day or night — no ticket queue, no callback
                  promise.
                </p>
                <a
                  href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}
                  className={`inline-flex items-center gap-2 bg-white ${c.text} hover:bg-slate-100 text-sm font-bold px-5 py-2.5 rounded transition-colors`}
                >
                  <Phone className="w-4 h-4" /> Call {settings.phone}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Questions</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              What new customers usually ask first
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How quickly will I get a rate?',
                a: 'Standard lanes inside four working hours, complex multi-leg or hazardous moves within one business day. Rates are quoted landed — freight, fuel, clearance and cover in one figure.',
              },
              {
                q: 'Can you collect today?',
                a: 'In most metro areas yes, if you brief us before 11am and the cargo is packed and labelled. Air and ocean bookings usually need 24–48 hours before cut-off.',
              },
              {
                q: 'Who handles customs?',
                a: 'Our own licensed brokers. Entries are filed before the flight or vessel arrives, and we watch demurrage clocks so you are not paying for a desk delay.',
              },
              {
                q: 'What happens if cargo is damaged?',
                a: 'Full-value cover is standard. Claims are handled in-house: photographs, survey and settlement processed by the coordinator who booked the freight.',
              },
              {
                q: 'Do you work with small volumes?',
                a: 'Yes — LCL groupage, part loads and single-pallet storage are all normal. There is no minimum contract term on warehouse space.',
              },
              {
                q: 'Where do I find proof of delivery?',
                a: 'Open the consignment on the Track page and use “Receipt” for a PDF record with the delivery timestamp and signature, or ask your coordinator.',
              },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded border border-slate-200 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:${c.bgLight} transition-colors`}
      >
        <span className="font-bold text-slate-900 text-sm sm:text-base">{question}</span>
        <span
          className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-lg transition-all ${
            open ? `${c.bg} text-white rotate-45` : `${c.bgLight} ${c.text}`
          }`}
        >
          +
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
}

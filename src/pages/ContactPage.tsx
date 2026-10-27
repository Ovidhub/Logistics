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
      <PageBanner title="Contact us" breadcrumb="Contact" />

      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <MapPin className="w-7 h-7" />,
                title: 'Head office',
                lines: settings.address.split(',').map((s) => s.trim()),
              },
              {
                icon: <Phone className="w-7 h-7" />,
                title: 'Talk to a person',
                lines: [settings.phone, settings.phoneSecondary, `Mon–Fri, ${settings.hoursWeekday}`],
              },
              {
                icon: <Mail className="w-7 h-7" />,
                title: 'Email the right desk',
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
              <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Get in touch</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                Tell us what’s moving
              </h2>
              <p className="text-slate-600 mb-6">
                Send the basics — origin, destination, weight and deadline — and a human replies with
                pricing and a proposed route within one business day.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border-2 border-emerald-200 rounded p-6 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-lg font-extrabold text-emerald-900 mb-1">Message received.</h3>
                  <p className="text-sm text-emerald-700">
                    Thanks for the detail — someone from our team will come back to you within one
                    business day, usually sooner.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Full name</label>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">What’s this about?</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={inputClass}
                      >
                        <option value="">Choose a subject…</option>
                        <option value="quote">Request a quote</option>
                        <option value="tracking">Track a shipment</option>
                        <option value="support">Customer support</option>
                        <option value="partnership">Partnership or supplier</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Details</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className={`${inputClass} pl-10 resize-none`}
                        placeholder="Origin, destination, weight, deadline — anything that helps us quote accurately."
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
                  When we’re open
                </h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { day: 'Monday – Friday', hours: settings.hoursWeekday },
                    { day: 'Saturday', hours: settings.hoursSaturday },
                    { day: 'Sunday', hours: settings.hoursSunday },
                    { day: 'Out-of-hours freight desk', hours: '24/7' },
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
                <h3 className="text-lg font-extrabold mb-2">Freight stuck right now?</h3>
                <p className="text-sm text-white/90 mb-4">
                  Call the out-of-hours desk. A duty coordinator answers — not a ticket queue.
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
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Answers</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Questions we get before the first quote
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How do I track a shipment?',
                a: 'Enter the tracking number on the Track page. You’ll see the full event history, current location, route map and estimated delivery — no login needed.',
              },
              {
                q: 'What does a quote include?',
                a: 'Freight, fuel, terminal handling, customs brokerage and standard insurance, quoted as one number. If something cannot be known up front, we say so before you book.',
              },
              {
                q: 'How fast can you collect?',
                a: 'Same-day collection is available in most metro areas if you brief us before 11am. Air and ocean bookings typically need 24–48 hours of notice.',
              },
              {
                q: 'Is my cargo insured?',
                a: 'Every shipment carries full-value cover as standard. For high-value or unusual cargo we’ll arrange extended cover and confirm the terms in writing.',
              },
              {
                q: 'Can I change the delivery address after booking?',
                a: 'Yes, until the consignment is out for final-mile delivery. Call the desk with the tracking number and we’ll re-route and re-confirm the ETA.',
              },
              {
                q: 'How do I get a proof-of-delivery receipt?',
                a: 'Open the shipment on the Track page and use “Receipt” to print or download a PDF record with the delivery timestamp and signature.',
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

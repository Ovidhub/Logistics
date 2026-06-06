import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  LogOut,
  ChevronRight,
  Save,
  RotateCcw,
  Building2,
  Phone,
  Share2,
  Clock,
  Image,
  BarChart3,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Type,
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { type SiteSettings } from '../types/settings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

interface SuperAdminPageProps {
  onLogout: () => void;
}

type TabId = 'branding' | 'contact' | 'social' | 'hours' | 'hero' | 'about' | 'stats' | 'colors';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'branding', label: 'Branding', icon: <Building2 className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact Info', icon: <Phone className="w-4 h-4" /> },
  { id: 'social', label: 'Social Media', icon: <Share2 className="w-4 h-4" /> },
  { id: 'hours', label: 'Business Hours', icon: <Clock className="w-4 h-4" /> },
  { id: 'hero', label: 'Hero Section', icon: <Image className="w-4 h-4" /> },
  { id: 'about', label: 'About Section', icon: <Type className="w-4 h-4" /> },
  { id: 'stats', label: 'Statistics', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'colors', label: 'Theme Color', icon: <Palette className="w-4 h-4" /> },
];

export default function SuperAdminPage({ onLogout }: SuperAdminPageProps) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<TabId>('branding');
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [logoError, setLogoError] = useState('');

  // Sync formData when settings change externally
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith('image/')) { setLogoError('Please choose an image file.'); return; }
    if (file.size > 300 * 1024) { setLogoError('Image must be 300 KB or smaller.'); return; }
    const reader = new FileReader();
    reader.onload = () => { handleChange('logoImage', String(reader.result)); setLogoError(''); };
    reader.onerror = () => setLogoError('Could not read that file.');
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    await updateSettings(formData);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = async () => {
    await resetSettings();
    setShowResetConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDiscard = () => {
    setFormData(settings);
    setDirty(false);
  };

  const inputClass =
    'w-full px-3 py-2.5 rounded border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Banner */}
      <div
        className="bg-cover bg-center py-12 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.75)), url(https://images.pexels.com/photos/4170172/pexels-photo-4170172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1920)`,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-500 p-1.5 rounded">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Super Admin Panel</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-yellow-500">Site Settings</span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/"
              target="_blank"
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-4 py-2.5 rounded font-semibold flex items-center gap-2 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              Preview Site
            </Link>
            <button
              onClick={onLogout}
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-4 py-2.5 rounded font-semibold flex items-center gap-2 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-6">
        {/* Save Status Banner */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Settings saved successfully! Changes are live across the site.</span>
            </motion.div>
          )}
          {dirty && !saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded flex items-center justify-between gap-2 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-semibold">You have unsaved changes</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDiscard}
                  className="text-sm font-semibold text-amber-700 hover:text-amber-900 px-3 py-1 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar Tabs */}
          <aside className="bg-white rounded shadow-sm border border-slate-200 p-3 h-fit lg:sticky lg:top-20">
            <div className="px-2 py-3 border-b border-slate-100 mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Site Settings</p>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="border-t border-slate-100 mt-3 pt-3">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="bg-white rounded shadow-sm border border-slate-200 border-t-4 border-t-yellow-500">
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Branding Tab */}
                  {activeTab === 'branding' && (
                    <Section
                      title="Branding & Identity"
                      desc="Update your site name, logo, and tagline."
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Site Name">
                          <input
                            value={formData.siteName}
                            onChange={(e) => handleChange('siteName', e.target.value)}
                            className={inputClass}
                            placeholder="Atrans"
                          />
                        </Field>
                        <Field label="Accent Letter (highlighted in logo)">
                          <input
                            value={formData.siteNameAccent}
                            onChange={(e) => handleChange('siteNameAccent', e.target.value)}
                            className={inputClass}
                            placeholder="A"
                            maxLength={3}
                          />
                          <p className="text-xs text-slate-500 mt-1">First letter(s) shown in primary color</p>
                        </Field>
                      </div>
                      <Field label="Tagline">
                        <input
                          value={formData.tagline}
                          onChange={(e) => handleChange('tagline', e.target.value)}
                          className={inputClass}
                          placeholder="Your trusted logistics partner"
                        />
                      </Field>

                      <Field label="Logo Image (optional)">
                        <div className="flex items-center gap-3 flex-wrap">
                          {formData.logoImage ? (
                            <img src={formData.logoImage} alt="Logo preview" className="h-10 w-10 object-contain rounded bg-white border border-slate-200" />
                          ) : (
                            <span className="text-xs text-slate-400">No image — the truck icon is used</span>
                          )}
                          <label className="cursor-pointer text-sm font-semibold text-red-600 hover:text-red-700">
                            Upload image
                            <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={handleLogoUpload} />
                          </label>
                          {formData.logoImage && (
                            <button type="button" onClick={() => handleChange('logoImage', '')} className="text-sm text-slate-500 hover:text-slate-700">Remove</button>
                          )}
                        </div>
                        {logoError && <p className="text-xs text-red-600 mt-1">{logoError}</p>}
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, SVG or WebP, up to 300&nbsp;KB. Replaces the truck icon across the site.</p>
                      </Field>

                      {/* Logo Preview */}
                      <div className="bg-slate-50 rounded p-5 border border-slate-200">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Logo Preview</p>
                        <div className="flex items-center gap-2">
                          {formData.logoImage ? (
                            <img src={formData.logoImage} alt="Logo" className="h-9 w-auto max-w-[120px] object-contain" />
                          ) : (
                            <div className={`${colorClasses[formData.primaryColor as PrimaryColor]?.bg || 'bg-red-600'} p-1.5 rounded`}>
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                                <path d="M15 18H9"/>
                                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                                <circle cx="17" cy="18" r="2"/>
                                <circle cx="7" cy="18" r="2"/>
                              </svg>
                            </div>
                          )}
                          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                            <span className={`${colorClasses[formData.primaryColor as PrimaryColor]?.text || 'text-red-600'}`}>{formData.siteNameAccent}</span>
                            {formData.siteName.slice(formData.siteNameAccent.length)}
                          </span>
                        </div>
                      </div>
                    </Section>
                  )}

                  {/* Contact Tab */}
                  {activeTab === 'contact' && (
                    <Section
                      title="Contact Information"
                      desc="Update phone numbers, email addresses, and office address shown across the site."
                    >
                      <Field label="Office Address">
                        <input
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          className={inputClass}
                          placeholder="92 Bowery St New York, NY 10013"
                        />
                      </Field>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Primary Phone">
                          <input
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className={inputClass}
                            placeholder="+1 (800) 555-0199"
                          />
                        </Field>
                        <Field label="Secondary Phone">
                          <input
                            value={formData.phoneSecondary}
                            onChange={(e) => handleChange('phoneSecondary', e.target.value)}
                            className={inputClass}
                            placeholder="+1 (212) 555-0123"
                          />
                        </Field>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <Field label="Primary Email">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={inputClass}
                            placeholder="support@atrans.com"
                          />
                        </Field>
                        <Field label="Sales Email">
                          <input
                            type="email"
                            value={formData.emailSales}
                            onChange={(e) => handleChange('emailSales', e.target.value)}
                            className={inputClass}
                            placeholder="sales@atrans.com"
                          />
                        </Field>
                        <Field label="Info Email">
                          <input
                            type="email"
                            value={formData.emailSupport}
                            onChange={(e) => handleChange('emailSupport', e.target.value)}
                            className={inputClass}
                            placeholder="info@atrans.com"
                          />
                        </Field>
                      </div>
                    </Section>
                  )}

                  {/* Social Tab */}
                  {activeTab === 'social' && (
                    <Section title="Social Media Links" desc="Update links to your social media profiles.">
                      <Field label="Facebook URL">
                        <input
                          value={formData.facebook}
                          onChange={(e) => handleChange('facebook', e.target.value)}
                          className={inputClass}
                          placeholder="https://facebook.com/atrans"
                        />
                      </Field>
                      <Field label="Twitter / X URL">
                        <input
                          value={formData.twitter}
                          onChange={(e) => handleChange('twitter', e.target.value)}
                          className={inputClass}
                          placeholder="https://twitter.com/atrans"
                        />
                      </Field>
                      <Field label="Instagram URL">
                        <input
                          value={formData.instagram}
                          onChange={(e) => handleChange('instagram', e.target.value)}
                          className={inputClass}
                          placeholder="https://instagram.com/atrans"
                        />
                      </Field>
                    </Section>
                  )}

                  {/* Hours Tab */}
                  {activeTab === 'hours' && (
                    <Section title="Business Hours" desc="Update operating hours shown on the contact page.">
                      <Field label="Monday - Friday">
                        <input
                          value={formData.hoursWeekday}
                          onChange={(e) => handleChange('hoursWeekday', e.target.value)}
                          className={inputClass}
                          placeholder="9:00 AM - 6:00 PM"
                        />
                      </Field>
                      <Field label="Saturday">
                        <input
                          value={formData.hoursSaturday}
                          onChange={(e) => handleChange('hoursSaturday', e.target.value)}
                          className={inputClass}
                          placeholder="10:00 AM - 4:00 PM"
                        />
                      </Field>
                      <Field label="Sunday">
                        <input
                          value={formData.hoursSunday}
                          onChange={(e) => handleChange('hoursSunday', e.target.value)}
                          className={inputClass}
                          placeholder="Closed"
                        />
                      </Field>
                    </Section>
                  )}

                  {/* Hero Tab */}
                  {activeTab === 'hero' && (
                    <Section title="Homepage Hero Section" desc="Edit the main banner content shown on the homepage.">
                      <Field label="Hero Title">
                        <input
                          value={formData.heroTitle}
                          onChange={(e) => handleChange('heroTitle', e.target.value)}
                          className={inputClass}
                          placeholder="Digital & Trusted Transport Logistic Company"
                        />
                      </Field>
                      <Field label="Hero Subtitle">
                        <textarea
                          value={formData.heroSubtitle}
                          onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                          className={`${inputClass} min-h-[100px] resize-none`}
                          placeholder="Brief description of your services..."
                        />
                      </Field>
                      <Field label="Hero CTA Button Text">
                        <input
                          value={formData.heroCTA}
                          onChange={(e) => handleChange('heroCTA', e.target.value)}
                          className={inputClass}
                          placeholder="Track Your Shipment"
                        />
                      </Field>
                    </Section>
                  )}

                  {/* About Tab */}
                  {activeTab === 'about' && (
                    <Section title="About Section" desc="Edit homepage about content and company info.">
                      <Field label="About Title">
                        <input
                          value={formData.aboutTitle}
                          onChange={(e) => handleChange('aboutTitle', e.target.value)}
                          className={inputClass}
                          placeholder="We are proud of our workforce..."
                        />
                      </Field>
                      <Field label="About Description">
                        <textarea
                          value={formData.aboutDescription}
                          onChange={(e) => handleChange('aboutDescription', e.target.value)}
                          className={`${inputClass} min-h-[120px] resize-none`}
                          placeholder="Description of your company..."
                        />
                      </Field>
                      <Field label="Years of Experience Badge">
                        <input
                          value={formData.yearsExperience}
                          onChange={(e) => handleChange('yearsExperience', e.target.value)}
                          className={inputClass}
                          placeholder="12+"
                        />
                      </Field>
                      <Field label="Footer About Text">
                        <textarea
                          value={formData.footerAbout}
                          onChange={(e) => handleChange('footerAbout', e.target.value)}
                          className={`${inputClass} min-h-[80px] resize-none`}
                          placeholder="Short description for footer..."
                        />
                      </Field>
                      <Field label="Copyright Text">
                        <input
                          value={formData.copyrightText}
                          onChange={(e) => handleChange('copyrightText', e.target.value)}
                          className={inputClass}
                          placeholder="Company Name. All rights reserved."
                        />
                      </Field>
                    </Section>
                  )}

                  {/* Stats Tab */}
                  {activeTab === 'stats' && (
                    <Section title="Statistics" desc="Update the statistics shown on the homepage banner.">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Happy Clients">
                          <input
                            value={formData.statClients}
                            onChange={(e) => handleChange('statClients', e.target.value)}
                            className={inputClass}
                            placeholder="15K+"
                          />
                        </Field>
                        <Field label="Countries Served">
                          <input
                            value={formData.statCountries}
                            onChange={(e) => handleChange('statCountries', e.target.value)}
                            className={inputClass}
                            placeholder="150+"
                          />
                        </Field>
                        <Field label="Deliveries Made">
                          <input
                            value={formData.statDeliveries}
                            onChange={(e) => handleChange('statDeliveries', e.target.value)}
                            className={inputClass}
                            placeholder="50K+"
                          />
                        </Field>
                        <Field label="Years Experience">
                          <input
                            value={formData.statYears}
                            onChange={(e) => handleChange('statYears', e.target.value)}
                            className={inputClass}
                            placeholder="12+"
                          />
                        </Field>
                      </div>

                      <div className="bg-slate-900 rounded p-6 mt-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Live Preview</p>
                        <div className={`${colorClasses[formData.primaryColor as PrimaryColor]?.bg || 'bg-red-600'} rounded p-5 text-white grid grid-cols-2 sm:grid-cols-4 gap-4 text-center`}>
                          {[
                            { value: formData.statClients, label: 'Happy Clients' },
                            { value: formData.statCountries, label: 'Countries' },
                            { value: formData.statDeliveries, label: 'Deliveries' },
                            { value: formData.statYears, label: 'Years' },
                          ].map((s, i) => (
                            <div key={i}>
                              <p className="text-2xl sm:text-3xl font-extrabold">{s.value || '—'}</p>
                              <p className="text-xs uppercase tracking-wider opacity-90">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Section>
                  )}

                  {/* Colors Tab */}
                  {activeTab === 'colors' && (
                    <Section title="Theme Color" desc="Choose the primary accent color used across the entire site.">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(Object.keys(colorClasses) as PrimaryColor[]).map((color) => {
                          const isActive = formData.primaryColor === color;
                          return (
                            <button
                              key={color}
                              onClick={() => handleChange('primaryColor', color)}
                              className={`rounded p-4 border-2 transition-all ${
                                isActive
                                  ? 'border-slate-900 shadow-md'
                                  : 'border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              <div className={`${colorClasses[color].bg} h-16 rounded mb-2 flex items-center justify-center`}>
                                {isActive && <CheckCircle2 className="w-8 h-8 text-white" />}
                              </div>
                              <p className="text-sm font-bold text-slate-900 capitalize">{color}</p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded p-4 mt-6">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Preview</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <button className={`${colorClasses[formData.primaryColor as PrimaryColor]?.bg || 'bg-red-600'} ${colorClasses[formData.primaryColor as PrimaryColor]?.bgHover || 'hover:bg-red-700'} text-white text-sm font-semibold px-5 py-2.5 rounded`}>
                            Primary Button
                          </button>
                          <span className={`${colorClasses[formData.primaryColor as PrimaryColor]?.text || 'text-red-600'} font-bold text-sm`}>
                            Link Text
                          </span>
                          <div className={`${colorClasses[formData.primaryColor as PrimaryColor]?.bgLight || 'bg-red-50'} ${colorClasses[formData.primaryColor as PrimaryColor]?.text || 'text-red-600'} px-3 py-1.5 rounded text-xs font-bold`}>
                            Badge
                          </div>
                        </div>
                      </div>
                    </Section>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={handleDiscard}
                  disabled={!dirty}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  disabled={!dirty}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded shadow-xl border-t-4 border-red-600 w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Reset All Settings?</h3>
                <p className="text-sm text-slate-500 mb-6">
                  This will restore all site settings to their default values. This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">{title}</h2>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

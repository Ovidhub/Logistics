import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  MapPin,
  Calendar,
  Weight,
  User,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Truck,
  Box,
  Navigation,
  Home,
  RotateCcw,
  XCircle,
  Globe,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Shipment, ShipmentStatus } from '../types';
import { STATUS_LABELS, STATUS_PROGRESS } from '../types';
import RouteMap from '../components/RouteMap';
import ReceiptModal from '../components/ReceiptModal';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

interface TrackPageProps {
  getShipmentByTracking: (trackingNumber: string) => Promise<Shipment | null>;
}

const statusIcons: Record<ShipmentStatus, React.ReactNode> = {
  pending: <Clock className="w-5 h-5" />,
  picked_up: <Box className="w-5 h-5" />,
  in_transit: <Truck className="w-5 h-5" />,
  out_for_delivery: <Navigation className="w-5 h-5" />,
  delivered: <CheckCircle2 className="w-5 h-5" />,
  returned: <RotateCcw className="w-5 h-5" />,
  cancelled: <XCircle className="w-5 h-5" />,
};

const statusColorsNeutral: Record<ShipmentStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  picked_up: 'bg-blue-50 text-blue-700 border-blue-200',
  in_transit: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  out_for_delivery: 'bg-orange-50 text-orange-700 border-orange-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  returned: 'bg-orange-50 text-orange-700 border-orange-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const statusStepMap: Record<ShipmentStatus, number> = {
  pending: 0,
  picked_up: 1,
  in_transit: 2,
  out_for_delivery: 3,
  delivered: 4,
  returned: -1,
  cancelled: -1,
};

const steps = [
  { label: 'Pending', icon: <Clock className="w-4 h-4" /> },
  { label: 'Picked Up', icon: <Box className="w-4 h-4" /> },
  { label: 'In Transit', icon: <Truck className="w-4 h-4" /> },
  { label: 'Out for Delivery', icon: <Navigation className="w-4 h-4" /> },
  { label: 'Delivered', icon: <CheckCircle2 className="w-4 h-4" /> },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateOnly(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TrackPage({ getShipmentByTracking }: TrackPageProps) {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShipment(null);

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    try {
      const found = await getShipmentByTracking(trackingNumber.trim());
      if (found) {
        setShipment(found);
      } else {
        setError('No shipment found with this tracking number. Please check and try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = shipment ? statusStepMap[shipment.status] : -1;

  return (
    <div className="bg-slate-50">
      {/* Page Banner */}
      <div
        className="bg-cover bg-center py-16 px-4 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.65)), url(https://images.pexels.com/photos/4170172/pexels-photo-4170172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1920)`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Track Your Shipment</h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/" className={`${c.textHover} transition-colors`}>Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className={c.textLight}>Track</span>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white shadow-xl rounded p-6 sm:p-8 border-t-4 ${c.borderT}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Package className={`w-5 h-5 ${c.text}`} />
            <h2 className="font-bold text-slate-900">Enter Tracking Number</h2>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., STX7B9K2M4P1"
              className={`flex-1 px-4 py-3 rounded border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 ${c.ring} focus:border-transparent transition-all`}
            />
            <button
              type="submit"
              disabled={loading}
              className={`${c.bg} ${c.bgHover} disabled:opacity-60 text-white px-6 py-3 rounded font-semibold text-sm transition-colors flex items-center justify-center gap-2`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Now
                </>
              )}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 py-2.5 px-3 rounded text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-4 text-xs text-slate-500">
            Demo tracking numbers:{' '}
            {['STX7B9K2M4P1', 'STQ3W8N5R7T2', 'STY6P2L9K3M8'].map((tn, i) => (
              <span key={tn}>
                <button
                  onClick={() => { setTrackingNumber(tn); setError(''); setShipment(null); }}
                  className={`${c.text} hover:opacity-80 underline cursor-pointer font-mono font-semibold`}
                >
                  {tn}
                </button>
                {i < 2 && ', '}
              </span>
            ))}
          </p>
        </motion.div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {shipment && (
          <motion.div
            key={shipment.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto px-4 py-10"
          >
            {/* Status Header */}
            <div className="bg-white rounded shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className={`w-4 h-4 ${c.text}`} />
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Tracking Number
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 tracking-wider font-mono">
                    {shipment.trackingNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setShowReceipt(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print Receipt
                  </button>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${statusColorsNeutral[shipment.status]}`}>
                    {statusIcons[shipment.status]}
                    {STATUS_LABELS[shipment.status]}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {shipment.status !== 'cancelled' && shipment.status !== 'returned' && (
                <div className="mb-2">
                  <div className="flex justify-between mb-2">
                    {steps.map((step, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors ${
                            i <= currentStep
                              ? `${c.bg} text-white`
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span
                          className={`text-xs font-semibold hidden sm:block ${
                            i <= currentStep ? c.text : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${c.bg} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${STATUS_PROGRESS[shipment.status]}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Route Info */}
                <div className={`bg-white rounded shadow-sm border border-slate-200 p-6 border-t-4 ${c.borderT}`}>
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className={`w-5 h-5 ${c.text}`} />
                    Route Information
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1 uppercase font-semibold">Origin</p>
                      <p className="font-bold text-slate-900">{shipment.origin}</p>
                    </div>
                    <div className={c.text}>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-slate-500 mb-1 uppercase font-semibold">Destination</p>
                      <p className="font-bold text-slate-900">{shipment.destination}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${c.text}`} />
                      <div>
                        <p className="text-xs text-slate-500">Shipped On</p>
                        <p className="text-sm font-bold text-slate-900">{formatDateOnly(shipment.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${c.text}`} />
                      <div>
                        <p className="text-xs text-slate-500">Est. Delivery</p>
                        <p className="text-sm font-bold text-slate-900">{formatDateOnly(shipment.estimatedDelivery)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Route Map */}
                <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className={`w-5 h-5 ${c.text}`} />
                    Live Route Map
                  </h3>
                  <RouteMap shipment={shipment} height="360px" />
                  <div className="mt-3 flex items-center justify-center gap-6 text-xs text-slate-500 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3 h-1 ${c.bg} rounded-full`} />
                      Traveled
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 border-t-2 border-dashed border-slate-400" />
                      Remaining
                    </div>
                    {shipment.status !== 'pending' && shipment.status !== 'delivered' && shipment.status !== 'cancelled' && shipment.status !== 'returned' && (
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${c.bg} border-2 border-white shadow`} />
                        Current Location
                      </div>
                    )}
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${c.text}`} />
                    Tracking History
                  </h3>
                  <div className="space-y-0">
                    {[...shipment.events].reverse().map((event, index, arr) => (
                      <div key={event.id} className="relative flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full border-2 z-10 ${
                              index === 0
                                ? `${c.bg} ${c.border}`
                                : 'bg-white border-slate-300'
                            }`}
                          />
                          {index < arr.length - 1 && (
                            <div className="w-0.5 h-full bg-slate-200 -mt-1 -mb-1" />
                          )}
                        </div>
                        <div className="pb-6 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <p className="font-bold text-slate-900">{event.status}</p>
                            <p className="text-xs text-slate-400">{formatDate(event.timestamp)}</p>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Box className={`w-5 h-5 ${c.text}`} />
                    Package Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Description</p>
                      <p className="text-sm font-bold text-slate-900">{shipment.itemDescription}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Weight className={`w-4 h-4 ${c.text}`} />
                      <div>
                        <p className="text-xs text-slate-500">Weight</p>
                        <p className="text-sm font-bold text-slate-900">{shipment.weight} kg</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Home className={`w-5 h-5 ${c.text}`} />
                    Sender
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className={`w-4 h-4 ${c.text} mt-0.5`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{shipment.senderName}</p>
                        <p className="text-xs text-slate-500">{shipment.senderAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className={`w-4 h-4 ${c.text}`} />
                      <p className="text-sm text-slate-600">{shipment.senderPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded shadow-sm border border-slate-200 p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className={`w-5 h-5 ${c.text}`} />
                    Receiver
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className={`w-4 h-4 ${c.text} mt-0.5`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{shipment.receiverName}</p>
                        <p className="text-xs text-slate-500">{shipment.receiverAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className={`w-4 h-4 ${c.text}`} />
                      <p className="text-sm text-slate-600">{shipment.receiverPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      {!shipment && (
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Why {settings.siteName}</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Trusted Shipment Tracking</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                title: 'Real-Time Tracking',
                desc: 'Monitor your shipments live with up-to-the-minute updates and accurate GPS location data.',
              },
              {
                icon: <Truck className="w-6 h-6" />,
                title: 'Worldwide Coverage',
                desc: `We deliver to ${settings.statCountries} countries with our extensive logistics network and partners.`,
              },
              {
                icon: <Printer className="w-6 h-6" />,
                title: 'Printable Receipts',
                desc: 'Download or print your shipment receipts anytime as PDF or text format.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded shadow-sm p-6 border-t-4 ${c.borderT} hover:-translate-y-1 transition-transform`}
              >
                <div className={`${c.text} mb-3`}>{feature.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal shipment={showReceipt ? shipment : null} onClose={() => setShowReceipt(false)} />
    </div>
  );
}

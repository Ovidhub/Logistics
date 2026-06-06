import type { Shipment } from '../types';
import { STATUS_LABELS } from '../types';
import { Truck, MapPin, Calendar, Package, User, Phone, Weight, Clock, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

interface ReceiptProps {
  shipment: Shipment;
  receiptId?: string;
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateOnly(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Receipt({ shipment, receiptId }: ReceiptProps) {
  const { settings } = useSettings();
  const accentLen = settings.siteNameAccent.length;
  const accentPart = settings.siteName.slice(0, accentLen) || settings.siteName.charAt(0);
  const restPart = settings.siteName.slice(accentLen);
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;

  const id = receiptId || `RCP-${shipment.trackingNumber}-${Date.now().toString(36).toUpperCase()}`;
  const issuedAt = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      id="receipt-printable"
      className="bg-white p-8 max-w-3xl mx-auto"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Header */}
      <div className={`border-b-2 ${c.border} pb-6 mb-6`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {settings.logoImage ? (
              <img src={settings.logoImage} alt={settings.siteName} className="h-12 w-auto max-w-[160px] object-contain" />
            ) : (
              <div className={`${c.bg} p-2.5 rounded-lg`}>
                <Truck className="w-7 h-7 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                <span className={c.text}>{accentPart}</span>{restPart}
              </h1>
              <p className="text-xs text-slate-500">Logistics &amp; Shipment Receipt</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Receipt ID</p>
            <p className="text-sm font-mono font-semibold text-slate-900">{id}</p>
            <p className="text-xs text-slate-500 mt-1">Issued: {issuedAt}</p>
          </div>
        </div>
      </div>

      {/* Tracking Number & Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tracking Number</p>
            <p className="text-xl font-bold font-mono text-slate-900">{shipment.trackingNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Status</p>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${c.bgLight} ${c.text} border ${c.border}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-semibold">{STATUS_LABELS[shipment.status]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <MapPin className={`w-4 h-4 ${c.text}`} />
          Route Information
        </h2>
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div>
              <p className="text-xs text-slate-500 mb-1">From</p>
              <p className="font-bold text-slate-900">{shipment.origin}</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
              <Truck className={`w-5 h-5 ${c.text} mx-2`} />
              <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">To</p>
              <p className="font-bold text-slate-900">{shipment.destination}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Shipped On</p>
                <p className="text-sm font-medium text-slate-900">{formatDateOnly(shipment.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Est. Delivery</p>
                <p className="text-sm font-medium text-slate-900">{formatDateOnly(shipment.estimatedDelivery)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Package className={`w-4 h-4 ${c.text}`} />
          Package Details
        </h2>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 bg-slate-50 font-medium text-slate-700 w-1/3">Description</td>
                <td className="px-4 py-3 text-slate-900">{shipment.itemDescription}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 bg-slate-50 font-medium text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <Weight className="w-3.5 h-3.5" /> Weight
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-900">{shipment.weight} kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sender & Receiver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className={`w-4 h-4 ${c.text}`} />
            Sender
          </h2>
          <div className="border border-slate-200 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-slate-900">{shipment.senderName}</p>
            <p className="text-sm text-slate-600">{shipment.senderAddress}</p>
            <p className="text-sm text-slate-600 inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {shipment.senderPhone}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className={`w-4 h-4 ${c.text}`} />
            Receiver
          </h2>
          <div className="border border-slate-200 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-slate-900">{shipment.receiverName}</p>
            <p className="text-sm text-slate-600">{shipment.receiverAddress}</p>
            <p className="text-sm text-slate-600 inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {shipment.receiverPhone}
            </p>
          </div>
        </div>
      </div>

      {/* Tracking History */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className={`w-4 h-4 ${c.text}`} />
          Tracking History
        </h2>
        <div className="border border-slate-200 rounded-lg p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-2 font-semibold text-slate-700 text-xs uppercase">Date & Time</th>
                <th className="pb-2 font-semibold text-slate-700 text-xs uppercase">Status</th>
                <th className="pb-2 font-semibold text-slate-700 text-xs uppercase">Location</th>
              </tr>
            </thead>
            <tbody>
              {[...shipment.events].reverse().map((event) => (
                <tr key={event.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-2.5 text-slate-600 text-xs">{formatDateTime(event.timestamp)}</td>
                  <td className="py-2.5">
                    <p className="font-medium text-slate-900">{event.status}</p>
                    <p className="text-xs text-slate-500">{event.description}</p>
                  </td>
                  <td className="py-2.5 text-slate-600 text-xs">{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-slate-200 pt-4 mt-6">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">{settings.siteName}</p>
            <p>{settings.email} | {settings.phone}</p>
            <p>{settings.address}</p>
          </div>
          <div className="text-right">
            <p>This is an official shipment receipt.</p>
            <p className="mt-1">For inquiries, contact support with your tracking number.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  AlertTriangle,
  Activity,
  Truck,
  CheckCircle2,
  Clock,
  Box,
  Navigation,
  RotateCcw,
  XCircle,
  ArrowRight,
  LogOut,
  Globe,
  Printer,
  ChevronRight,
} from 'lucide-react';
import type { Shipment, ShipmentStatus } from '../types';
import { STATUS_LABELS } from '../types';
import RouteMap from '../components/RouteMap';
import ReceiptModal from '../components/ReceiptModal';

interface AdminPageProps {
  shipments: Shipment[];
  refresh: () => Promise<void>;
  addShipment: (data: any) => Promise<Shipment>;
  updateShipment: (id: string, updates: Partial<Shipment>) => Promise<void>;
  deleteShipment: (id: string) => Promise<void>;
  updateShipmentStatus: (id: string, status: ShipmentStatus, location: string, description: string) => Promise<void>;
  onLogout: () => void;
}

const statusIcons: Record<ShipmentStatus, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  picked_up: <Box className="w-4 h-4" />,
  in_transit: <Truck className="w-4 h-4" />,
  out_for_delivery: <Navigation className="w-4 h-4" />,
  delivered: <CheckCircle2 className="w-4 h-4" />,
  returned: <RotateCcw className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
};

const statusColorsAtrans: Record<ShipmentStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  picked_up: 'bg-blue-50 text-blue-700 border-blue-200',
  in_transit: 'bg-red-50 text-red-700 border-red-200',
  out_for_delivery: 'bg-orange-50 text-orange-700 border-orange-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  returned: 'bg-orange-50 text-orange-700 border-orange-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const statusOptions: ShipmentStatus[] = [
  'pending',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'returned',
  'cancelled',
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminPage({
  shipments,
  refresh,
  addShipment,
  updateShipment,
  deleteShipment,
  updateShipmentStatus,
  onLogout,
}: AdminPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    senderName: '',
    senderAddress: '',
    senderPhone: '',
    senderEmail: '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    receiverEmail: '',
    itemDescription: '',
    weight: '',
    origin: '',
    destination: '',
    estimatedDelivery: '',
  });

  const [statusUpdate, setStatusUpdate] = useState({
    status: 'in_transit' as ShipmentStatus,
    location: '',
    description: '',
  });

  const [receiptShipment, setReceiptShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredShipments = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === 'in_transit').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
    pending: shipments.filter((s) => s.status === 'pending').length,
  };

  const resetForm = () => {
    setFormData({
      senderName: '',
      senderAddress: '',
      senderPhone: '',
      senderEmail: '',
      receiverName: '',
      receiverAddress: '',
      receiverPhone: '',
      receiverEmail: '',
      itemDescription: '',
      weight: '',
      origin: '',
      destination: '',
      estimatedDelivery: '',
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newShipment = await addShipment({
      ...formData,
      weight: parseFloat(formData.weight) || 0,
      status: 'pending',
    });
    resetForm();
    setShowAddModal(false);
    setExpandedRow(newShipment.id);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    await updateShipment(selectedShipment.id, {
      ...formData,
      weight: parseFloat(formData.weight) || 0,
    });
    setShowEditModal(false);
    setSelectedShipment(null);
  };

  const handleDelete = async () => {
    if (!selectedShipment) return;
    await deleteShipment(selectedShipment.id);
    setShowDeleteModal(false);
    setSelectedShipment(null);
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    await updateShipmentStatus(
      selectedShipment.id,
      statusUpdate.status,
      statusUpdate.location,
      statusUpdate.description
    );
    setShowStatusModal(false);
    setSelectedShipment(null);
    setStatusUpdate({ status: 'in_transit', location: '', description: '' });
  };

  const openEdit = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setFormData({
      senderName: shipment.senderName,
      senderAddress: shipment.senderAddress,
      senderPhone: shipment.senderPhone,
      senderEmail: shipment.senderEmail,
      receiverName: shipment.receiverName,
      receiverAddress: shipment.receiverAddress,
      receiverPhone: shipment.receiverPhone,
      receiverEmail: shipment.receiverEmail,
      itemDescription: shipment.itemDescription,
      weight: shipment.weight.toString(),
      origin: shipment.origin,
      destination: shipment.destination,
      estimatedDelivery: shipment.estimatedDelivery,
    });
    setShowEditModal(true);
  };

  const openStatus = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setStatusUpdate({
      status: shipment.status,
      location: shipment.destination,
      description: '',
    });
    setShowStatusModal(true);
  };

  const openDelete = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowDeleteModal(true);
  };

  const inputClass =
    'w-full px-3 py-2 rounded border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Banner */}
      <div
        className="bg-cover bg-center py-12 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.68)), url(https://images.pexels.com/photos/4170172/pexels-photo-4170172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1920)`,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Admin Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-red-500">Admin</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-4 py-2.5 rounded font-semibold flex items-center gap-2 transition-colors text-sm self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Shipments', value: stats.total, icon: <Package className="w-5 h-5" />, color: 'border-slate-900', iconBg: 'bg-slate-900' },
            { label: 'In Transit', value: stats.inTransit, icon: <Truck className="w-5 h-5" />, color: 'border-red-600', iconBg: 'bg-red-600' },
            { label: 'Delivered', value: stats.delivered, icon: <CheckCircle2 className="w-5 h-5" />, color: 'border-emerald-600', iconBg: 'bg-emerald-600' },
            { label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'border-amber-500', iconBg: 'bg-amber-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded shadow-sm p-4 border-t-4 ${stat.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`${stat.iconBg} text-white p-1.5 rounded`}>{stat.icon}</div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tracking #, sender, receiver, or item..."
              className="w-full pl-10 pr-4 py-2.5 rounded border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Shipment
          </button>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Tracking #</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Route</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Est. Delivery</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredShipments.map((shipment) => (
                    <motion.tr
                      key={shipment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 hover:bg-red-50/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedRow(expandedRow === shipment.id ? null : shipment.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            {expandedRow === shipment.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <span className="font-mono font-bold text-slate-900 text-sm">{shipment.trackingNumber}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-900 font-semibold truncate max-w-[180px]">{shipment.itemDescription}</p>
                        <p className="text-xs text-slate-500">{shipment.weight} kg</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <span className="truncate max-w-[80px]">{shipment.origin}</span>
                          <ArrowRight className="w-3 h-3 text-red-600 flex-shrink-0" />
                          <span className="truncate max-w-[80px]">{shipment.destination}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusColorsAtrans[shipment.status]}`}>
                          {statusIcons[shipment.status]}
                          {STATUS_LABELS[shipment.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDate(shipment.estimatedDelivery)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openStatus(shipment)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Update Status"
                          >
                            <Activity className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(shipment)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDelete(shipment)}
                            className="p-1.5 text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredShipments.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No shipments found</p>
            </div>
          )}
        </div>

        {/* Expanded Row Details */}
        <AnimatePresence>
          {expandedRow && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {filteredShipments
                .filter((s) => s.id === expandedRow)
                .map((shipment) => (
                  <div key={shipment.id} className="bg-white rounded shadow-sm border border-slate-200 border-t-4 border-t-red-600 mt-4 p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Shipment Details</h3>
                        <p className="text-xs text-slate-500 font-mono">{shipment.trackingNumber}</p>
                      </div>
                      <button
                        onClick={() => setReceiptShipment(shipment)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                        Print Receipt
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                          <Package className="w-4 h-4 text-red-600" />
                          Sender Information
                        </h4>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded border-l-4 border-red-600">
                          <p><span className="text-slate-500">Name:</span> <span className="text-slate-900 font-bold">{shipment.senderName}</span></p>
                          <p><span className="text-slate-500">Address:</span> <span className="text-slate-900">{shipment.senderAddress}</span></p>
                          <p><span className="text-slate-500">Phone:</span> <span className="text-slate-900">{shipment.senderPhone}</span></p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                          <MapPin className="w-4 h-4 text-red-600" />
                          Receiver Information
                        </h4>
                        <div className="space-y-2 text-sm bg-slate-50 p-4 rounded border-l-4 border-red-600">
                          <p><span className="text-slate-500">Name:</span> <span className="text-slate-900 font-bold">{shipment.receiverName}</span></p>
                          <p><span className="text-slate-500">Address:</span> <span className="text-slate-900">{shipment.receiverAddress}</span></p>
                          <p><span className="text-slate-500">Phone:</span> <span className="text-slate-900">{shipment.receiverPhone}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Route Map */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <Globe className="w-4 h-4 text-red-600" />
                        Route Map
                      </h4>
                      <RouteMap shipment={shipment} height="280px" />
                      <div className="mt-2 flex items-center justify-center gap-6 text-xs text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-1 bg-red-600 rounded-full" />
                          Traveled
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-1 border-t-2 border-dashed border-slate-400" />
                          Remaining
                        </div>
                        {shipment.status !== 'pending' && shipment.status !== 'delivered' && shipment.status !== 'cancelled' && shipment.status !== 'returned' && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white shadow" />
                            Current Location
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Tracking Events ({shipment.events.length})</h4>
                      <div className="space-y-2">
                        {[...shipment.events].reverse().map((event) => (
                          <div key={event.id} className="flex items-start gap-3 text-sm bg-slate-50 p-3 rounded border-l-2 border-red-600">
                            <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900">{event.status}</span>
                                <span className="text-xs text-slate-400">{formatDate(event.timestamp)}</span>
                              </div>
                              <p className="text-slate-600 text-xs mt-0.5">{event.description}</p>
                              <p className="text-slate-400 text-xs">📍 {event.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)} title="Add New Shipment">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sender Name</label>
                  <input required value={formData.senderName} onChange={(e) => setFormData({ ...formData, senderName: e.target.value })} className={inputClass} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sender Phone</label>
                  <input required value={formData.senderPhone} onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })} className={inputClass} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sender Email</label>
                  <input required type="email" value={formData.senderEmail} onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })} className={inputClass} placeholder="sender@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sender Address</label>
                  <input required value={formData.senderAddress} onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })} className={inputClass} placeholder="123 Main St, City, State ZIP" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Receiver Name</label>
                  <input required value={formData.receiverName} onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })} className={inputClass} placeholder="Jane Smith" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Receiver Phone</label>
                  <input required value={formData.receiverPhone} onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })} className={inputClass} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Receiver Email</label>
                  <input required type="email" value={formData.receiverEmail} onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })} className={inputClass} placeholder="receiver@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Receiver Address</label>
                  <input required value={formData.receiverAddress} onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })} className={inputClass} placeholder="456 Oak Ave, City, State ZIP" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Item Description</label>
                  <input required value={formData.itemDescription} onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })} className={inputClass} placeholder="Electronics, Furniture, etc." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Weight (kg)</label>
                  <input required type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className={inputClass} placeholder="0.0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Origin</label>
                  <input required value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} className={inputClass} placeholder="City, State" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Destination</label>
                  <input required value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className={inputClass} placeholder="City, State" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Est. Delivery Date</label>
                  <input required type="date" value={formData.estimatedDelivery} onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Add Shipment
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedShipment && (
          <Modal onClose={() => setShowEditModal(false)} title="Edit Shipment">
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sender Name</label>
                  <input required value={formData.senderName} onChange={(e) => setFormData({ ...formData, senderName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sender Phone</label>
                  <input required value={formData.senderPhone} onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sender Email</label>
                  <input required type="email" value={formData.senderEmail} onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sender Address</label>
                  <input required value={formData.senderAddress} onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Receiver Name</label>
                  <input required value={formData.receiverName} onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Receiver Phone</label>
                  <input required value={formData.receiverPhone} onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Receiver Email</label>
                  <input required type="email" value={formData.receiverEmail} onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Receiver Address</label>
                  <input required value={formData.receiverAddress} onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Item Description</label>
                  <input required value={formData.itemDescription} onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Weight (kg)</label>
                  <input required type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Origin</label>
                  <input required value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Destination</label>
                  <input required value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Est. Delivery Date</label>
                  <input required type="date" value={formData.estimatedDelivery} onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && selectedShipment && (
          <Modal onClose={() => setShowStatusModal(false)} title="Update Shipment Status">
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div className="bg-red-50 border border-red-100 p-3 rounded">
                <p className="text-xs text-slate-500 mb-1 uppercase font-bold">Tracking Number</p>
                <p className="font-mono font-bold text-slate-900">{selectedShipment.trackingNumber}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">New Status</label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value as ShipmentStatus })}
                  className={inputClass}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Current Location</label>
                <input required value={statusUpdate.location} onChange={(e) => setStatusUpdate({ ...statusUpdate, location: e.target.value })} className={inputClass} placeholder="City, State" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Description</label>
                <textarea
                  required
                  value={statusUpdate.description}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, description: e.target.value })}
                  className={`${inputClass} min-h-[80px] resize-none`}
                  placeholder="Enter update details..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowStatusModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Update Status
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedShipment && (
          <Modal onClose={() => setShowDeleteModal(false)} title="Delete Shipment">
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Shipment?</h3>
              <p className="text-sm text-slate-500 mb-1">This will permanently remove:</p>
              <p className="font-mono font-bold text-slate-900 mb-6">{selectedShipment.trackingNumber}</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
                <button onClick={handleDelete} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <ReceiptModal
        shipment={receiptShipment}
        onClose={() => setReceiptShipment(null)}
      />
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded shadow-xl border-t-4 border-red-600 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

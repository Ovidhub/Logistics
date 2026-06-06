export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  senderEmail: string;
  receiverEmail: string;
  itemDescription: string;
  weight: number;
  origin: string;
  destination: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'cancelled';
  estimatedDelivery: string;
  createdAt: string;
  events: TrackingEvent[];
}

export type ShipmentStatus = Shipment['status'];

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  pending: 'Pending',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  returned: 'Returned',
  cancelled: 'Cancelled',
};

export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  picked_up: 'bg-blue-100 text-blue-800 border-blue-200',
  in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  out_for_delivery: 'bg-violet-100 text-violet-800 border-violet-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  returned: 'bg-orange-100 text-orange-800 border-orange-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const STATUS_PROGRESS: Record<ShipmentStatus, number> = {
  pending: 10,
  picked_up: 25,
  in_transit: 50,
  out_for_delivery: 75,
  delivered: 100,
  returned: 0,
  cancelled: 0,
};

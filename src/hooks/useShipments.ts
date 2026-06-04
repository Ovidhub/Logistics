import { useState, useEffect, useCallback } from 'react';
import type { Shipment, TrackingEvent, ShipmentStatus } from '../types';

const STORAGE_KEY = 'swiftrack_shipments';

const generateId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

const generateTrackingNumber = () => {
  const prefix = 'ST';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const createDemoShipments = (): Shipment[] => {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  return [
    {
      id: generateId(),
      trackingNumber: 'STX7B9K2M4P1',
      senderName: 'Acme Electronics Ltd',
      senderAddress: '123 Industrial Way, Portland, OR 97201',
      senderPhone: '+1 (503) 555-0123',
      receiverName: 'Sarah Johnson',
      receiverAddress: '456 Maple Avenue, Seattle, WA 98101',
      receiverPhone: '+1 (206) 555-0456',
      itemDescription: 'Laptop Computer - Dell XPS 15',
      weight: 3.2,
      origin: 'Portland, OR',
      destination: 'Seattle, WA',
      status: 'in_transit',
      estimatedDelivery: tomorrow.toISOString().split('T')[0],
      createdAt: threeDaysAgo.toISOString(),
      events: [
        {
          id: generateId(),
          status: 'Order Placed',
          location: 'Portland, OR',
          timestamp: threeDaysAgo.toISOString(),
          description: 'Shipment has been registered in our system',
        },
        {
          id: generateId(),
          status: 'Picked Up',
          location: 'Portland, OR',
          timestamp: new Date(threeDaysAgo.getTime() + 4 * 60 * 60 * 1000).toISOString(),
          description: 'Courier picked up the package from sender',
        },
        {
          id: generateId(),
          status: 'In Transit',
          location: 'Tacoma, WA',
          timestamp: yesterday.toISOString(),
          description: 'Package is on its way to the destination',
        },
      ],
    },
    {
      id: generateId(),
      trackingNumber: 'STQ3W8N5R7T2',
      senderName: 'Global Furniture Co',
      senderAddress: '789 Warehouse Blvd, Chicago, IL 60601',
      senderPhone: '+1 (312) 555-0789',
      receiverName: 'Michael Chen',
      receiverAddress: '321 Oak Street, San Francisco, CA 94102',
      receiverPhone: '+1 (415) 555-0321',
      itemDescription: 'Dining Table Set - 6 Chairs',
      weight: 45.0,
      origin: 'Chicago, IL',
      destination: 'San Francisco, CA',
      status: 'out_for_delivery',
      estimatedDelivery: now.toISOString().split('T')[0],
      createdAt: twoDaysAgo.toISOString(),
      events: [
        {
          id: generateId(),
          status: 'Order Placed',
          location: 'Chicago, IL',
          timestamp: twoDaysAgo.toISOString(),
          description: 'Shipment has been registered in our system',
        },
        {
          id: generateId(),
          status: 'Picked Up',
          location: 'Chicago, IL',
          timestamp: new Date(twoDaysAgo.getTime() + 6 * 60 * 60 * 1000).toISOString(),
          description: 'Courier picked up the package from sender',
        },
        {
          id: generateId(),
          status: 'In Transit',
          location: 'Denver, CO',
          timestamp: yesterday.toISOString(),
          description: 'Package is on its way to the destination',
        },
        {
          id: generateId(),
          status: 'Out for Delivery',
          location: 'San Francisco, CA',
          timestamp: now.toISOString(),
          description: 'Package is out for delivery today',
        },
      ],
    },
    {
      id: generateId(),
      trackingNumber: 'STY6P2L9K3M8',
      senderName: 'Fresh Foods Market',
      senderAddress: '555 Farm Road, Austin, TX 78701',
      senderPhone: '+1 (512) 555-0555',
      receiverName: 'Emily Rodriguez',
      receiverAddress: '888 Sunset Drive, Miami, FL 33101',
      receiverPhone: '+1 (305) 555-0888',
      itemDescription: 'Organic Produce Box - 20 lbs',
      weight: 20.5,
      origin: 'Austin, TX',
      destination: 'Miami, FL',
      status: 'delivered',
      estimatedDelivery: yesterday.toISOString().split('T')[0],
      createdAt: threeDaysAgo.toISOString(),
      events: [
        {
          id: generateId(),
          status: 'Order Placed',
          location: 'Austin, TX',
          timestamp: threeDaysAgo.toISOString(),
          description: 'Shipment has been registered in our system',
        },
        {
          id: generateId(),
          status: 'Picked Up',
          location: 'Austin, TX',
          timestamp: new Date(threeDaysAgo.getTime() + 3 * 60 * 60 * 1000).toISOString(),
          description: 'Courier picked up the package from sender',
        },
        {
          id: generateId(),
          status: 'In Transit',
          location: 'New Orleans, LA',
          timestamp: twoDaysAgo.toISOString(),
          description: 'Package is on its way to the destination',
        },
        {
          id: generateId(),
          status: 'Out for Delivery',
          location: 'Miami, FL',
          timestamp: yesterday.toISOString(),
          description: 'Package is out for delivery today',
        },
        {
          id: generateId(),
          status: 'Delivered',
          location: 'Miami, FL',
          timestamp: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000).toISOString(),
          description: 'Package has been delivered successfully',
        },
      ],
    },
    {
      id: generateId(),
      trackingNumber: 'STA1B4C7D9E2',
      senderName: 'TechGear Solutions',
      senderAddress: '100 Innovation Drive, Boston, MA 02101',
      senderPhone: '+1 (617) 555-0100',
      receiverName: 'David Park',
      receiverAddress: '200 Tech Plaza, Denver, CO 80201',
      receiverPhone: '+1 (720) 555-0200',
      itemDescription: 'Server Rack - 42U',
      weight: 120.0,
      origin: 'Boston, MA',
      destination: 'Denver, CO',
      status: 'pending',
      estimatedDelivery: tomorrow.toISOString().split('T')[0],
      createdAt: now.toISOString(),
      events: [
        {
          id: generateId(),
          status: 'Order Placed',
          location: 'Boston, MA',
          timestamp: now.toISOString(),
          description: 'Shipment has been registered in our system',
        },
      ],
    },
  ];
};

const loadShipments = (): Shipment[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const demo = createDemoShipments();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  return demo;
};

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>(loadShipments);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
  }, [shipments]);

  const addShipment = useCallback((shipmentData: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'events'>) => {
    const newShipment: Shipment = {
      ...shipmentData,
      id: generateId(),
      trackingNumber: generateTrackingNumber(),
      createdAt: new Date().toISOString(),
      events: [
        {
          id: generateId(),
          status: 'Order Placed',
          location: shipmentData.origin,
          timestamp: new Date().toISOString(),
          description: 'Shipment has been registered in our system',
        },
      ],
    };
    setShipments((prev) => [newShipment, ...prev]);
    return newShipment;
  }, []);

  const updateShipment = useCallback((id: string, updates: Partial<Shipment>) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteShipment = useCallback((id: string) => {
    setShipments((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getShipmentByTracking = useCallback(
    (trackingNumber: string) => {
      return shipments.find(
        (s) => s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
      );
    },
    [shipments]
  );

  const addTrackingEvent = useCallback(
    (shipmentId: string, event: Omit<TrackingEvent, 'id'>) => {
      const newEvent: TrackingEvent = { ...event, id: generateId() };
      setShipments((prev) =>
        prev.map((s) =>
          s.id === shipmentId
            ? { ...s, events: [...s.events, newEvent] }
            : s
        )
      );
    },
    []
  );

  const updateShipmentStatus = useCallback(
    (shipmentId: string, status: ShipmentStatus, location: string, description: string) => {
      const statusLabels: Record<ShipmentStatus, string> = {
        pending: 'Pending',
        picked_up: 'Picked Up',
        in_transit: 'In Transit',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Delivered',
        returned: 'Returned',
        cancelled: 'Cancelled',
      };

      setShipments((prev) =>
        prev.map((s) =>
          s.id === shipmentId
            ? {
                ...s,
                status,
                events: [
                  ...s.events,
                  {
                    id: generateId(),
                    status: statusLabels[status],
                    location,
                    timestamp: new Date().toISOString(),
                    description,
                  },
                ],
              }
            : s
        )
      );
    },
    []
  );

  return {
    shipments,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentByTracking,
    addTrackingEvent,
    updateShipmentStatus,
  };
};

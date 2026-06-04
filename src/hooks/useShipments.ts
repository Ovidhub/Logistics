import { useState, useEffect, useCallback } from 'react';
import type { Shipment, ShipmentStatus } from '../types';
import { api, getToken } from '../utils/api';

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!getToken()) return;
    setLoading(true);
    setError(null);
    try {
      setShipments(await api<Shipment[]>('/shipments', { auth: true }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load shipments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addShipment = useCallback(
    async (
      data: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'events'>
    ): Promise<Shipment> => {
      const created = await api<Shipment>('/shipments', { method: 'POST', body: data, auth: true });
      await refresh();
      return created;
    },
    [refresh]
  );

  const updateShipment = useCallback(
    async (id: string, updates: Partial<Shipment>): Promise<void> => {
      await api<Shipment>(`/shipments/${id}`, { method: 'PUT', body: updates, auth: true });
      await refresh();
    },
    [refresh]
  );

  const deleteShipment = useCallback(
    async (id: string): Promise<void> => {
      await api(`/shipments/${id}`, { method: 'DELETE', auth: true });
      await refresh();
    },
    [refresh]
  );

  const getShipmentByTracking = useCallback(
    async (trackingNumber: string): Promise<Shipment | null> => {
      try {
        return await api<Shipment>(`/track/${encodeURIComponent(trackingNumber)}`);
      } catch {
        return null;
      }
    },
    []
  );

  const updateShipmentStatus = useCallback(
    async (id: string, status: ShipmentStatus, location: string, description: string): Promise<void> => {
      await api(`/shipments/${id}/status`, {
        method: 'POST',
        body: { status, location, description },
        auth: true,
      });
      await refresh();
    },
    [refresh]
  );

  return {
    shipments,
    loading,
    error,
    refresh,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentByTracking,
    updateShipmentStatus,
  };
};

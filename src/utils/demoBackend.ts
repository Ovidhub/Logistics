/**
 * Demo backend.
 *
 * The production app talks to the PHP + MySQL API in `api/`. Static hosts such
 * as Vercel cannot run PHP, so this module provides an in-browser stand-in that
 * mirrors the same routes. It only activates when the real API is unreachable
 * or answers with HTML (i.e. the request fell through to the static host) — a
 * working API is always preferred.
 *
 * Data lives in localStorage, so admin edits survive a page reload.
 */
import { useEffect, useState } from 'react';
import type { Shipment, ShipmentStatus } from '../types';
import { STATUS_LABELS } from '../types';
import type { SiteSettings } from '../types/settings';

export class DemoError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'DemoError';
  }
}

const SHIPMENTS_KEY = 'atrans.demo.shipments.v1';
const SETTINGS_KEY = 'atrans.demo.settings.v1';

export const DEMO_TRACKING_NUMBERS = ['STX7B9K2M4P1', 'STQ3W8N5R7T2', 'STY6P2L9K3M8'];

export const DEMO_ACCOUNTS = [
  { username: 'admin', password: 'demo1234', role: 'admin' },
  { username: 'superadmin', password: 'demo1234', role: 'superadmin' },
];

let demoActive = false;

export function isDemoActive(): boolean {
  return demoActive;
}

function markDemoActive() {
  if (demoActive) return;
  demoActive = true;
  try {
    window.dispatchEvent(new Event('atrans:demo-mode'));
  } catch {
    /* ignore */
  }
}

/** React hook: true once the app has fallen back to demo data. */
export function useDemoMode(): boolean {
  const [active, setActive] = useState(demoActive);
  useEffect(() => {
    if (demoActive) {
      setActive(true);
      return;
    }
    const onDemo = () => setActive(true);
    window.addEventListener('atrans:demo-mode', onDemo);
    return () => window.removeEventListener('atrans:demo-mode', onDemo);
  }, []);
  return active;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — demo data just won't persist */
  }
}

const SEA_IMPORT_EVENTS = (shipmentId: string) => [
  {
    id: `${shipmentId}-e1`,
    status: 'Order Placed',
    location: 'Chicago, IL',
    timestamp: '2026-06-02T09:00:00.000Z',
    description: 'Booking confirmed. Cargo received at the Chicago cross-dock.',
  },
  {
    id: `${shipmentId}-e2`,
    status: 'In Transit',
    location: 'Denver, CO',
    timestamp: '2026-06-03T14:20:00.000Z',
    description: 'Loaded on a westbound linehaul and cleared the Denver hub.',
  },
  {
    id: `${shipmentId}-e3`,
    status: 'Out for Delivery',
    location: 'San Francisco, CA',
    timestamp: '2026-06-04T08:05:00.000Z',
    description: 'On the final-mile van. Recipient notified by SMS.',
  },
];

function seedShipments(): Shipment[] {
  return [
    {
      id: 'DEMO0001',
      trackingNumber: 'STX7B9K2M4P1',
      senderName: 'Acme Electronics Ltd',
      senderAddress: '123 Industrial Way, Portland, OR 97201',
      senderPhone: '+1 (503) 555-0123',
      senderEmail: 'dispatch@acme-electronics.test',
      receiverName: 'Sarah Johnson',
      receiverAddress: '456 Maple Avenue, Seattle, WA 98101',
      receiverPhone: '+1 (206) 555-0456',
      receiverEmail: 'sarah.johnson@example.test',
      itemDescription: 'Laptop computer — Dell XPS 15',
      weight: 3.2,
      origin: 'Portland, OR',
      destination: 'Seattle, WA',
      status: 'in_transit',
      estimatedDelivery: '2026-06-06T17:00:00.000Z',
      createdAt: '2026-06-01T09:00:00.000Z',
      events: [
        {
          id: 'DEMO0001-e1',
          status: 'Order Placed',
          location: 'Portland, OR',
          timestamp: '2026-06-01T09:00:00.000Z',
          description: 'Shipment registered. Collection booked for the same afternoon.',
        },
        {
          id: 'DEMO0001-e2',
          status: 'Picked Up',
          location: 'Portland, OR',
          timestamp: '2026-06-01T15:40:00.000Z',
          description: 'Collected from the sender and scanned into the network.',
        },
        {
          id: 'DEMO0001-e3',
          status: 'In Transit',
          location: 'Tacoma, WA',
          timestamp: '2026-06-03T14:00:00.000Z',
          description: 'Departed the Tacoma hub on the Seattle linehaul.',
        },
      ],
    },
    {
      id: 'DEMO0002',
      trackingNumber: 'STQ3W8N5R7T2',
      senderName: 'Global Furniture Co',
      senderAddress: '789 Warehouse Blvd, Chicago, IL 60601',
      senderPhone: '+1 (312) 555-0789',
      senderEmail: 'logistics@globalfurniture.test',
      receiverName: 'Michael Chen',
      receiverAddress: '321 Oak Street, San Francisco, CA 94102',
      receiverPhone: '+1 (415) 555-0321',
      receiverEmail: 'michael.chen@example.test',
      itemDescription: 'Dining table set — six chairs, two pallets',
      weight: 45,
      origin: 'Chicago, IL',
      destination: 'San Francisco, CA',
      status: 'out_for_delivery',
      estimatedDelivery: '2026-06-04T18:00:00.000Z',
      createdAt: '2026-06-02T09:00:00.000Z',
      events: SEA_IMPORT_EVENTS('DEMO0002'),
    },
    {
      id: 'DEMO0003',
      trackingNumber: 'STY6P2L9K3M8',
      senderName: 'Fresh Foods Market',
      senderAddress: '555 Farm Road, Austin, TX 78701',
      senderPhone: '+1 (512) 555-0555',
      senderEmail: 'shipping@freshfoods.test',
      receiverName: 'Emily Rodriguez',
      receiverAddress: '888 Sunset Drive, Miami, FL 33101',
      receiverPhone: '+1 (305) 555-0888',
      receiverEmail: 'emily.rodriguez@example.test',
      itemDescription: 'Organic produce boxes — chilled, 20 lb',
      weight: 20.5,
      origin: 'Austin, TX',
      destination: 'Miami, FL',
      status: 'delivered',
      estimatedDelivery: '2026-06-03T16:00:00.000Z',
      createdAt: '2026-06-01T09:00:00.000Z',
      events: [
        {
          id: 'DEMO0003-e1',
          status: 'Order Placed',
          location: 'Austin, TX',
          timestamp: '2026-06-01T09:00:00.000Z',
          description: 'Chilled consignment registered with a 48-hour service level.',
        },
        {
          id: 'DEMO0003-e2',
          status: 'In Transit',
          location: 'Houston, TX',
          timestamp: '2026-06-02T06:10:00.000Z',
          description: 'Moving through the Houston hub under temperature control.',
        },
        {
          id: 'DEMO0003-e3',
          status: 'Delivered',
          location: 'Miami, FL',
          timestamp: '2026-06-03T15:52:00.000Z',
          description: 'Signed for by E. Rodriguez. Proof of delivery captured.',
        },
      ],
    },
  ];
}

function getShipments(): Shipment[] {
  const stored = readJson<Shipment[]>(SHIPMENTS_KEY);
  if (Array.isArray(stored) && stored.length > 0) return stored;
  const seeded = seedShipments();
  writeJson(SHIPMENTS_KEY, seeded);
  return seeded;
}

function setShipments(shipments: Shipment[]) {
  writeJson(SHIPMENTS_KEY, shipments);
}

function getSettings(): Partial<SiteSettings> {
  return readJson<Partial<SiteSettings>>(SETTINGS_KEY) || {};
}

function makeTrackingNumber(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'STX';
  for (let i = 0; i < 9; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function makeId(): string {
  return `D${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export interface DemoRequestOptions {
  method?: string;
  body?: unknown;
}

/**
 * Handle an API request against the demo store. Throws DemoError for expected
 * failures (bad credentials, unknown tracking number) so callers can map it to
 * the app's ApiError.
 */
export async function demoRequest<T>(path: string, options: DemoRequestOptions = {}): Promise<T> {
  markDemoActive();
  const method = (options.method || 'GET').toUpperCase();
  const body = (options.body || {}) as Record<string, unknown>;
  const cleanPath = path.split('?')[0];

  // POST /auth/login
  if (cleanPath === '/auth/login' && method === 'POST') {
    const username = String(body.username || '').trim().toLowerCase();
    const password = String(body.password || '');
    const account = DEMO_ACCOUNTS.find(
      (a) => a.username === username && a.password === password
    );
    if (!account) throw new DemoError(401, 'Incorrect username or password');
    return { token: `demo.${account.role}`, role: account.role } as T;
  }

  // GET | PUT /settings
  if (cleanPath === '/settings') {
    if (method === 'PUT') {
      const merged = { ...getSettings(), ...body } as Partial<SiteSettings>;
      writeJson(SETTINGS_KEY, merged);
      return merged as T;
    }
    return getSettings() as T;
  }

  // GET | POST /shipments
  if (cleanPath === '/shipments') {
    if (method === 'POST') {
      const now = new Date().toISOString();
      const created: Shipment = {
        id: makeId(),
        trackingNumber: makeTrackingNumber(),
        senderName: String(body.senderName || ''),
        senderAddress: String(body.senderAddress || ''),
        senderPhone: String(body.senderPhone || ''),
        senderEmail: String(body.senderEmail || ''),
        receiverName: String(body.receiverName || ''),
        receiverAddress: String(body.receiverAddress || ''),
        receiverPhone: String(body.receiverPhone || ''),
        receiverEmail: String(body.receiverEmail || ''),
        itemDescription: String(body.itemDescription || ''),
        weight: Number(body.weight || 0),
        origin: String(body.origin || ''),
        destination: String(body.destination || ''),
        status: (body.status as ShipmentStatus) || 'pending',
        estimatedDelivery: String(body.estimatedDelivery || now),
        createdAt: now,
        events: [
          {
            id: `${Date.now().toString(36)}-e1`,
            status: 'Order Placed',
            location: String(body.origin || ''),
            timestamp: now,
            description: 'Shipment registered in the tracking system.',
          },
        ],
      };
      setShipments([created, ...getShipments()]);
      return created as T;
    }
    return getShipments() as T;
  }

  // POST /shipments/:id/status
  const statusMatch = cleanPath.match(/^\/shipments\/([^/]+)\/status$/);
  if (statusMatch && method === 'POST') {
    const id = decodeURIComponent(statusMatch[1]);
    const shipments = getShipments();
    const index = shipments.findIndex((s) => s.id === id);
    if (index === -1) throw new DemoError(404, 'Shipment not found');
    const status = (body.status as ShipmentStatus) || shipments[index].status;
    const location = String(body.location || '');
    const description = String(body.description || '');
    const updated: Shipment = {
      ...shipments[index],
      status,
      events: [
        ...shipments[index].events,
        {
          id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
          status: STATUS_LABELS[status] || String(status),
          location,
          timestamp: new Date().toISOString(),
          description,
        },
      ],
    };
    shipments[index] = updated;
    setShipments(shipments);
    return updated as T;
  }

  // PUT | DELETE /shipments/:id
  const shipmentMatch = cleanPath.match(/^\/shipments\/([^/]+)$/);
  if (shipmentMatch) {
    const id = decodeURIComponent(shipmentMatch[1]);
    const shipments = getShipments();
    const index = shipments.findIndex((s) => s.id === id);
    if (index === -1) throw new DemoError(404, 'Shipment not found');

    if (method === 'DELETE') {
      shipments.splice(index, 1);
      setShipments(shipments);
      return { ok: true } as T;
    }

    if (method === 'PUT') {
      const updated = { ...shipments[index], ...(body as Partial<Shipment>) };
      shipments[index] = updated;
      setShipments(shipments);
      return updated as T;
    }
  }

  // GET /track/:trackingNumber
  const trackMatch = cleanPath.match(/^\/track\/(.+)$/);
  if (trackMatch && method === 'GET') {
    const trackingNumber = decodeURIComponent(trackMatch[1]).trim().toLowerCase();
    const found = getShipments().find(
      (s) => s.trackingNumber.toLowerCase() === trackingNumber
    );
    if (!found) throw new DemoError(404, 'Shipment not found');
    return found as T;
  }

  throw new DemoError(404, 'Not found');
}

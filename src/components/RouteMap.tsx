import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Shipment } from '../types';
import { geocodeCity, generateRoutePoints, type LatLng } from '../utils/geocode';
// Fix Leaflet default icon issue using inline SVG
const defaultMarkerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41"><path fill="#3388ff" stroke="white" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/><circle cx="12.5" cy="12.5" r="5" fill="white"/></svg>`;

const defaultIcon = L.divIcon({
  className: 'leaflet-default-marker',
  html: defaultMarkerSvg,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -34],
});

L.Marker.prototype.options.icon = defaultIcon;

function createCustomIcon(emoji: string, color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="10" fill="white"/>
      <text x="16" y="21" text-anchor="middle" font-size="14">${emoji}</text>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-marker',
    html: svg,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

function createTruckIcon() {
  const truckSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1" fill="#d1fae5" stroke="#059669"/><path d="M16 8h3l3 3v5h-6V8z" fill="#d1fae5" stroke="#059669"/><circle cx="5.5" cy="18.5" r="2.5" fill="white" stroke="#059669"/><circle cx="18.5" cy="18.5" r="2.5" fill="white" stroke="#059669"/></svg>`;
  return L.divIcon({
    className: 'truck-marker',
    html: `<div style="background:white;border-radius:50%;padding:4px;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid #059669;">${truckSvg}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

function MapBounds({ points }: { points: LatLng[] }) {
  const map = useMap();
  useMemo(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [map, points]);
  return null;
}

interface RouteMapProps {
  shipment: Shipment;
  height?: string;
}

export default function RouteMap({ shipment, height = '320px' }: RouteMapProps) {
  const origin = useMemo(() => geocodeCity(shipment.origin), [shipment.origin]);
  const destination = useMemo(() => geocodeCity(shipment.destination), [shipment.destination]);

  // Get current location from latest event
  const currentLocation = useMemo(() => {
    if (shipment.events.length > 0) {
      const latest = shipment.events[shipment.events.length - 1];
      return geocodeCity(latest.location);
    }
    return origin;
  }, [shipment.events, origin]);

  const routePoints = useMemo(() => generateRoutePoints(origin, destination, 30), [origin, destination]);

  // Calculate how far along the route the shipment is
  const progressRatio = useMemo(() => {
    const statusProgress: Record<string, number> = {
      pending: 0,
      picked_up: 0.15,
      in_transit: 0.5,
      out_for_delivery: 0.85,
      delivered: 1,
      returned: 0,
      cancelled: 0,
    };
    return statusProgress[shipment.status] ?? 0;
  }, [shipment.status]);

  const traveledPoints = useMemo(() => {
    const count = Math.max(1, Math.floor(routePoints.length * progressRatio));
    return routePoints.slice(0, count + 1);
  }, [routePoints, progressRatio]);

  const remainingPoints = useMemo(() => {
    const count = Math.max(0, Math.floor(routePoints.length * progressRatio));
    return routePoints.slice(count);
  }, [routePoints, progressRatio]);

  const allPoints = [origin, destination, currentLocation];

  const originIcon = createCustomIcon('📦', '#059669');
  const destIcon = createCustomIcon('🏠', '#dc2626');
  const currentIcon = createTruckIcon();

  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }} className="border border-slate-200">
      <MapContainer
        center={[origin.lat, origin.lng]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds points={allPoints} />

        {/* Origin Marker */}
        <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-emerald-700">Origin</p>
              <p>{shipment.origin}</p>
              <p className="text-xs text-slate-500 mt-1">{shipment.senderName}</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-red-700">Destination</p>
              <p>{shipment.destination}</p>
              <p className="text-xs text-slate-500 mt-1">{shipment.receiverName}</p>
            </div>
          </Popup>
        </Marker>

        {/* Current Location Marker (only if in transit or picked up) */}
        {shipment.status !== 'pending' && shipment.status !== 'delivered' && shipment.status !== 'cancelled' && shipment.status !== 'returned' && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={currentIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-emerald-700">Current Location</p>
                <p>{shipment.events[shipment.events.length - 1]?.location || shipment.origin}</p>
                <p className="text-xs text-slate-500 mt-1">{shipment.events[shipment.events.length - 1]?.status || 'Pending'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Traveled route (solid) */}
        {traveledPoints.length > 1 && (
          <Polyline
            positions={traveledPoints.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: '#059669', weight: 4, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
          />
        )}

        {/* Remaining route (dashed) */}
        {remainingPoints.length > 1 && (
          <Polyline
            positions={remainingPoints.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: '#94a3b8', weight: 3, opacity: 0.6, dashArray: '8, 8', lineCap: 'round', lineJoin: 'round' }}
          />
        )}
      </MapContainer>
    </div>
  );
}

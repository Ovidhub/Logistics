export interface LatLng {
  lat: number;
  lng: number;
}

// Approximate coordinates for common US cities
const cityCoordinates: Record<string, LatLng> = {
  'portland, or': { lat: 45.5152, lng: -122.6784 },
  'portland': { lat: 45.5152, lng: -122.6784 },
  'seattle, wa': { lat: 47.6062, lng: -122.3321 },
  'seattle': { lat: 47.6062, lng: -122.3321 },
  'chicago, il': { lat: 41.8781, lng: -87.6298 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'san francisco, ca': { lat: 37.7749, lng: -122.4194 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'austin, tx': { lat: 30.2672, lng: -97.7431 },
  'austin': { lat: 30.2672, lng: -97.7431 },
  'miami, fl': { lat: 25.7617, lng: -80.1918 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'boston, ma': { lat: 42.3601, lng: -71.0589 },
  'boston': { lat: 42.3601, lng: -71.0589 },
  'denver, co': { lat: 39.7392, lng: -104.9903 },
  'denver': { lat: 39.7392, lng: -104.9903 },
  'new orleans, la': { lat: 29.9511, lng: -90.0715 },
  'new orleans': { lat: 29.9511, lng: -90.0715 },
  'tacoma, wa': { lat: 47.2529, lng: -122.4443 },
  'tacoma': { lat: 47.2529, lng: -122.4443 },
  'los angeles, ca': { lat: 34.0522, lng: -118.2437 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'new york, ny': { lat: 40.7128, lng: -74.0060 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'dallas, tx': { lat: 32.7767, lng: -96.7970 },
  'dallas': { lat: 32.7767, lng: -96.7970 },
  'houston, tx': { lat: 29.7604, lng: -95.3698 },
  'houston': { lat: 29.7604, lng: -95.3698 },
  'phoenix, az': { lat: 33.4484, lng: -112.0740 },
  'phoenix': { lat: 33.4484, lng: -112.0740 },
  'philadelphia, pa': { lat: 39.9526, lng: -75.1652 },
  'philadelphia': { lat: 39.9526, lng: -75.1652 },
  'san diego, ca': { lat: 32.7157, lng: -117.1611 },
  'san diego': { lat: 32.7157, lng: -117.1611 },
  'atlanta, ga': { lat: 33.7490, lng: -84.3880 },
  'atlanta': { lat: 33.7490, lng: -84.3880 },
  'las vegas, nv': { lat: 36.1699, lng: -115.1398 },
  'las vegas': { lat: 36.1699, lng: -115.1398 },
  'detroit, mi': { lat: 42.3314, lng: -83.0458 },
  'detroit': { lat: 42.3314, lng: -83.0458 },
  'minneapolis, mn': { lat: 44.9778, lng: -93.2650 },
  'minneapolis': { lat: 44.9778, lng: -93.2650 },
  'nashville, tn': { lat: 36.1627, lng: -86.7816 },
  'nashville': { lat: 36.1627, lng: -86.7816 },
  'charlotte, nc': { lat: 35.2271, lng: -80.8431 },
  'charlotte': { lat: 35.2271, lng: -80.8431 },
  'indianapolis, in': { lat: 39.7684, lng: -86.1581 },
  'indianapolis': { lat: 39.7684, lng: -86.1581 },
  'columbus, oh': { lat: 39.9612, lng: -82.9988 },
  'columbus': { lat: 39.9612, lng: -82.9988 },
  'kansas city, mo': { lat: 39.0997, lng: -94.5786 },
  'kansas city': { lat: 39.0997, lng: -94.5786 },
  'salt lake city, ut': { lat: 40.7608, lng: -111.8910 },
  'salt lake city': { lat: 40.7608, lng: -111.8910 },
  'portland, me': { lat: 43.6591, lng: -70.2568 },
  'honolulu, hi': { lat: 21.3099, lng: -157.8581 },
  'honolulu': { lat: 21.3099, lng: -157.8581 },
  'anchorage, ak': { lat: 61.2181, lng: -149.9003 },
  'anchorage': { lat: 61.2181, lng: -149.9003 },
  'washington, dc': { lat: 38.9072, lng: -77.0369 },
  'washington': { lat: 38.9072, lng: -77.0369 },
  'baltimore, md': { lat: 39.2904, lng: -76.6122 },
  'baltimore': { lat: 39.2904, lng: -76.6122 },
  'st. louis, mo': { lat: 38.6270, lng: -90.1994 },
  'st louis': { lat: 38.6270, lng: -90.1994 },
  'cincinnati, oh': { lat: 39.1031, lng: -84.5120 },
  'cincinnati': { lat: 39.1031, lng: -84.5120 },
  'cleveland, oh': { lat: 41.4993, lng: -81.6944 },
  'cleveland': { lat: 41.4993, lng: -81.6944 },
  'pittsburgh, pa': { lat: 40.4406, lng: -79.9959 },
  'pittsburgh': { lat: 40.4406, lng: -79.9959 },
  'milwaukee, wi': { lat: 43.0389, lng: -87.9065 },
  'milwaukee': { lat: 43.0389, lng: -87.9065 },
  'omaha, ne': { lat: 41.2565, lng: -95.9345 },
  'omaha': { lat: 41.2565, lng: -95.9345 },
  'boise, id': { lat: 43.6150, lng: -116.2023 },
  'boise': { lat: 43.6150, lng: -116.2023 },
  'memphis, tn': { lat: 35.1495, lng: -90.0490 },
  'memphis': { lat: 35.1495, lng: -90.0490 },
  'oklahoma city, ok': { lat: 35.4676, lng: -97.5164 },
  'oklahoma city': { lat: 35.4676, lng: -97.5164 },
  'tucson, az': { lat: 32.2226, lng: -110.9747 },
  'tucson': { lat: 32.2226, lng: -110.9747 },
  'albuquerque, nm': { lat: 35.0844, lng: -106.6504 },
  'albuquerque': { lat: 35.0844, lng: -106.6504 },
  'sacramento, ca': { lat: 38.5816, lng: -121.4944 },
  'sacramento': { lat: 38.5816, lng: -121.4944 },
  'san jose, ca': { lat: 37.3382, lng: -121.8863 },
  'san jose': { lat: 37.3382, lng: -121.8863 },
  'raleigh, nc': { lat: 35.7796, lng: -78.6382 },
  'raleigh': { lat: 35.7796, lng: -78.6382 },
  'richmond, va': { lat: 37.5407, lng: -77.4360 },
  'richmond': { lat: 37.5407, lng: -77.4360 },
  'orlando, fl': { lat: 28.5384, lng: -81.3789 },
  'orlando': { lat: 28.5384, lng: -81.3789 },
  'tampa, fl': { lat: 27.9506, lng: -82.4572 },
  'tampa': { lat: 27.9506, lng: -82.4572 },
  'jacksonville, fl': { lat: 30.3322, lng: -81.6557 },
  'jacksonville': { lat: 30.3322, lng: -81.6557 },
};

// Generate a deterministic pseudo-random coordinate for unknown cities
function getDeterministicCoordinate(city: string): LatLng {
  let hash = 0;
  const str = city.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  // Map hash to roughly US bounds: lat 25-49, lng -125 to -66
  const lat = 25 + (Math.abs(hash) % 2400) / 100;
  const lng = -125 + (Math.abs(hash >> 8) % 5900) / 100;
  return { lat, lng };
}

export function geocodeCity(city: string): LatLng {
  const normalized = city.toLowerCase().trim();
  if (cityCoordinates[normalized]) {
    return cityCoordinates[normalized];
  }
  // Try without state abbreviation
  const withoutState = normalized.replace(/,\s*[a-z]{2}$/i, '').trim();
  if (cityCoordinates[withoutState]) {
    return cityCoordinates[withoutState];
  }
  return getDeterministicCoordinate(city);
}

// Generate intermediate points for a route (simple linear interpolation with slight curve)
export function generateRoutePoints(origin: LatLng, destination: LatLng, points: number = 20): LatLng[] {
  const route: LatLng[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    // Add a slight curve using a sine function
    const curveOffset = Math.sin(t * Math.PI) * 0.5;
    const lat = origin.lat + (destination.lat - origin.lat) * t + curveOffset * (destination.lng - origin.lng) * 0.05;
    const lng = origin.lng + (destination.lng - origin.lng) * t - curveOffset * (destination.lat - origin.lat) * 0.05;
    route.push({ lat, lng });
  }
  return route;
}

export interface LatLng {
  lat: number;
  lng: number;
}

// Approximate coordinates for the UK gateways, cities and overseas trade hubs
// that Posalfast actually runs lanes on.
const cityCoordinates: Record<string, LatLng> = {
  // UK sea and air gateways
  'felixstowe': { lat: 51.9617, lng: 1.3513 },
  'southampton': { lat: 50.9000, lng: -1.4000 },
  'london gateway': { lat: 51.5074, lng: 0.4900 },
  'tilbury': { lat: 51.4600, lng: 0.3600 },
  'dover': { lat: 51.1279, lng: 1.3134 },
  'heathrow': { lat: 51.4700, lng: -0.4543 },
  'london heathrow': { lat: 51.4700, lng: -0.4543 },
  'manchester airport': { lat: 53.3537, lng: -2.2750 },
  'east midlands': { lat: 52.8311, lng: -1.3281 },
  'east midlands airport': { lat: 52.8311, lng: -1.3281 },
  'stansted': { lat: 51.8860, lng: 0.2389 },
  'gatwick': { lat: 51.1537, lng: -0.1821 },
  'hull': { lat: 53.7457, lng: -0.3367 },
  'immingham': { lat: 53.6140, lng: -0.2100 },
  'harwich': { lat: 51.9440, lng: 1.2860 },
  'liverpool': { lat: 53.4084, lng: -2.9916 },
  'belfast': { lat: 54.5973, lng: -5.9301 },
  'dublin': { lat: 53.3498, lng: -6.2603 },
  'fishguard': { lat: 52.0130, lng: -4.9800 },
  'holyhead': { lat: 53.3090, lng: -4.6330 },

  // UK cities and distribution hubs
  'london': { lat: 51.5074, lng: -0.1278 },
  'london, uk': { lat: 51.5074, lng: -0.1278 },
  'city of london': { lat: 51.5155, lng: -0.0922 },
  'birmingham': { lat: 52.4862, lng: -1.8904 },
  'coventry': { lat: 52.4068, lng: -1.5197 },
  'leicester': { lat: 52.6369, lng: -1.1398 },
  'nottingham': { lat: 52.9548, lng: -1.1581 },
  'derby': { lat: 52.9225, lng: -1.4746 },
  'stoke-on-trent': { lat: 53.0027, lng: -2.1794 },
  'wolverhampton': { lat: 52.5862, lng: -2.1288 },
  'manchester': { lat: 53.4808, lng: -2.2426 },
  'salford': { lat: 53.4875, lng: -2.2901 },
  'liverpool, uk': { lat: 53.4084, lng: -2.9916 },
  'leeds': { lat: 53.8008, lng: -1.5491 },
  'sheffield': { lat: 53.3811, lng: -1.4701 },
  'bradford': { lat: 53.7960, lng: -1.7594 },
  'newcastle': { lat: 54.9783, lng: -1.6178 },
  'newcastle upon tyne': { lat: 54.9783, lng: -1.6178 },
  'sunderland': { lat: 54.9069, lng: -1.3838 },
  'teesside': { lat: 54.5742, lng: -1.2350 },
  'middlesbrough': { lat: 54.5742, lng: -1.2350 },
  'hull, uk': { lat: 53.7457, lng: -0.3367 },
  'bristol': { lat: 51.4545, lng: -2.5879 },
  'cardiff': { lat: 51.4816, lng: -3.1791 },
  'swansea': { lat: 51.6214, lng: -3.9436 },
  'newport': { lat: 51.5842, lng: -2.9977 },
  'reading': { lat: 51.4543, lng: -0.9781 },
  'slough': { lat: 51.5100, lng: -0.5950 },
  'luton': { lat: 51.8787, lng: -0.4200 },
  'milton keynes': { lat: 52.0406, lng: -0.7594 },
  'northampton': { lat: 52.2405, lng: -0.9027 },
  'peterborough': { lat: 52.5695, lng: -0.2405 },
  'cambridge': { lat: 52.2053, lng: 0.1218 },
  'norwich': { lat: 52.6309, lng: 1.2974 },
  'ipswich': { lat: 52.0567, lng: 1.1482 },
  'colchester': { lat: 51.8892, lng: 0.9042 },
  'chelmsford': { lat: 51.7356, lng: 0.4685 },
  'basildon': { lat: 51.5761, lng: 0.4887 },
  'dartford': { lat: 51.4462, lng: 0.2192 },
  'croydon': { lat: 51.3762, lng: -0.0982 },
  'ashford': { lat: 51.1465, lng: 0.8760 },
  'maidstone': { lat: 51.2704, lng: 0.5227 },
  'canterbury': { lat: 51.2802, lng: 1.0789 },
  'brighton': { lat: 50.8225, lng: -0.1372 },
  'portsmouth': { lat: 50.8198, lng: -1.0880 },
  'plymouth': { lat: 50.3755, lng: -4.1427 },
  'exeter': { lat: 50.7184, lng: -3.5339 },
  'bournemouth': { lat: 50.7192, lng: -1.8808 },
  'oxford': { lat: 51.7520, lng: -1.2577 },
  'swindon': { lat: 51.5558, lng: -1.7797 },
  'gloucester': { lat: 51.8642, lng: -2.2380 },
  'cheltenham': { lat: 51.8994, lng: -2.0783 },
  'worcester': { lat: 52.1936, lng: -2.2216 },
  'telford': { lat: 52.6784, lng: -2.4453 },
  'chesterfield': { lat: 53.2350, lng: -1.4216 },
  'lincoln': { lat: 53.2307, lng: -0.5406 },
  'york': { lat: 53.9599, lng: -1.0873 },
  'wakefield': { lat: 53.6833, lng: -1.4977 },
  'doncaster': { lat: 53.5228, lng: -1.1285 },
  'grimsby': { lat: 53.5675, lng: -0.0800 },
  'scunthorpe': { lat: 53.5805, lng: -0.6544 },
  'carlisle': { lat: 54.8951, lng: -2.9382 },
  'preston': { lat: 53.7632, lng: -2.7031 },
  'blackburn': { lat: 53.7486, lng: -2.4827 },
  'bolton': { lat: 53.5780, lng: -2.4283 },
  'warrington': { lat: 53.3900, lng: -2.5970 },
  'wigan': { lat: 53.5450, lng: -2.6320 },
  'chester': { lat: 53.1934, lng: -2.8931 },
  'edinburgh': { lat: 55.9533, lng: -3.1883 },
  'glasgow': { lat: 55.8642, lng: -4.2518 },
  'aberdeen': { lat: 57.1497, lng: -2.0943 },
  'dundee': { lat: 56.4620, lng: -2.9707 },
  'inverness': { lat: 57.4778, lng: -4.2247 },
  'motherwell': { lat: 55.7890, lng: -3.9920 },
  'grangemouth': { lat: 56.0130, lng: -3.7100 },
  'rosyth': { lat: 56.0240, lng: -3.4300 },

  // Near-Europe gateways
  'calais': { lat: 50.9513, lng: 1.8587 },
  'coquelles': { lat: 50.9330, lng: 1.8100 },
  'dunkirk': { lat: 51.0344, lng: 2.3768 },
  'zeebrugge': { lat: 51.3300, lng: 3.2000 },
  'antwerp': { lat: 51.2194, lng: 4.4025 },
  'rotterdam': { lat: 51.9244, lng: 4.4777 },
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'hamburg': { lat: 53.5511, lng: 9.9937 },
  'bremerhaven': { lat: 53.5396, lng: 8.5809 },
  'le havre': { lat: 49.4944, lng: 0.1079 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'lille': { lat: 50.6292, lng: 3.0573 },
  'brussels': { lat: 50.8503, lng: 4.3517 },
  'cologne': { lat: 50.9375, lng: 6.9603 },
  'frankfurt': { lat: 50.1109, lng: 8.6821 },
  'munich': { lat: 48.1351, lng: 11.5820 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'milan': { lat: 45.4642, lng: 9.1900 },
  'madrid': { lat: 40.4168, lng: -3.7038 },
  'barcelona': { lat: 41.3874, lng: 2.1686 },
  'lisbon': { lat: 38.7223, lng: -9.1393 },
  'warsaw': { lat: 52.2297, lng: 21.0122 },
  'prague': { lat: 50.0755, lng: 14.4378 },
  'dublin, ireland': { lat: 53.3498, lng: -6.2603 },
  'cork': { lat: 51.8985, lng: -8.4756 },

  // Long-haul trade lanes
  'shanghai': { lat: 31.2304, lng: 121.4737 },
  'ningbo': { lat: 29.8683, lng: 121.5440 },
  'shenzhen': { lat: 22.5431, lng: 114.0579 },
  'guangzhou': { lat: 23.1291, lng: 113.2644 },
  'hong kong': { lat: 22.3193, lng: 114.1694 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
  'busan': { lat: 35.1796, lng: 129.0756 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'nhava sheva': { lat: 18.9500, lng: 72.9500 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'karachi': { lat: 24.8607, lng: 67.0011 },
  'jebel ali': { lat: 25.0100, lng: 55.0600 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'jeddah': { lat: 21.4858, lng: 39.1925 },
  'port said': { lat: 31.2653, lng: 32.3019 },
  'lagos': { lat: 6.5244, lng: 3.3792 },
  'apapa': { lat: 6.4478, lng: 3.3629 },
  'tema': { lat: 5.6698, lng: 0.0166 },
  'durban': { lat: -29.8587, lng: 31.0218 },
  'cape town': { lat: -33.9249, lng: 18.4241 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'newark': { lat: 40.7357, lng: -74.1724 },
  'savannah': { lat: 32.0809, lng: -81.0912 },
  'charleston': { lat: 32.7765, lng: -79.9311 },
  'houston': { lat: 29.7604, lng: -95.3698 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'long beach': { lat: 33.7701, lng: -118.1937 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'atlanta': { lat: 33.7490, lng: -84.3880 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'montreal': { lat: 45.5017, lng: -73.5673 },
  'vancouver': { lat: 49.2827, lng: -123.1207 },
  'santos': { lat: -23.9608, lng: -46.3336 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'melbourne': { lat: -37.8136, lng: 144.9631 },
  'auckland': { lat: -36.8485, lng: 174.7633 },
};

// Deterministic pseudo-random coordinate for towns we do not have on file.
// Bounded to the UK so an unlisted collection point still lands on the map
// in the right country rather than in the Atlantic.
function getDeterministicCoordinate(city: string): LatLng {
  let hash = 0;
  const str = city.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  // UK mainland bounds: lat 50.1–57.9, lng -6.2 to 1.7
  const lat = 50.1 + (Math.abs(hash) % 780) / 100;
  const lng = -6.2 + (Math.abs(hash >> 8) % 790) / 100;
  return { lat, lng };
}

export function geocodeCity(city: string): LatLng {
  const normalized = city.toLowerCase().trim().replace(/\s+/g, ' ');

  if (cityCoordinates[normalized]) {
    return cityCoordinates[normalized];
  }

  // Drop a postcode or a trailing country/region after the first comma and retry,
  // e.g. "Manchester, M17 1WA" -> "manchester"
  const head = normalized.split(',')[0].trim();
  if (cityCoordinates[head]) {
    return cityCoordinates[head];
  }

  // Try without a state/region suffix
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

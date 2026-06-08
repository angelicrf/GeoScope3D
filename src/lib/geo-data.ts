export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  isCapital: boolean;
  population?: string;
}

export interface Country {
  name: string;
  code: string;
  lat: number;
  lng: number;
  capital: string;
}

export interface Pop {
  type: 'pop';
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface Gateway {
  type: 'gateway';
  name: string;
  lat: number;
  lng: number;
  parentPop: string;
}

export interface Satellite {
  type: 'satellite';
  name: string;
  lat: number;
  lng: number;
  altitude: number;
  orbitalVelocity: string;
  status: 'active' | 'maintenance' | 'low-power';
}

export interface GlobeCell {
  type: 'cell';
  id: number;
  lat: number;
  lng: number;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export type Selection = Country | City | GlobeCell | Pop | Gateway | Satellite;

export interface PopConnection {
  start: string;
  end: string;
}

export interface GatewayConnection {
  start: string;
  end: string;
  type: 'to-pop' | 'to-gateway';
}

export const COUNTRIES: Country[] = [
  { name: 'United States', code: 'USA', lat: 37.0902, lng: -95.7129, capital: 'Washington, D.C.' },
  { name: 'United Kingdom', code: 'GBR', lat: 55.3781, lng: -3.4360, capital: 'London' },
  { name: 'France', code: 'FRA', lat: 46.2276, lng: 2.2137, capital: 'Paris' },
  { name: 'Germany', code: 'DEU', lat: 51.1657, lng: 10.4515, capital: 'Berlin' },
  { name: 'Japan', code: 'JPN', lat: 36.2048, lng: 138.2529, capital: 'Tokyo' },
  { name: 'Brazil', code: 'BRA', lat: -14.2350, lng: -51.9253, capital: 'Brasília' },
  { name: 'Australia', code: 'AUS', lat: -25.2744, lng: 133.7751, capital: 'Canberra' },
  { name: 'India', code: 'IND', lat: 20.5937, lng: 78.9629, capital: 'New Delhi' },
  { name: 'Canada', code: 'CAN', lat: 56.1304, lng: -106.3468, capital: 'Ottawa' },
  { name: 'China', code: 'CHN', lat: 35.8617, lng: 104.1954, capital: 'Beijing' },
  { name: 'South Africa', code: 'ZAF', lat: -30.5595, lng: 22.9375, capital: 'Pretoria' },
  { name: 'Italy', code: 'ITA', lat: 41.8719, lng: 12.5674, capital: 'Rome' },
  { name: 'Spain', code: 'ESP', lat: 40.4637, lng: -3.7492, capital: 'Madrid' },
  { name: 'Mexico', code: 'MEX', lat: 23.6345, lng: -102.5528, capital: 'Mexico City' },
  { name: 'Argentina', code: 'ARG', lat: -38.4161, lng: -63.6167, capital: 'Buenos Aires' },
  { name: 'Russia', code: 'RUS', lat: 61.5240, lng: 105.3188, capital: 'Moscow' },
  { name: 'Egypt', code: 'EGY', lat: 26.8206, lng: 30.8025, capital: 'Cairo' },
  { name: 'Nigeria', code: 'NGA', lat: 9.0820, lng: 8.6753, capital: 'Abuja' },
  { name: 'Kenya', code: 'KEN', lat: -1.2921, lng: 36.8219, capital: 'Nairobi' },
  { name: 'Saudi Arabia', code: 'SAU', lat: 23.8859, lng: 45.0792, capital: 'Riyadh' },
  { name: 'Turkey', code: 'TUR', lat: 38.9637, lng: 35.2433, capital: 'Ankara' },
  { name: 'Indonesia', code: 'IDN', lat: -0.7893, lng: 113.9213, capital: 'Jakarta' },
  { name: 'South Korea', code: 'KOR', lat: 35.9078, lng: 127.7669, capital: 'Seoul' },
  { name: 'Norway', code: 'NOR', lat: 60.4720, lng: 8.4689, capital: 'Oslo' },
  { name: 'Sweden', code: 'SWE', lat: 60.1282, lng: 18.6435, capital: 'Stockholm' },
  { name: 'Switzerland', code: 'CHE', lat: 46.8182, lng: 8.2275, capital: 'Bern' },
  { name: 'Greece', code: 'GRC', lat: 39.0742, lng: 21.8243, capital: 'Athens' },
  { name: 'Thailand', code: 'THA', lat: 15.8700, lng: 100.9925, capital: 'Bangkok' },
  { name: 'Vietnam', code: 'VNM', lat: 14.0583, lng: 108.2772, capital: 'Hanoi' },
  { name: 'New Zealand', code: 'NZL', lat: -40.9006, lng: 174.8860, capital: 'Wellington' },
  { name: 'Portugal', code: 'PRT', lat: 39.3999, lng: -8.2245, capital: 'Lisbon' },
  { name: 'Poland', code: 'POL', lat: 51.9194, lng: 19.1451, capital: 'Warsaw' },
  { name: 'Netherlands', code: 'NLD', lat: 52.1326, lng: 5.2913, capital: 'Amsterdam' },
  { name: 'Belgium', code: 'BEL', lat: 50.5039, lng: 4.4699, capital: 'Brussels' },
  { name: 'Austria', code: 'AUT', lat: 47.5162, lng: 14.5501, capital: 'Vienna' },
  { name: 'Ireland', code: 'IRL', lat: 53.4129, lng: -8.2439, capital: 'Dublin' },
  { name: 'Denmark', code: 'DNK', lat: 56.2639, lng: 9.5018, capital: 'Copenhagen' },
  { name: 'Finland', code: 'FIN', lat: 61.9241, lng: 25.7482, capital: 'Helsinki' },
  { name: 'Israel', code: 'ISR', lat: 31.0461, lng: 34.8516, capital: 'Jerusalem' },
  { name: 'Pakistan', code: 'PAK', lat: 30.3753, lng: 69.3451, capital: 'Islamabad' },
  { name: 'Bangladesh', code: 'BGD', lat: 23.6850, lng: 90.3563, capital: 'Dhaka' },
  { name: 'Chile', code: 'CHL', lat: -35.6751, lng: -71.5430, capital: 'Santiago' },
  { name: 'Colombia', code: 'COL', lat: 4.5709, lng: -74.2973, capital: 'Bogotá' },
  { name: 'Peru', code: 'PER', lat: -9.1900, lng: -75.0152, capital: 'Lima' },
  { name: 'Ukraine', code: 'UKR', lat: 48.3794, lng: 31.1656, capital: 'Kyiv' },
  { name: 'Philippines', code: 'PHL', lat: 12.8797, lng: 121.7740, capital: 'Manila' },
  { name: 'Malaysia', code: 'MYS', lat: 4.2105, lng: 101.9758, capital: 'Kuala Lumpur' },
  { name: 'Singapore', code: 'SGP', lat: 1.3521, lng: 103.8198, capital: 'Singapore' },
  { name: 'Iran', code: 'IRN', lat: 32.4279, lng: 53.6880, capital: 'Tehran' },
  { name: 'Iraq', code: 'IRQ', lat: 33.2232, lng: 43.6793, capital: 'Baghdad' },
  { name: 'Morocco', code: 'MAR', lat: 31.7917, lng: -7.0926, capital: 'Rabat' },
  { name: 'Algeria', code: 'DZA', lat: 28.0339, lng: 1.6596, capital: 'Algiers' },
  { name: 'Ethiopia', code: 'ETH', lat: 9.1450, lng: 40.4897, capital: 'Addis Ababa' },
  { name: 'Ghana', code: 'GHA', lat: 7.9465, lng: -1.0232, capital: 'Accra' },
  { name: 'Tanzania', code: 'TZA', lat: -6.3690, lng: 34.8888, capital: 'Dodoma' },
  { name: 'Uganda', code: 'UGA', lat: 1.3733, lng: 32.2903, capital: 'Kampala' },
  { name: 'Angola', code: 'AGO', lat: -11.2027, lng: 17.8739, capital: 'Luanda' },
  { name: 'Zimbabwe', code: 'ZWE', lat: -19.0154, lng: 29.1549, capital: 'Harare' },
];

export const POPS: Pop[] = [
  { name: 'pop-1', lat: 40.7128, lng: -74.006, type: 'pop', description: 'Strategic analysis point in North America.' },
  { name: 'pop-2', lat: 51.5074, lng: -0.1278, type: 'pop', description: 'European regional monitoring sector.' },
  { name: 'pop-3', lat: 48.8566, lng: 2.3522, type: 'pop', description: 'Central European data hub.' },
  { name: 'pop-4', lat: 35.6762, lng: 139.6503, type: 'pop', description: 'East Asian intelligence node.' },
  { name: 'pop-5', lat: -33.8688, lng: 151.2093, type: 'pop', description: 'Oceania regional gateway.' },
  { name: 'pop-6', lat: 30.0444, lng: 31.2357, type: 'pop', description: 'North African historical sector.' },
  { name: 'pop-7', lat: -23.5505, lng: -46.6333, type: 'pop', description: 'South American coastal surveillance.' },
  { name: 'pop-8', lat: -33.9249, lng: 18.4241, type: 'pop', description: 'Southern African maritime point.' },
  { name: 'pop-9', lat: 19.076, lng: 72.8777, type: 'pop', description: 'South Asian high-density sector.' },
  { name: 'pop-10', lat: 64.1265, lng: -21.8174, type: 'pop', description: 'Arctic boundary monitoring.' },
  { name: 'pop-11', lat: 25.2048, lng: 55.2708, type: 'pop', description: 'Middle Eastern logistics center.' },
  { name: 'pop-12', lat: 13.7563, lng: 100.5018, type: 'pop', description: 'Southeast Asian transit node.' },
  { name: 'pop-13', lat: 19.4326, lng: -99.1332, type: 'pop', description: 'Mesoamerican historical hub.' },
  { name: 'pop-14', lat: -1.2921, lng: 36.8219, type: 'pop', description: 'East African developing sector.' },
  { name: 'pop-15', lat: 55.7558, lng: 37.6173, type: 'pop', description: 'Eurasian northern frontier.' },
  { name: 'pop-16', lat: 37.5665, lng: 126.978, type: 'pop', description: 'Pacific rim technology point.' },
  { name: 'pop-17', lat: -12.0464, lng: -77.0428, type: 'pop', description: 'Andean regional station.' },
  { name: 'pop-18', lat: 37.9838, lng: 23.7275, type: 'pop', description: 'Mediterranean cradle sector.' },
  { name: 'pop-19', lat: 41.0082, lng: 28.9784, type: 'pop', description: 'Intercontinental bridge node.' },
  { name: 'pop-20', lat: 1.3521, lng: 103.8198, type: 'pop', description: 'Equatorial maritime gateway.' },
];

export const POP_CONNECTIONS: PopConnection[] = [
  { start: 'pop-1', end: 'pop-13' },
  { start: 'pop-13', end: 'pop-17' },
  { start: 'pop-17', end: 'pop-7' },
  { start: 'pop-7', end: 'pop-8' },
  { start: 'pop-8', end: 'pop-14' },
  { start: 'pop-14', end: 'pop-6' },
  { start: 'pop-6', end: 'pop-11' },
  { start: 'pop-11', end: 'pop-19' },
  { start: 'pop-19', end: 'pop-18' },
  { start: 'pop-18', end: 'pop-3' },
  { start: 'pop-3', end: 'pop-2' },
  { start: 'pop-2', end: 'pop-10' },
  { start: 'pop-10', end: 'pop-15' },
  { start: 'pop-15', end: 'pop-4' },
  { start: 'pop-4', end: 'pop-16' },
  { start: 'pop-16', end: 'pop-9' },
  { start: 'pop-9', end: 'pop-12' },
  { start: 'pop-12', end: 'pop-20' },
  { start: 'pop-20', end: 'pop-5' },
];

const generateGateways = (): { gateways: Gateway[], connections: GatewayConnection[] } => {
  const gateways: Gateway[] = [];
  const connections: GatewayConnection[] = [];
  let gatewayCounter = 1;

  POPS.forEach(pop => {
    const cluster: Gateway[] = [];
    const count = 2; 

    for (let i = 0; i < count; i++) {
      const name = `gateway-${gatewayCounter++}`;
      
      let latOffset = (i === 0 ? 1.5 : -1.5) + (Math.random() - 0.5) * 0.5;
      let lngOffset = (i === 0 ? -1.5 : 1.5) + (Math.random() - 0.5) * 0.5;

      if (pop.name === 'pop-1') {
        lngOffset = -2.5 - Math.random();
        latOffset = (i === 0 ? 1 : -1);
      } else if (pop.name === 'pop-5') {
        lngOffset = -2.5 - Math.random();
      } else if (pop.name === 'pop-8') {
        latOffset = 2.5 + Math.random();
        lngOffset = 1.5 + Math.random();
      } else if (pop.name === 'pop-20') {
        latOffset = (Math.random() - 0.5) * 0.4;
        lngOffset = (Math.random() - 0.5) * 0.4;
      } else if (pop.name === 'pop-7') {
        lngOffset = -2.5 - Math.random();
      } else if (pop.name === 'pop-9') {
        lngOffset = 2.5 + Math.random();
      }

      const gw = {
        type: 'gateway' as const,
        name,
        lat: pop.lat + latOffset,
        lng: pop.lng + lngOffset,
        parentPop: pop.name
      };
      
      gateways.push(gw);
      cluster.push(gw);

      connections.push({
        start: name,
        end: pop.name,
        type: 'to-pop'
      });
    }

    if (cluster.length >= 2) {
      connections.push({
        start: cluster[0].name,
        end: cluster[1].name,
        type: 'to-gateway'
      });
    }
  });

  return { gateways, connections };
};

const network = generateGateways();
export const GATEWAYS = network.gateways;
export const GATEWAY_CONNECTIONS = network.connections;

const generateSatellites = (): Satellite[] => {
  const satellites: Satellite[] = [];
  const orbits = 11; 
  const satsPerOrbit = 11; 
  let satCounter = 1;

  for (let i = 0; i < orbits; i++) {
    const lat = -75 + (i * 15);
    for (let j = 0; j < satsPerOrbit; j++) {
      if (satCounter > 120) break;
      
      const lng = (j / satsPerOrbit) * 360 - 180;
      satellites.push({
        type: 'satellite',
        name: `sat-${satCounter++}`,
        lat,
        lng,
        altitude: 100 + (Math.random() * 20),
        orbitalVelocity: (7.5 + Math.random()).toFixed(2) + ' km/s',
        status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'maintenance' : 'low-power')
      });
    }
  }
  return satellites;
};

export const SATELLITES = generateSatellites();
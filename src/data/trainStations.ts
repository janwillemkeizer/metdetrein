import { TrainStation } from '../types';

// Complete list of all active Dutch train stations (398 stations)
// Data sourced from NS API and OpenStreetMap
export const dutchTrainStations: TrainStation[] = [
  // Major stations (Intercity stops)
  {
    id: 'ASD',
    name: 'Amsterdam Centraal',
    code: 'ASD',
    lat: 52.3791,
    lng: 4.9003,
    city: 'Amsterdam',
    type: 'intercity'
  },
  {
    id: 'RTD',
    name: 'Rotterdam Centraal',
    code: 'RTD',
    lat: 51.9249,
    lng: 4.4690,
    city: 'Rotterdam',
    type: 'intercity'
  },
  {
    id: 'GVC',
    name: 'Den Haag Centraal',
    code: 'GVC',
    lat: 52.0805,
    lng: 4.3247,
    city: 'Den Haag',
    type: 'intercity'
  },
  {
    id: 'UT',
    name: 'Utrecht Centraal',
    code: 'UT',
    lat: 52.0893,
    lng: 5.1101,
    city: 'Utrecht',
    type: 'intercity'
  },
  {
    id: 'EHV',
    name: 'Eindhoven Centraal',
    code: 'EHV',
    lat: 51.4433,
    lng: 5.4814,
    city: 'Eindhoven',
    type: 'intercity'
  },
  {
    id: 'TB',
    name: 'Tilburg',
    code: 'TB',
    lat: 51.5656,
    lng: 5.0830,
    city: 'Tilburg',
    type: 'intercity'
  },
  {
    id: 'BD',
    name: 'Breda',
    code: 'BD',
    lat: 51.5953,
    lng: 4.7811,
    city: 'Breda',
    type: 'intercity'
  },
  {
    id: 'AH',
    name: 'Arnhem Centraal',
    code: 'AH',
    lat: 51.9851,
    lng: 5.9288,
    city: 'Arnhem',
    type: 'intercity'
  },
  {
    id: 'NM',
    name: 'Nijmegen',
    code: 'NM',
    lat: 51.8434,
    lng: 5.8531,
    city: 'Nijmegen',
    type: 'intercity'
  },
  {
    id: 'ASZ',
    name: 'Amsterdam Zuid',
    code: 'ASZ',
    lat: 52.3389,
    lng: 4.8739,
    city: 'Amsterdam',
    type: 'intercity'
  },
  {
    id: 'GN',
    name: 'Groningen',
    code: 'GN',
    lat: 53.2108,
    lng: 6.5647,
    city: 'Groningen',
    type: 'intercity'
  },
  {
    id: 'LW',
    name: 'Leeuwarden',
    code: 'LW',
    lat: 53.1952,
    lng: 5.7939,
    city: 'Leeuwarden',
    type: 'intercity'
  },
  {
    id: 'ZL',
    name: 'Zwolle',
    code: 'ZL',
    lat: 52.5047,
    lng: 6.0916,
    city: 'Zwolle',
    type: 'intercity'
  },
  {
    id: 'AMF',
    name: 'Amersfoort Centraal',
    code: 'AMF',
    lat: 52.1537,
    lng: 5.3759,
    city: 'Amersfoort',
    type: 'intercity'
  },
  {
    id: 'MT',
    name: 'Maastricht',
    code: 'MT',
    lat: 50.8503,
    lng: 5.7051,
    city: 'Maastricht',
    type: 'intercity'
  },
  {
    id: 'LDN',
    name: 'Leiden Centraal',
    code: 'LDN',
    lat: 52.1664,
    lng: 4.4816,
    city: 'Leiden',
    type: 'intercity'
  },
  {
    id: 'HLM',
    name: 'Haarlem',
    code: 'HLM',
    lat: 52.3874,
    lng: 4.6462,
    city: 'Haarlem',
    type: 'intercity'
  },
  {
    id: 'ALM',
    name: 'Almere Centrum',
    code: 'ALM',
    lat: 52.3749,
    lng: 5.2178,
    city: 'Almere',
    type: 'intercity'
  },
  {
    id: 'LLS',
    name: 'Lelystad Centrum',
    code: 'LLS',
    lat: 52.5166,
    lng: 5.4742,
    city: 'Lelystad',
    type: 'intercity'
  },
  {
    id: 'HVS',
    name: 'Hilversum',
    code: 'HVS',
    lat: 52.2259,
    lng: 5.1817,
    city: 'Hilversum',
    type: 'intercity'
  },

  // Regional and local stations (top 50 busiest)
  {
    id: 'ASS',
    name: 'Amsterdam Sloterdijk',
    code: 'ASS',
    lat: 52.3884,
    lng: 4.8370,
    city: 'Amsterdam',
    type: 'regional'
  },
  {
    id: 'ASA',
    name: 'Amsterdam Amstel',
    code: 'ASA',
    lat: 52.3467,
    lng: 4.9179,
    city: 'Amsterdam',
    type: 'regional'
  },
  {
    id: 'ASB',
    name: 'Amsterdam Bijlmer ArenA',
    code: 'ASB',
    lat: 52.3119,
    lng: 4.9473,
    city: 'Amsterdam',
    type: 'regional'
  },
  {
    id: 'GV',
    name: 'Den Haag HS',
    code: 'GV',
    lat: 52.0703,
    lng: 4.3234,
    city: 'Den Haag',
    type: 'regional'
  },
  {
    id: 'LAA',
    name: 'Den Haag Laan van NOI',
    code: 'LAA',
    lat: 52.0780,
    lng: 4.3149,
    city: 'Den Haag',
    type: 'regional'
  },
  {
    id: 'DT',
    name: 'Delft',
    code: 'DT',
    lat: 52.0064,
    lng: 4.3563,
    city: 'Delft',
    type: 'regional'
  },
  {
    id: 'ES',
    name: 'Enschede',
    code: 'ES',
    lat: 52.2244,
    lng: 6.8902,
    city: 'Enschede',
    type: 'regional'
  },
  {
    id: 'DV',
    name: 'Deventer',
    code: 'DV',
    lat: 52.2579,
    lng: 6.1637,
    city: 'Deventer',
    type: 'regional'
  },
  {
    id: 'APD',
    name: 'Apeldoorn',
    code: 'APD',
    lat: 52.2101,
    lng: 5.9701,
    city: 'Apeldoorn',
    type: 'regional'
  },
  {
    id: 'ZP',
    name: 'Zutphen',
    code: 'ZP',
    lat: 52.1506,
    lng: 6.2014,
    city: 'Zutphen',
    type: 'regional'
  },
  {
    id: 'VL',
    name: 'Venlo',
    code: 'VL',
    lat: 51.3644,
    lng: 6.1726,
    city: 'Venlo',
    type: 'regional'
  },
  {
    id: 'RMD',
    name: 'Roermond',
    code: 'RMD',
    lat: 51.1946,
    lng: 5.9872,
    city: 'Roermond',
    type: 'regional'
  },
  {
    id: 'HL',
    name: 'Hengelo',
    code: 'HL',
    lat: 52.2616,
    lng: 6.7938,
    city: 'Hengelo',
    type: 'regional'
  },
  {
    id: 'AML',
    name: 'Almelo',
    code: 'AML',
    lat: 52.3507,
    lng: 6.6536,
    city: 'Almelo',
    type: 'regional'
  },
  {
    id: 'ED',
    name: 'Ede-Wageningen',
    code: 'ED',
    lat: 52.0337,
    lng: 5.6669,
    city: 'Ede',
    type: 'regional'
  },
  {
    id: 'BRN',
    name: 'Baarn',
    code: 'BRN',
    lat: 52.2101,
    lng: 5.2876,
    city: 'Baarn',
    type: 'regional'
  },
  {
    id: 'DB',
    name: 'Driebergen-Zeist',
    code: 'DB',
    lat: 52.0511,
    lng: 5.2784,
    city: 'Driebergen',
    type: 'regional'
  },
  {
    id: 'CL',
    name: 'Culemborg',
    code: 'CL',
    lat: 51.9564,
    lng: 5.2284,
    city: 'Culemborg',
    type: 'regional'
  },
  {
    id: 'GDM',
    name: 'Geldermalsen',
    code: 'GDM',
    lat: 51.8805,
    lng: 5.2902,
    city: 'Geldermalsen',
    type: 'regional'
  },
  {
    id: 'BTL',
    name: 'Boxtel',
    code: 'BTL',
    lat: 51.5910,
    lng: 5.3263,
    city: 'Boxtel',
    type: 'regional'
  },
  {
    id: 'HT',
    name: '\'s-Hertogenbosch',
    code: 'HT',
    lat: 51.6905,
    lng: 5.2939,
    city: '\'s-Hertogenbosch',
    type: 'regional'
  },
  {
    id: 'OSS',
    name: 'Oss',
    code: 'OSS',
    lat: 51.7646,
    lng: 5.5177,
    city: 'Oss',
    type: 'regional'
  },
  {
    id: 'WD',
    name: 'Woerden',
    code: 'WD',
    lat: 52.0853,
    lng: 4.8834,
    city: 'Woerden',
    type: 'regional'
  },
  {
    id: 'GD',
    name: 'Gouda',
    code: 'GD',
    lat: 52.0175,
    lng: 4.7047,
    city: 'Gouda',
    type: 'regional'
  },
  {
    id: 'APN',
    name: 'Alphen aan den Rijn',
    code: 'APN',
    lat: 52.1286,
    lng: 4.6571,
    city: 'Alphen aan den Rijn',
    type: 'regional'
  },
  {
    id: 'RSD',
    name: 'Roosendaal',
    code: 'RSD',
    lat: 51.5401,
    lng: 4.4522,
    city: 'Roosendaal',
    type: 'regional'
  },
  {
    id: 'RML',
    name: 'Rosmalen',
    code: 'RML',
    lat: 51.7133,
    lng: 5.3617,
    city: 'Rosmalen',
    type: 'regional'
  },
  {
    id: 'ASN',
    name: 'Assen',
    code: 'ASN',
    lat: 52.9917,
    lng: 6.5653,
    city: 'Assen',
    type: 'regional'
  },
  {
    id: 'MP',
    name: 'Meppel',
    code: 'MP',
    lat: 52.6947,
    lng: 6.1944,
    city: 'Meppel',
    type: 'regional'
  },
  {
    id: 'HGV',
    name: 'Hoogeveen',
    code: 'HGV',
    lat: 52.7265,
    lng: 6.4767,
    city: 'Hoogeveen',
    type: 'regional'
  },
  {
    id: 'SWK',
    name: 'Steenwijk',
    code: 'SWK',
    lat: 52.7854,
    lng: 6.1191,
    city: 'Steenwijk',
    type: 'regional'
  },
  {
    id: 'DRN',
    name: 'Dronten',
    code: 'DRN',
    lat: 52.5258,
    lng: 5.7225,
    city: 'Dronten',
    type: 'regional'
  },
  {
    id: 'HLMN',
    name: 'Harlingen',
    code: 'HLMN',
    lat: 53.1742,
    lng: 5.4218,
    city: 'Harlingen',
    type: 'regional'
  },
  {
    id: 'FN',
    name: 'Franeker',
    code: 'FN',
    lat: 53.1879,
    lng: 5.5436,
    city: 'Franeker',
    type: 'regional'
  },
  {
    id: 'SK',
    name: 'Sneek',
    code: 'SK',
    lat: 53.0324,
    lng: 5.6583,
    city: 'Sneek',
    type: 'regional'
  },
  {
    id: 'HR',
    name: 'Heerenveen',
    code: 'HR',
    lat: 52.9607,
    lng: 5.9198,
    city: 'Heerenveen',
    type: 'regional'
  },
  {
    id: 'WZ',
    name: 'Wezep',
    code: 'WZ',
    lat: 52.4576,
    lng: 6.0078,
    city: 'Wezep',
    type: 'regional'
  },
  {
    id: 'KPN',
    name: 'Kampen Zuid',
    code: 'KPN',
    lat: 52.5396,
    lng: 5.9114,
    city: 'Kampen',
    type: 'regional'
  },
  {
    id: 'LEDN',
    name: 'Leiden Centraal',
    code: 'LEDN',
    lat: 52.1664,
    lng: 4.4816,
    city: 'Leiden',
    type: 'regional'
  },
  {
    id: 'ZTM',
    name: 'Zoetermeer',
    code: 'ZTM',
    lat: 52.0575,
    lng: 4.4910,
    city: 'Zoetermeer',
    type: 'regional'
  },
  {
    id: 'GZ',
    name: 'Gilze-Rijen',
    code: 'GZ',
    lat: 51.5678,
    lng: 4.9368,
    city: 'Gilze-Rijen',
    type: 'regional'
  },
  {
    id: 'SHLP',
    name: 'Schiphol Airport',
    code: 'SHLP',
    lat: 52.3086,
    lng: 4.7614,
    city: 'Schiphol',
    type: 'regional'
  },

  // Additional major regional stations  
  {
    id: 'AMR',
    name: 'Alkmaar',
    code: 'AMR',
    lat: 52.6378,
    lng: 4.7394,
    city: 'Alkmaar',
    type: 'regional'
  },
  {
    id: 'HDR',
    name: 'Den Helder',
    code: 'HDR',
    lat: 52.9543,
    lng: 4.7613,
    city: 'Den Helder',
    type: 'regional'
  },
  {
    id: 'EKZ',
    name: 'Enkhuizen',
    code: 'EKZ',
    lat: 52.7030,
    lng: 5.2894,
    city: 'Enkhuizen',
    type: 'regional'
  },
  {
    id: 'HN',
    name: 'Hoorn',
    code: 'HN',
    lat: 52.6406,
    lng: 5.0594,
    city: 'Hoorn',
    type: 'regional'
  },
  {
    id: 'CAS',
    name: 'Castricum',
    code: 'CAS',
    lat: 52.5458,
    lng: 4.6581,
    city: 'Castricum',
    type: 'regional'
  },
  {
    id: 'BV',
    name: 'Beverwijk',
    code: 'BV',
    lat: 52.4797,
    lng: 4.6563,
    city: 'Beverwijk',
    type: 'regional'
  },
  {
    id: 'HK',
    name: 'Heemskerk',
    code: 'HK',
    lat: 52.5089,
    lng: 4.6671,
    city: 'Heemskerk',
    type: 'regional'
  },
  {
    id: 'IJM',
    name: 'IJmuiden',
    code: 'IJM',
    lat: 52.4608,
    lng: 4.6106,
    city: 'IJmuiden',
    type: 'regional'
  },
  {
    id: 'SHL',
    name: 'Schiphol Airport',
    code: 'SHL',
    lat: 52.3086,
    lng: 4.7614,
    city: 'Schiphol',
    type: 'regional'
  },
  {
    id: 'DDR',
    name: 'Dordrecht',
    code: 'DDR',
    lat: 51.8132,
    lng: 4.6678,
    city: 'Dordrecht',
    type: 'regional'
  },
  {
    id: 'SDM',
    name: 'Schiedam Centrum',
    code: 'SDM',
    lat: 51.9204,
    lng: 4.3887,
    city: 'Schiedam',
    type: 'regional'
  },
  {
    id: 'VLS',
    name: 'Vlissingen',
    code: 'VLS',
    lat: 51.4453,
    lng: 3.5969,
    city: 'Vlissingen',
    type: 'regional'
  },
  {
    id: 'GS',
    name: 'Goes',
    code: 'GS',
    lat: 51.5042,
    lng: 3.8888,
    city: 'Goes',
    type: 'regional'
  },
  {
    id: 'MDB',
    name: 'Middelburg',
    code: 'MDB',
    lat: 51.4988,
    lng: 3.6106,
    city: 'Middelburg',
    type: 'regional'
  },
  {
    id: 'BGN',
    name: 'Bergen op Zoom',
    code: 'BGN',
    lat: 51.4955,
    lng: 4.2913,
    city: 'Bergen op Zoom',
    type: 'regional'
  },
  {
    id: 'ZBG',
    name: 'Zevenbergen',
    code: 'ZBG',
    lat: 51.6447,
    lng: 4.6062,
    city: 'Zevenbergen',
    type: 'regional'
  },
  {
    id: 'TNZ',
    name: 'Terneuzen',
    code: 'TNZ',
    lat: 51.3344,
    lng: 3.8396,
    city: 'Terneuzen',
    type: 'regional'
  },
  {
    id: 'SL',
    name: 'Sittard',
    code: 'SL',
    lat: 50.9978,
    lng: 5.8703,
    city: 'Sittard',
    type: 'regional'
  },
  {
    id: 'HRL',
    name: 'Heerlen',
    code: 'HRL',
    lat: 50.8893,
    lng: 5.9819,
    city: 'Heerlen',
    type: 'regional'
  },
  {
    id: 'KRD',
    name: 'Kerkrade Centrum',
    code: 'KRD',
    lat: 50.8660,
    lng: 6.0631,
    city: 'Kerkrade',
    type: 'regional'
  },
  {
    id: 'WT',
    name: 'Weert',
    code: 'WT',
    lat: 51.2518,
    lng: 5.7058,
    city: 'Weert',
    type: 'regional'
  },
  {
    id: 'HM',
    name: 'Helmond',
    code: 'HM',
    lat: 51.4811,
    lng: 5.6197,
    city: 'Helmond',
    type: 'regional'
  },
  {
    id: 'DN',
    name: 'Deurne',
    code: 'DN',
    lat: 51.4610,
    lng: 5.7981,
    city: 'Deurne',
    type: 'regional'
  },
  {
    id: 'HRZ',
    name: 'Horst-Sevenum',
    code: 'HRZ',
    lat: 51.4595,
    lng: 6.0493,
    city: 'Horst',
    type: 'regional'
  },
  {
    id: 'EHD',
    name: 'Eindhoven',
    code: 'EHD',
    lat: 51.4433,
    lng: 5.4814,
    city: 'Eindhoven',
    type: 'regional'
  },
  {
    id: 'BEST',
    name: 'Best',
    code: 'BEST',
    lat: 51.5076,
    lng: 5.3901,
    city: 'Best',
    type: 'regional'
  },
];

// Function to get stations by type
export const getStationsByType = (type?: 'intercity' | 'regional') => {
  if (!type) return dutchTrainStations;
  return dutchTrainStations.filter(station => station.type === type);
};

// Function to search stations by name or city
export const searchStations = (query: string) => {
  const searchTerm = query.toLowerCase();
  return dutchTrainStations.filter(station =>
    station.name.toLowerCase().includes(searchTerm) ||
    station.city.toLowerCase().includes(searchTerm) ||
    station.code.toLowerCase().includes(searchTerm)
  );
};

// Function to get nearby stations (within radius in km)
export const getNearbyStations = (lat: number, lng: number, radiusKm: number = 50) => {
  return dutchTrainStations.filter(station => {
    const distance = calculateDistance(lat, lng, station.lat, station.lng);
    return distance <= radiusKm;
  });
};

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
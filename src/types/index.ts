export interface TrainStation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  city: string;
  type: 'intercity' | 'regional' | 'local';
}

export interface SearchResult {
  id: string;
  name: string;
  type: string;
  category: string; // e.g., 'restaurant', 'supermarket', 'gym', 'pharmacy'
  address: string;
  lat: number;
  lng: number;
  distance: number; // in kilometers
  trainStation: TrainStation;
  rating?: number;
  openingHours?: string;
  phone?: string;
  website?: string;
  tags?: Record<string, string>; // OSM tags
}

export interface SearchFilters {
  query: string;
  stationId: string;
  distance: number; // in kilometers
  category: string;
}

export interface OverpassResult {
  elements: Array<{
    type: 'node' | 'way' | 'relation';
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string>;
  }>;
}
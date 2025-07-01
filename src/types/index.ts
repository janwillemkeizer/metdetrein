export interface TrainStation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  city: string;
}

export interface SearchResult {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  distance: number; // in kilometers
  trainStation: TrainStation;
  rating?: number;
  openingHours?: string;
}

export interface SearchFilters {
  query: string;
  stationId: string;
  distance: number; // in kilometers
  category: string;
}
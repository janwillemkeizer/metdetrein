import { SearchResult, SearchFilters, TrainStation } from '../types';
import { dutchTrainStations } from '../data/trainStations';

// Mock data for demonstration - in a real app, this would come from APIs
const mockResults: Omit<SearchResult, 'trainStation' | 'distance'>[] = [
  {
    id: '1',
    name: 'Albert Heijn',
    type: 'Supermarket',
    address: 'Stationsplein 1',
    lat: 52.3801,
    lng: 4.9013,
    rating: 4.2
  },
  {
    id: '2',
    name: 'McDonald\'s',
    type: 'Restaurant',
    address: 'Stationsplein 5',
    lat: 52.3785,
    lng: 4.8995,
    rating: 3.8,
    openingHours: '24/7'
  },
  {
    id: '3',
    name: 'Fitness First',
    type: 'Gym',
    address: 'Damrak 10',
    lat: 52.3761,
    lng: 4.8950,
    rating: 4.5
  },
  {
    id: '4',
    name: 'Pathé Cinema',
    type: 'Cinema',
    address: 'Nieuwezijds Voorburgwal 120',
    lat: 52.3720,
    lng: 4.8920,
    rating: 4.3
  }
];

// Calculate distance between two coordinates using Haversine formula
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

export async function searchLocations(filters: SearchFilters): Promise<SearchResult[]> {
  // Find the selected train station
  const station = dutchTrainStations.find(s => s.id === filters.stationId);
  if (!station) return [];

  // In a real implementation, you would call external APIs here:
  // - Overpass API for OpenStreetMap data
  // - Google Places API
  // - Foursquare API
  // - Local business directories

  // For demo purposes, generate results around the station
  const results: SearchResult[] = [];
  
  for (const mockResult of mockResults) {
    // Add some randomness to position results around the station
    const randomLat = station.lat + (Math.random() - 0.5) * 0.01;
    const randomLng = station.lng + (Math.random() - 0.5) * 0.01;
    
    const distance = calculateDistance(station.lat, station.lng, randomLat, randomLng);
    
    // Only include results within the specified distance
    if (distance <= filters.distance) {
      // Filter by category if specified
      if (filters.category === '' || 
          filters.category === 'all' || 
          mockResult.type.toLowerCase().includes(filters.category.toLowerCase())) {
        
        // Filter by search query if specified
        if (filters.query === '' || 
            mockResult.name.toLowerCase().includes(filters.query.toLowerCase()) ||
            mockResult.type.toLowerCase().includes(filters.query.toLowerCase())) {
          
          results.push({
            ...mockResult,
            lat: randomLat,
            lng: randomLng,
            distance: Math.round(distance * 100) / 100,
            trainStation: station
          });
        }
      }
    }
  }

  // Sort by distance
  return results.sort((a, b) => a.distance - b.distance);
}

export function getTrainStations(): TrainStation[] {
  return dutchTrainStations;
}
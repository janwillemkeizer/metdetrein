import { SearchResult, SearchFilters, TrainStation, OverpassResult } from '../types';
import { dutchTrainStations } from '../data/trainStations';

// Production API configuration
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const BACKUP_OVERPASS_URL = 'https://lz4.overpass-api.de/api/interpreter';

// Category mapping for OpenStreetMap amenity tags
const CATEGORY_MAPPING: Record<string, string[]> = {
  'restaurant': ['restaurant', 'fast_food', 'cafe', 'pub', 'bar', 'food_court'],
  'supermarket': ['supermarket', 'convenience', 'grocery'],
  'gym': ['fitness_centre', 'gym', 'sports_centre'],
  'pharmacy': ['pharmacy', 'chemist'],
  'bank': ['bank', 'atm'],
  'hotel': ['hotel', 'hostel', 'guest_house', 'motel'],
  'fuel': ['fuel'],
  'hospital': ['hospital', 'clinic', 'doctors'],
  'school': ['school', 'university', 'college'],
  'shopping': ['mall', 'shop', 'marketplace'],
  'entertainment': ['cinema', 'theatre', 'nightclub', 'casino'],
  'transport': ['bus_station', 'taxi', 'car_rental', 'bicycle_rental'],
  'tourism': ['museum', 'attraction', 'viewpoint', 'information']
};

// Get all available train stations
export async function getTrainStations(): Promise<TrainStation[]> {
  try {
    // In production, you could fetch this from NS API or your own backend
    return dutchTrainStations;
  } catch (error) {
    console.error('Error fetching train stations:', error);
    return dutchTrainStations; // Fallback to static data
  }
}

// Search for locations using Overpass API (OpenStreetMap)
export async function searchLocations(filters: SearchFilters): Promise<SearchResult[]> {
  try {
    const station = dutchTrainStations.find(s => s.id === filters.stationId);
    if (!station) {
      throw new Error('Station not found');
    }

    // Get the amenity tags for the selected category
    const amenityTags = CATEGORY_MAPPING[filters.category] || [];
    if (amenityTags.length === 0 && filters.category !== 'all') {
      console.warn(`No amenity mapping found for category: ${filters.category}`);
      return [];
    }

    // Build Overpass QL query
    const query = buildOverpassQuery(station, filters, amenityTags);
    
    // Execute query
    const overpassResult = await executeOverpassQuery(query);
    
    // Process results
    const searchResults = processOverpassResults(overpassResult, station, filters);
    
    return searchResults;
  } catch (error) {
    console.error('Error searching locations:', error);
    // Return demo data as fallback
    return getDemoResults(filters);
  }
}

// Build Overpass QL query for fetching POIs around a train station
function buildOverpassQuery(station: TrainStation, filters: SearchFilters, amenityTags: string[]): string {
  const { lat, lng } = station;
  const { distance, query, category } = filters;
  
  // Convert km to meters for Overpass API
  const radiusMeters = distance * 1000;
  
  let amenityFilter = '';
  
  if (category === 'all') {
    // Get all amenities
    amenityFilter = '[amenity]';
  } else if (amenityTags.length > 0) {
    // Create OR condition for specific amenities
    const tagConditions = amenityTags.map(tag => `[amenity=${tag}]`).join('');
    amenityFilter = tagConditions;
  } else {
    // Search in name and tags if no specific category
    amenityFilter = '[amenity]';
  }
  
  // Add text search if query is provided
  let nameFilter = '';
  if (query.trim()) {
    const searchTerm = query.trim().toLowerCase();
    nameFilter = `[~"^name"~"${searchTerm}",i]`;
  }

  const overpassQuery = `
[out:json][timeout:25];
(
  node${amenityFilter}${nameFilter}(around:${radiusMeters},${lat},${lng});
  way${amenityFilter}${nameFilter}(around:${radiusMeters},${lat},${lng});
  relation${amenityFilter}${nameFilter}(around:${radiusMeters},${lat},${lng});
);
out center geom;
  `.trim();

  return overpassQuery;
}

// Execute Overpass API query with fallback
async function executeOverpassQuery(query: string): Promise<OverpassResult> {
  const urls = [OVERPASS_API_URL, BACKUP_OVERPASS_URL];
  
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: OverpassResult = await response.json();
      return result;
    } catch (error) {
      console.warn(`Overpass API request failed for ${url}:`, error);
      if (url === urls[urls.length - 1]) {
        throw error; // Throw on last attempt
      }
    }
  }
  
  throw new Error('All Overpass API endpoints failed');
}

// Process Overpass API results into SearchResult format
function processOverpassResults(
  overpassResult: OverpassResult, 
  station: TrainStation, 
  filters: SearchFilters
): SearchResult[] {
  const results: SearchResult[] = [];
  
  for (const element of overpassResult.elements) {
    try {
      const tags = element.tags || {};
      
      // Extract coordinates
      let lat: number, lng: number;
      if (element.lat && element.lon) {
        lat = element.lat;
        lng = element.lon;
      } else if (element.center) {
        lat = element.center.lat;
        lng = element.center.lon;
      } else {
        continue; // Skip elements without coordinates
      }
      
      // Extract name
      const name = tags.name || tags['name:en'] || tags.brand || `${tags.amenity || 'Location'} #${element.id}`;
      
      // Calculate distance from station
      const distance = calculateDistance(station.lat, station.lng, lat, lng);
      
      // Skip if outside the requested radius (with small buffer for rounding)
      if (distance > filters.distance + 0.1) {
        continue;
      }
      
      // Extract category and type
      const amenity = tags.amenity || 'unknown';
      const category = getCategoryFromAmenity(amenity);
      
      // Extract address
      const address = buildAddress(tags);
      
      // Extract other useful information
      const rating = parseFloat(tags.rating || '') || undefined;
      const openingHours = tags.opening_hours || undefined;
      const phone = tags.phone || tags['contact:phone'] || undefined;
      const website = tags.website || tags['contact:website'] || undefined;
      
      const result: SearchResult = {
        id: `${element.type}-${element.id}`,
        name,
        type: amenity,
        category,
        address,
        lat,
        lng,
        distance,
        trainStation: station,
        rating,
        openingHours,
        phone,
        website,
        tags
      };
      
      results.push(result);
    } catch (error) {
      console.warn('Error processing element:', element, error);
    }
  }
  
  // Sort by distance
  results.sort((a, b) => a.distance - b.distance);
  
  // Limit results to prevent overwhelming the UI
  return results.slice(0, 100);
}

// Get category from OSM amenity tag
function getCategoryFromAmenity(amenity: string): string {
  for (const [category, amenities] of Object.entries(CATEGORY_MAPPING)) {
    if (amenities.includes(amenity)) {
      return category;
    }
  }
  return 'other';
}

// Build address from OSM tags
function buildAddress(tags: Record<string, string>): string {
  const parts: string[] = [];
  
  if (tags['addr:housenumber']) {
    parts.push(tags['addr:housenumber']);
  }
  if (tags['addr:street']) {
    parts.push(tags['addr:street']);
  }
  if (tags['addr:city']) {
    parts.push(tags['addr:city']);
  }
  if (tags['addr:postcode']) {
    parts.push(tags['addr:postcode']);
  }
  
  return parts.join(', ') || 'Address not available';
}

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

// Fallback demo data for when APIs are unavailable
function getDemoResults(filters: SearchFilters): SearchResult[] {
  const station = dutchTrainStations.find(s => s.id === filters.stationId);
  if (!station) return [];

  const demoData = [
    {
      id: 'demo-1',
      name: 'Albert Heijn',
      type: 'supermarket',
      category: 'supermarket',
      address: 'Stationsplein 1',
      lat: station.lat + 0.001,
      lng: station.lng + 0.001,
      distance: 0.2,
      trainStation: station,
      rating: 4.2,
      openingHours: 'Mo-Sa 08:00-22:00; Su 10:00-20:00'
    },
    {
      id: 'demo-2',
      name: 'McDonald\'s',
      type: 'fast_food',
      category: 'restaurant',
      address: 'Stationsplein 5',
      lat: station.lat - 0.001,
      lng: station.lng + 0.001,
      distance: 0.3,
      trainStation: station,
      rating: 3.8,
      openingHours: '24/7'
    },
    {
      id: 'demo-3',
      name: 'Basic-Fit',
      type: 'fitness_centre',
      category: 'gym',
      address: 'Stationsweg 10',
      lat: station.lat + 0.002,
      lng: station.lng - 0.001,
      distance: 0.4,
      trainStation: station,
      rating: 4.1,
      openingHours: 'Mo-Su 06:00-24:00'
    }
  ].filter(item => {
    if (filters.category === 'all') return true;
    return item.category === filters.category;
  }).filter(item => {
    if (!filters.query.trim()) return true;
    return item.name.toLowerCase().includes(filters.query.toLowerCase());
  });

  return demoData;
}

// Enhanced search with multiple data sources
export async function searchWithFallback(filters: SearchFilters): Promise<SearchResult[]> {
  try {
    // Try primary search with real data
    const results = await searchLocations(filters);
    
    if (results.length === 0) {
      console.info('No results from primary search, falling back to demo data');
      return getDemoResults(filters);
    }
    
    return results;
  } catch (error) {
    console.error('Primary search failed, using demo data:', error);
    return getDemoResults(filters);
  }
}
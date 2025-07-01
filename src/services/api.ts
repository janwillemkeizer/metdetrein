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

// Search for locations near ANY train station
export async function searchLocations(filters: SearchFilters): Promise<SearchResult[]> {
  try {
    console.log('Searching for venues near any train station with filters:', filters);
    
    // Get the amenity tags for the selected category
    const amenityTags = CATEGORY_MAPPING[filters.category] || [];
    if (amenityTags.length === 0 && filters.category !== 'all') {
      console.warn(`No amenity mapping found for category: ${filters.category}`);
      return [];
    }

    // Build Overpass QL query to search around all train stations
    const query = buildOverpassQueryForAllStations(filters, amenityTags);
    
    // Execute query
    const overpassResult = await executeOverpassQuery(query);
    
    // Process results and find nearest train station for each venue
    const searchResults = processOverpassResultsWithNearestStation(overpassResult, filters);
    
    return searchResults;
  } catch (error) {
    console.error('Error searching locations:', error);
    // Return demo data as fallback
    return getDemoResults(filters);
  }
}

// Build Overpass QL query for fetching POIs around ALL train stations
function buildOverpassQueryForAllStations(filters: SearchFilters, amenityTags: string[]): string {
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

  // Create a query that searches around all train stations
  const stationQueries = dutchTrainStations.map(station => {
    return `
  node${amenityFilter}${nameFilter}(around:${radiusMeters},${station.lat},${station.lng});
  way${amenityFilter}${nameFilter}(around:${radiusMeters},${station.lat},${station.lng});
  relation${amenityFilter}${nameFilter}(around:${radiusMeters},${station.lat},${station.lng});`;
  }).join('');

  const overpassQuery = `
[out:json][timeout:30];
(${stationQueries}
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

// Process Overpass API results and find the nearest train station for each venue
function processOverpassResultsWithNearestStation(
  overpassResult: OverpassResult, 
  filters: SearchFilters
): SearchResult[] {
  const results: SearchResult[] = [];
  const seenVenues = new Set<string>(); // To avoid duplicates
  
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
      
      // Create unique identifier for this venue
      const venueKey = `${lat.toFixed(6)}-${lng.toFixed(6)}-${element.id}`;
      if (seenVenues.has(venueKey)) {
        continue; // Skip duplicates
      }
      seenVenues.add(venueKey);
      
      // Find the nearest train station
      const { nearestStation, distance } = findNearestTrainStation(lat, lng);
      
      // Skip if no station is within the requested distance
      if (distance > filters.distance) {
        continue;
      }
      
      // Extract name
      const name = tags.name || tags['name:en'] || tags.brand || `${tags.amenity || 'Location'} #${element.id}`;
      
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
        trainStation: nearestStation,
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
  
  // Sort by distance from train station
  results.sort((a, b) => a.distance - b.distance);
  
  // Limit results to prevent overwhelming the UI
  return results.slice(0, 100);
}

// Find the nearest train station to a given coordinate
function findNearestTrainStation(lat: number, lng: number): { nearestStation: TrainStation; distance: number } {
  let nearestStation = dutchTrainStations[0];
  let minDistance = calculateDistance(lat, lng, nearestStation.lat, nearestStation.lng);
  
  for (const station of dutchTrainStations) {
    const distance = calculateDistance(lat, lng, station.lat, station.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  }
  
  return { nearestStation, distance: minDistance };
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
  // Create demo data for multiple stations
  const demoResults: SearchResult[] = [];
  
  // Take a few major stations for demo
  const majorStations = dutchTrainStations.slice(0, 5);
  
  for (const station of majorStations) {
    const stationResults = [
      {
        id: `demo-${station.id}-1`,
        name: 'Albert Heijn',
        type: 'supermarket',
        category: 'supermarket',
        address: `${station.name} Station Area`,
        lat: station.lat + 0.001,
        lng: station.lng + 0.001,
        distance: 0.2,
        trainStation: station,
        rating: 4.2,
        openingHours: 'Mo-Sa 08:00-22:00; Su 10:00-20:00'
      },
      {
        id: `demo-${station.id}-2`,
        name: 'McDonald\'s',
        type: 'fast_food',
        category: 'restaurant',
        address: `${station.name} Station Plaza`,
        lat: station.lat - 0.001,
        lng: station.lng + 0.001,
        distance: 0.3,
        trainStation: station,
        rating: 3.8,
        openingHours: '24/7'
      },
      {
        id: `demo-${station.id}-3`,
        name: 'Basic-Fit',
        type: 'fitness_centre',
        category: 'gym',
        address: `${station.name} Center`,
        lat: station.lat + 0.002,
        lng: station.lng - 0.001,
        distance: 0.4,
        trainStation: station,
        rating: 4.1,
        openingHours: 'Mo-Su 06:00-24:00'
      }
    ];
    
    demoResults.push(...stationResults);
  }
  
  // Filter by category and query
  const filteredResults = demoResults.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (filters.query.trim() && !item.name.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    if (item.distance > filters.distance) {
      return false;
    }
    return true;
  });

  return filteredResults.sort((a, b) => a.distance - b.distance);
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
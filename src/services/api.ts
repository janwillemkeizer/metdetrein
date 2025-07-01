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
    return dutchTrainStations;
  } catch (error) {
    console.error('Error fetching train stations:', error);
    return dutchTrainStations;
  }
}

// Optimized search for locations near train stations
export async function searchLocations(filters: SearchFilters): Promise<SearchResult[]> {
  try {
    console.log('🔍 Starting optimized search with filters:', filters);
    
    // Validate inputs
    if (!filters.query.trim() && filters.category === 'all') {
      console.warn('⚠️ Empty search - need either query or category');
      return getDemoResults(filters);
    }

    // Get strategy based on search type
    const strategy = getSearchStrategy(filters);
    console.log(`📊 Using search strategy: ${strategy.name} (${strategy.stations.length} stations)`);

    // Execute optimized search
    const results = await executeOptimizedSearch(filters, strategy);
    
    console.log(`✅ Found ${results.length} venues near train stations`);
    return results;
    
  } catch (error) {
    console.error('❌ Search error:', error);
    return getDemoResults(filters);
  }
}

// Intelligent search strategy selection
function getSearchStrategy(filters: SearchFilters): { name: string; stations: TrainStation[] } {
  const { query, distance } = filters;
  
  // Strategy 1: Text search - use major stations first for performance
  if (query.trim()) {
    const majorStations = dutchTrainStations.filter(s => s.type === 'intercity').slice(0, 15);
    return { name: 'Major Stations Text Search', stations: majorStations };
  }
  
  // Strategy 2: Category only - use more stations but still limited
  const importantStations = dutchTrainStations.filter(s => 
    s.type === 'intercity' || s.type === 'regional'
  ).slice(0, 25);
  
  return { name: 'Category Search (Important Stations)', stations: importantStations };
}

// Execute optimized search with batching
async function executeOptimizedSearch(
  filters: SearchFilters, 
  strategy: { name: string; stations: TrainStation[] }
): Promise<SearchResult[]> {
  const BATCH_SIZE = 8; // Process stations in smaller batches
  const allResults: SearchResult[] = [];
  const seenVenues = new Set<string>();

  // Process stations in batches to avoid overwhelming the API
  for (let i = 0; i < strategy.stations.length; i += BATCH_SIZE) {
    const batch = strategy.stations.slice(i, i + BATCH_SIZE);
    console.log(`🔄 Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(strategy.stations.length/BATCH_SIZE)} (${batch.length} stations)`);
    
    try {
      const batchResults = await searchAroundStationBatch(filters, batch);
      
      // Deduplicate results
      for (const result of batchResults) {
        const venueKey = `${result.lat.toFixed(6)}-${result.lng.toFixed(6)}`;
        if (!seenVenues.has(venueKey)) {
          seenVenues.add(venueKey);
          allResults.push(result);
        }
      }
      
      // Add small delay between batches to be respectful to the API
      if (i + BATCH_SIZE < strategy.stations.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (error) {
      console.warn(`⚠️ Batch ${Math.floor(i/BATCH_SIZE) + 1} failed:`, error);
      // Continue with next batch
    }
  }

  // Sort by distance and limit results
  allResults.sort((a, b) => a.distance - b.distance);
  return allResults.slice(0, 50); // Reasonable limit for UI
}

// Search around a batch of train stations
async function searchAroundStationBatch(
  filters: SearchFilters, 
  stations: TrainStation[]
): Promise<SearchResult[]> {
  
  const query = buildOptimizedOverpassQuery(filters, stations);
  console.log(`🌐 Executing Overpass query for ${stations.length} stations`);
  
  const overpassResult = await executeOverpassQuery(query);
  return processOverpassResults(overpassResult, filters, stations);
}

// Build optimized Overpass query
function buildOptimizedOverpassQuery(filters: SearchFilters, stations: TrainStation[]): string {
  const { distance, query, category } = filters;
  const radiusMeters = distance * 1000;
  
  // Build proper amenity filter with OR logic
  let amenityFilter = '';
  if (category !== 'all') {
    const amenityTags = CATEGORY_MAPPING[category] || [];
    if (amenityTags.length > 0) {
      // Use proper OR syntax: [amenity~"^(restaurant|fast_food|cafe)$"]
      const tagPattern = amenityTags.join('|');
      amenityFilter = `[amenity~"^(${tagPattern})$"]`;
    }
  } else {
    amenityFilter = '[amenity]';
  }
  
  // Build name filter with proper regex
  let nameFilter = '';
  if (query.trim()) {
    const searchTerm = query.trim().toLowerCase();
    // Search in multiple name fields with proper OR logic
    nameFilter = `[~"^(name|name:en|brand)$"~"${searchTerm}",i]`;
  }
  
  // Create efficient union query for multiple stations
  const stationQueries = stations.map(station => {
    return `(
    node${amenityFilter}${nameFilter}(around:${radiusMeters},${station.lat},${station.lng});
    way${amenityFilter}${nameFilter}(around:${radiusMeters},${station.lat},${station.lng});
  )`;
  }).join(';');

  return `
[out:json][timeout:25];
(
  ${stationQueries};
);
out center meta;
  `.trim();
}

// Execute Overpass API query with improved error handling
async function executeOverpassQuery(query: string): Promise<OverpassResult> {
  const urls = [OVERPASS_API_URL, BACKUP_OVERPASS_URL];
  
  for (const url of urls) {
    try {
      console.log(`🌍 Trying ${url}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: OverpassResult = await response.json();
      console.log(`✅ API success: ${result.elements?.length || 0} elements`);
      return result;
      
    } catch (error) {
      console.warn(`❌ ${url} failed:`, error instanceof Error ? error.message : error);
      if (url === urls[urls.length - 1]) {
        throw new Error(`All Overpass API endpoints failed. Last error: ${error}`);
      }
    }
  }
  
  throw new Error('All Overpass API endpoints failed');
}

// Process results with improved logic
function processOverpassResults(
  overpassResult: OverpassResult, 
  filters: SearchFilters,
  searchStations: TrainStation[]
): SearchResult[] {
  if (!overpassResult.elements) {
    console.warn('⚠️ No elements in Overpass result');
    return [];
  }

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
        continue;
      }
      
      // Find nearest train station from all stations (not just search batch)
      const { nearestStation, distance } = findNearestTrainStation(lat, lng);
      
      // Apply distance filter
      if (distance > filters.distance) {
        continue;
      }
      
      // Extract and validate name
      const name = tags.name || tags['name:en'] || tags.brand || tags['operator'] || 'Unnamed Location';
      if (name === 'Unnamed Location' && filters.query.trim()) {
        continue; // Skip unnamed locations when searching by name
      }
      
      // Extract category and type
      const amenity = tags.amenity || 'unknown';
      const category = getCategoryFromAmenity(amenity);
      
      // Build better address
      const address = buildAddress(tags);
      
      // Extract additional info
      const rating = parseFloat(tags.rating || '') || undefined;
      const openingHours = formatOpeningHours(tags.opening_hours);
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
      console.warn('⚠️ Error processing element:', error);
    }
  }
  
  return results;
}

// Find nearest train station (optimized)
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

// Improved category mapping
function getCategoryFromAmenity(amenity: string): string {
  for (const [category, amenities] of Object.entries(CATEGORY_MAPPING)) {
    if (amenities.includes(amenity)) {
      return category;
    }
  }
  return 'other';
}

// Improved address building
function buildAddress(tags: Record<string, string>): string {
  const parts: string[] = [];
  
  // Try different address formats
  const street = tags['addr:street'] || tags.street;
  const housenumber = tags['addr:housenumber'] || tags.housenumber;
  const city = tags['addr:city'] || tags.city;
  const postcode = tags['addr:postcode'] || tags.postcode;
  
  if (housenumber && street) {
    parts.push(`${street} ${housenumber}`);
  } else if (street) {
    parts.push(street);
  }
  
  if (city) parts.push(city);
  if (postcode) parts.push(postcode);
  
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
}

// Format opening hours for better display
function formatOpeningHours(hours?: string): string | undefined {
  if (!hours) return undefined;
  
  // Simple formatting for common patterns
  if (hours === '24/7') return '24/7';
  if (hours.length > 50) return hours.substring(0, 47) + '...';
  
  return hours;
}

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Enhanced demo data for testing
function getDemoResults(filters: SearchFilters): SearchResult[] {
  console.log('🎭 Using demo data fallback');
  
  const demoResults: SearchResult[] = [];
  const majorStations = dutchTrainStations.slice(0, 8); // More stations for better demo
  
  for (const station of majorStations) {
    const stationResults = [
      {
        id: `demo-${station.id}-1`,
        name: 'McDonald\'s',
        type: 'fast_food',
        category: 'restaurant',
        address: `Stationsplein 1, ${station.city}`,
        lat: station.lat + (Math.random() - 0.5) * 0.004,
        lng: station.lng + (Math.random() - 0.5) * 0.004,
        distance: 0.1 + Math.random() * 0.8,
        trainStation: station,
        rating: 3.5 + Math.random() * 1.5,
        openingHours: '06:00-24:00'
      },
      {
        id: `demo-${station.id}-2`,
        name: 'Albert Heijn',
        type: 'supermarket',
        category: 'supermarket',
        address: `Stationsweg 5, ${station.city}`,
        lat: station.lat + (Math.random() - 0.5) * 0.004,
        lng: station.lng + (Math.random() - 0.5) * 0.004,
        distance: 0.1 + Math.random() * 0.8,
        trainStation: station,
        rating: 4.0 + Math.random() * 1.0,
        openingHours: 'Mo-Sa 08:00-22:00'
      },
      {
        id: `demo-${station.id}-3`,
        name: 'Starbucks',
        type: 'cafe',
        category: 'restaurant',
        address: `Station ${station.name}`,
        lat: station.lat + (Math.random() - 0.5) * 0.003,
        lng: station.lng + (Math.random() - 0.5) * 0.003,
        distance: 0.05 + Math.random() * 0.3,
        trainStation: station,
        rating: 4.2 + Math.random() * 0.8,
        openingHours: '06:00-20:00'
      }
    ];
    
    demoResults.push(...stationResults);
  }
  
  // Apply filters to demo data
  const filtered = demoResults.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.query.trim() && !item.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
    if (item.distance > filters.distance) return false;
    return true;
  });

  return filtered.sort((a, b) => a.distance - b.distance).slice(0, 30);
}

// Main search function with fallback
export async function searchWithFallback(filters: SearchFilters): Promise<SearchResult[]> {
  try {
    const results = await searchLocations(filters);
    
    if (results.length === 0) {
      console.info('🎭 No real results found, using demo data');
      return getDemoResults(filters);
    }
    
    return results;
  } catch (error) {
    console.error('❌ Search completely failed:', error);
    return getDemoResults(filters);
  }
}
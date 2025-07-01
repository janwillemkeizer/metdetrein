# API Integration Guide

This document outlines how to integrate real APIs to make the Dutch Train Station Finder production-ready.

## Current Implementation

The current implementation uses mock data for demonstration purposes. To make this a production-ready application, you'll need to integrate with several APIs.

## Required API Integrations

### 1. NS (Dutch Railways) API
**Purpose**: Real-time train information and station data

```typescript
// Example integration in src/services/nsApi.ts
const NS_API_BASE = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3';
const API_KEY = process.env.REACT_APP_NS_API_KEY;

export async function getStations() {
  const response = await fetch(`${NS_API_BASE}/stations`, {
    headers: {
      'Ocp-Apim-Subscription-Key': API_KEY,
    },
  });
  return response.json();
}
```

**How to get access**:
1. Register at https://apiportal.ns.nl/
2. Subscribe to the "Reisinformatie API"
3. Get your subscription key

### 2. Overpass API (OpenStreetMap)
**Purpose**: Finding points of interest near train stations

```typescript
// Example integration in src/services/overpassApi.ts
export async function searchNearbyPOIs(lat: number, lng: number, radius: number, amenity: string) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="${amenity}"](around:${radius * 1000},${lat},${lng});
      way["amenity"="${amenity}"](around:${radius * 1000},${lat},${lng});
      relation["amenity"="${amenity}"](around:${radius * 1000},${lat},${lng});
    );
    out geom;
  `;
  
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });
  
  return response.json();
}
```

**Categories mapping**:
- Restaurants: `amenity=restaurant`, `amenity=fast_food`, `amenity=cafe`
- Supermarkets: `shop=supermarket`, `shop=convenience`
- Gyms: `leisure=fitness_centre`, `leisure=sports_centre`
- Pharmacies: `amenity=pharmacy`
- Banks: `amenity=bank`, `amenity=atm`

### 3. Google Places API (Alternative/Additional)
**Purpose**: Enhanced business information with ratings, photos, and reviews

```typescript
// Example integration in src/services/googlePlacesApi.ts
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_KEY;

export async function searchNearbyPlaces(lat: number, lng: number, radius: number, type: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${lat},${lng}&radius=${radius * 1000}&type=${type}&key=${GOOGLE_API_KEY}`
  );
  return response.json();
}
```

### 4. Foursquare Places API
**Purpose**: Venue details, ratings, and categories

```typescript
// Example integration in src/services/foursquareApi.ts
const FOURSQUARE_API_KEY = process.env.REACT_APP_FOURSQUARE_KEY;

export async function searchVenues(lat: number, lng: number, radius: number, query: string) {
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?` +
    `ll=${lat},${lng}&radius=${radius * 1000}&query=${query}`,
    {
      headers: {
        'Authorization': FOURSQUARE_API_KEY,
      },
    }
  );
  return response.json();
}
```

## Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_NS_API_KEY=your_ns_api_key_here
REACT_APP_GOOGLE_PLACES_KEY=your_google_places_key_here
REACT_APP_FOURSQUARE_KEY=your_foursquare_key_here
```

## Implementation Steps

### Step 1: Update API Service
Replace the mock data in `src/services/api.ts` with real API calls:

```typescript
export async function searchLocations(filters: SearchFilters): Promise<SearchResult[]> {
  const station = await getStationById(filters.stationId);
  if (!station) return [];

  // Use multiple APIs for comprehensive results
  const [overpassResults, placesResults] = await Promise.all([
    searchNearbyPOIs(station.lat, station.lng, filters.distance, getCategoryMapping(filters.category)),
    searchNearbyPlaces(station.lat, station.lng, filters.distance, filters.category)
  ]);

  // Combine and deduplicate results
  return combineResults(overpassResults, placesResults, station);
}
```

### Step 2: Add Error Handling
Implement proper error handling for API failures:

```typescript
export async function searchLocations(filters: SearchFilters): Promise<SearchResult[]> {
  try {
    // API calls here
  } catch (error) {
    console.error('Search failed:', error);
    // Fall back to cached data or show user-friendly error
    return [];
  }
}
```

### Step 3: Add Caching
Implement caching to reduce API calls and improve performance:

```typescript
const cache = new Map();

export async function searchLocationsWithCache(filters: SearchFilters): Promise<SearchResult[]> {
  const cacheKey = JSON.stringify(filters);
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const results = await searchLocations(filters);
  cache.set(cacheKey, results);
  
  return results;
}
```

### Step 4: Add Rate Limiting
Implement rate limiting to respect API quotas:

```typescript
import { throttle } from 'lodash';

const throttledSearch = throttle(searchLocations, 1000); // Max 1 request per second
```

## Production Considerations

### Security
- Never expose API keys in frontend code
- Use environment variables for configuration
- Consider implementing a backend proxy for sensitive APIs

### Performance
- Implement debouncing for search inputs
- Use pagination for large result sets
- Optimize map rendering with clustering

### User Experience
- Add loading states and progress indicators
- Implement offline fallbacks with cached data
- Show meaningful error messages

### Analytics
- Track search queries and popular locations
- Monitor API usage and costs
- Implement user feedback collection

## Testing

### Unit Tests
```typescript
// src/services/__tests__/api.test.ts
import { searchLocations } from '../api';

describe('searchLocations', () => {
  it('should return results for valid station', async () => {
    const filters = {
      query: 'restaurant',
      stationId: '1',
      distance: 2,
      category: 'restaurant'
    };
    
    const results = await searchLocations(filters);
    expect(results).toHaveLength(0); // Adjust based on expected results
  });
});
```

### Integration Tests
Test with real APIs in a staging environment before production deployment.

## Deployment

### Environment Setup
Ensure all API keys are properly configured in your hosting environment:

- **Netlify**: Set environment variables in site settings
- **Vercel**: Configure in project settings or vercel.json
- **Heroku**: Use `heroku config:set` command

### Monitoring
Implement monitoring for:
- API response times
- Error rates
- User engagement metrics
- Cost tracking for paid APIs

## Cost Optimization

### API Usage Optimization
- Cache frequently requested data
- Implement smart refresh strategies
- Use free tiers efficiently
- Consider alternative APIs for cost reduction

### Estimated Monthly Costs (for 10,000 active users)
- NS API: Free for basic usage
- Google Places API: ~$100-200/month
- Foursquare API: ~$50-100/month
- OpenStreetMap/Overpass: Free

## Legal Considerations

- Review terms of service for each API
- Implement proper attribution for OpenStreetMap data
- Consider data privacy regulations (GDPR)
- Add terms of service and privacy policy to your app
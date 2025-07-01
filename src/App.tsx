import React, { useState, useEffect } from 'react';
import { Train, MapPin, ExternalLink, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { ResultsList } from './components/ResultsList';
import { MapView } from './components/MapView';
import { SearchFilters, SearchResult, TrainStation } from './types';
import { searchWithFallback, getTrainStations } from './services/api';

function App() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    distance: 2,
    category: 'all'
  });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [stations, setStations] = useState<TrainStation[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);

  // Load train stations on component mount
  useEffect(() => {
    const loadStations = async () => {
      try {
        const stationData = await getTrainStations();
        setStations(stationData);
        console.log(`✅ Loaded ${stationData.length} train stations`);
      } catch (error) {
        console.error('Failed to load train stations:', error);
      }
    };

    loadStations();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle search with improved error handling
  const handleSearch = async () => {
    const startTime = Date.now();
    setIsLoading(true);
    setSelectedResult(null);
    setSearchError(null);
    
    try {
      console.log('🚀 Starting search with filters:', filters);
      
      const searchResults = await searchWithFallback(filters);
      const duration = Date.now() - startTime;
      
      setResults(searchResults);
      setLastSearchTime(new Date());
      
      console.log(`✅ Search completed in ${duration}ms - Found ${searchResults.length} venues`);
      
      if (searchResults.length === 0) {
        setSearchError('No venues found with your search criteria. Try adjusting your search terms or increasing the distance.');
      }
      
    } catch (error) {
      console.error('❌ Search failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Search failed unexpectedly';
      setSearchError(`Search failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
    console.log('📍 Selected venue:', result.name, 'near', result.trainStation.name);
  };

  // Calculate map center based on results or default to Netherlands center
  const getMapCenter = (): [number, number] => {
    if (results.length > 0) {
      const avgLat = results.reduce((sum, r) => sum + r.lat, 0) / results.length;
      const avgLng = results.reduce((sum, r) => sum + r.lng, 0) / results.length;
      return [avgLat, avgLng];
    }
    return [52.3676, 4.9041]; // Netherlands center
  };

  // Calculate map zoom based on results spread
  const getMapZoom = (): number => {
    if (results.length === 0) return 7;
    if (results.length === 1) return 13;
    
    // Calculate bounding box of results
    const lats = results.map(r => r.lat);
    const lngs = results.map(r => r.lng);
    const latSpread = Math.max(...lats) - Math.min(...lats);
    const lngSpread = Math.max(...lngs) - Math.min(...lngs);
    const maxSpread = Math.max(latSpread, lngSpread);
    
    // Zoom level based on spread
    if (maxSpread > 2) return 6;
    if (maxSpread > 1) return 7;
    if (maxSpread > 0.5) return 8;
    if (maxSpread > 0.2) return 9;
    if (maxSpread > 0.1) return 10;
    return 11;
  };

  // Get unique train stations from results
  const getUniqueStations = (): TrainStation[] => {
    const stationMap = new Map<string, TrainStation>();
    results.forEach(result => {
      stationMap.set(result.trainStation.id, result.trainStation);
    });
    return Array.from(stationMap.values());
  };

  // Get search status message
  const getSearchStatus = () => {
    if (isLoading) return null;
    if (searchError) return searchError;
    if (results.length > 0) {
      return `Found ${results.length} venues near ${getUniqueStations().length} train stations`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-ns-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Train className="h-8 w-8 text-ns-yellow" />
              <div>
                <h1 className="text-xl font-bold">Met de Trein</h1>
                <p className="text-ns-yellow text-sm">Find venues near any Dutch train station</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Online status indicator */}
              <div className={`flex items-center space-x-1 text-sm ${isOnline ? 'text-green-300' : 'text-red-300'}`}>
                <Wifi className="h-4 w-4" />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              
              {/* Station count */}
              <div className="text-ns-yellow text-sm">
                <MapPin className="h-4 w-4 inline mr-1" />
                {stations.length} stations
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <SearchForm
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {/* Search Status */}
            {getSearchStatus() && (
              <div className={`mb-6 p-4 rounded-lg flex items-start space-x-2 ${
                searchError 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                {searchError ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className={`text-sm font-medium ${
                    searchError ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {getSearchStatus()}
                  </p>
                  {lastSearchTime && !searchError && (
                    <p className="text-xs text-green-600 mt-1">
                      Last updated: {lastSearchTime.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Data source information */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Data Sources</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Train Stations:</span>
                  <span className="text-green-600 font-medium">NS Ready ({stations.length})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Venues:</span>
                  <span className="text-green-600 font-medium">OpenStreetMap Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className={isOnline ? 'text-green-600' : 'text-orange-600'}>
                    {isOnline ? 'Live Data' : 'Demo Mode'}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200">
                <a 
                  href="https://github.com/janwillemkeizer/metdetrein" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-ns-blue hover:text-ns-yellow transition-colors"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Results List */}
            <div className="lg:max-h-96 lg:overflow-y-auto">
              <ResultsList 
                results={results} 
                onResultClick={handleResultClick}
              />
            </div>
          </div>

          {/* Map Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
              <MapView
                center={getMapCenter()}
                zoom={getMapZoom()}
                results={results}
                selectedResult={selectedResult}
                stations={getUniqueStations()}
                searchRadius={filters.distance}
              />
            </div>
            
            {/* Map legend */}
            <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Map Legend</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Train Stations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Found Venues</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Selected Venue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-gray-400 rounded-full"></div>
                  <span>Search Radius</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {results.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-ns-blue">{results.length}</div>
                <div className="text-sm text-gray-600">Venues Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ns-blue">
                  {getUniqueStations().length}
                </div>
                <div className="text-sm text-gray-600">Train Stations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ns-blue">
                  {Math.min(...results.map(r => r.distance)).toFixed(1)}km
                </div>
                <div className="text-sm text-gray-600">Closest to Station</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ns-blue">
                  {filters.distance}km
                </div>
                <div className="text-sm text-gray-600">Max Distance</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-ns-blue text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-sm text-gray-300">
                Find venues near any Dutch train station. Search for McDonald's, Albert Heijn, gyms, 
                or any other business within walking distance of train stations across the Netherlands.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Search for specific brands or categories</li>
                <li>• Set your preferred walking distance</li>
                <li>• See all options near any train station</li>
                <li>• View locations on interactive map</li>
                <li>• Get directions and contact info</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• {stations.length} Nederlandse Spoorwegen stations</li>
                <li>• Live OpenStreetMap data</li>
                <li>• Overpass API integration</li>
                <li>• Real-time venue information</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm text-gray-400">
            <p>&copy; 2025 Met de Trein. Built with React, TypeScript, and real Dutch data.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
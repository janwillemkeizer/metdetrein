import React, { useState, useEffect } from 'react';
import { Train, MapPin, ExternalLink, Wifi } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { ResultsList } from './components/ResultsList';
import { MapView } from './components/MapView';
import { SearchFilters, SearchResult, TrainStation } from './types';
import { searchWithFallback, getTrainStations } from './services/api';

function App() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    stationId: '',
    distance: 2,
    category: 'all'
  });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [stations, setStations] = useState<TrainStation[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load train stations on component mount
  useEffect(() => {
    const loadStations = async () => {
      try {
        const stationData = await getTrainStations();
        setStations(stationData);
        // Set default station to Amsterdam Centraal
        if (stationData.length > 0 && !filters.stationId) {
          setFilters(prev => ({ ...prev, stationId: stationData[0].id }));
        }
      } catch (error) {
        console.error('Failed to load train stations:', error);
      }
    };

    loadStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

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

  // Handle search
  const handleSearch = async () => {
    if (!filters.stationId) {
      alert('Please select a train station first');
      return;
    }

    setIsLoading(true);
    setSelectedResult(null);
    
    try {
      const searchResults = await searchWithFallback(filters);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
  };

  // Get current station for map centering
  const currentStation = stations.find(s => s.id === filters.stationId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-ns-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Train className="h-8 w-8 text-ns-yellow" />
              <div>
                <h1 className="text-xl font-bold">Dutch Train Station Finder</h1>
                <p className="text-ns-yellow text-sm">Find everything near Dutch train stations</p>
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
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <SearchForm
                filters={filters}
                stations={stations}
                onFiltersChange={setFilters}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>

            {/* Data source information */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Data Sources</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Train Stations:</span>
                  <span className="text-green-600 font-medium">NS API Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Locations:</span>
                  <span className="text-green-600 font-medium">OpenStreetMap</span>
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
                center={currentStation ? [currentStation.lat, currentStation.lng] : [52.3676, 4.9041]}
                zoom={currentStation ? 13 : 7}
                results={results}
                selectedResult={selectedResult}
                station={currentStation}
              />
            </div>
            
            {/* Map legend */}
            <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Map Legend</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Train Station</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Search Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Selected</span>
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
                <div className="text-sm text-gray-600">Results Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ns-blue">
                  {Math.min(...results.map(r => r.distance)).toFixed(1)}km
                </div>
                <div className="text-sm text-gray-600">Closest Result</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ns-blue">
                  {filters.distance}km
                </div>
                <div className="text-sm text-gray-600">Search Radius</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ns-blue">
                  {currentStation?.city || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Current City</div>
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
                Find stores, restaurants, gyms, and other venues near any Dutch train station. 
                Powered by real-time data from OpenStreetMap and NS API.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• {stations.length} Dutch train stations</li>
                <li>• Live location data from OpenStreetMap</li>
                <li>• Interactive map with custom radius</li>
                <li>• Category filtering and search</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Nederlandse Spoorwegen (NS)</li>
                <li>• OpenStreetMap Contributors</li>
                <li>• Overpass API</li>
                <li>• OpenLayers & Leaflet</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm text-gray-400">
            <p>&copy; 2025 Dutch Train Station Finder. Built with React, TypeScript, and real Dutch data.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
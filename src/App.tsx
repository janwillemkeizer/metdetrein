import React, { useState, useEffect } from 'react';
import { Train, MapPin } from 'lucide-react';
import { SearchForm } from './components/SearchForm';
import { ResultsList } from './components/ResultsList';
import { MapView } from './components/MapView';
import { SearchFilters, SearchResult, TrainStation } from './types';
import { searchLocations, getTrainStations } from './services/api';

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

  // Load train stations on component mount
  useEffect(() => {
    setStations(getTrainStations());
  }, []);

  const selectedStation = stations.find(s => s.id === filters.stationId) || null;

  const handleSearch = async () => {
    if (!filters.stationId) return;
    
    setIsLoading(true);
    try {
      const searchResults = await searchLocations(filters);
      setResults(searchResults);
      setSelectedResult(null);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-ns-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Train className="w-8 h-8 text-ns-yellow" />
              <div>
                <h1 className="text-xl font-bold">Station Finder</h1>
                <p className="text-sm text-blue-200">Find what you need near Dutch train stations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Netherlands</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <SearchForm
          filters={filters}
          stations={stations}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Results List */}
          <div>
            <ResultsList
              results={results}
              onResultClick={handleResultClick}
            />
          </div>

          {/* Map */}
          <div>
            <MapView
              results={results}
              selectedStation={selectedStation}
              selectedResult={selectedResult}
              onResultClick={handleResultClick}
            />
          </div>
        </div>

        {/* Info Section */}
        {results.length === 0 && !isLoading && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <Train className="w-16 h-16 mx-auto text-ns-blue mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Station Finder
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Discover stores, restaurants, gyms, and other venues near Dutch train stations. 
                Perfect for planning your journey or exploring what's available at your destination.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-4">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-ns-blue" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Choose a Station</h3>
                  <p className="text-sm text-gray-600">
                    Select from major Dutch train stations across the country
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Search & Filter</h3>
                  <p className="text-sm text-gray-600">
                    Find specific types of venues within your preferred distance
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Explore on Map</h3>
                  <p className="text-sm text-gray-600">
                    View locations and stations on an interactive map
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Station Finder. Built for exploring the Netherlands by train.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This is a demo application. In production, it would integrate with real APIs for live data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
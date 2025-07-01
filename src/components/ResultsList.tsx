import React from 'react';
import { MapPin, Star, Clock, Navigation, Train } from 'lucide-react';
import { SearchResult } from '../types';

interface ResultsListProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({ results, onResultClick }) => {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <MapPin className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
        <p className="text-gray-500">
          Try searching for different venues (like "McDonald's", "Albert Heijn") or adjusting your distance range.
        </p>
        <div className="mt-4 text-sm text-gray-400">
          <p>💡 Examples: McDonald's, Starbucks, gym, supermarket</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Found {results.length} venue{results.length !== 1 ? 's' : ''} near train stations
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {results.map((result) => (
          <div
            key={result.id}
            onClick={() => onResultClick(result)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{result.name}</h3>
                
                {/* Category badge */}
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                  {result.category}
                </div>
                
                {/* Train station info - highlighted */}
                <div className="flex items-center text-sm bg-blue-50 p-2 rounded mb-2">
                  <Train className="w-4 h-4 mr-2 text-blue-600" />
                  <div>
                    <span className="font-medium text-blue-700">{result.trainStation.name}</span>
                    <span className="text-gray-600 ml-2">({result.trainStation.city})</span>
                  </div>
                </div>
                
                {result.address && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{result.address}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-gray-600 font-medium">
                    <Navigation className="w-4 h-4 mr-1" />
                    <span>{result.distance.toFixed(1)} km walk</span>
                  </div>
                  
                  {result.rating && (
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>{result.rating}</span>
                    </div>
                  )}
                  
                  {result.openingHours && (
                    <div className="flex items-center text-green-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="truncate max-w-24">{result.openingHours}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="ml-4 flex flex-col space-y-2">
                <button className="text-ns-blue hover:text-blue-700 font-medium text-sm">
                  View on map
                </button>
                {(result.phone || result.website) && (
                  <div className="text-xs text-gray-500">
                    {result.phone && <div>📞</div>}
                    {result.website && <div>🌐</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
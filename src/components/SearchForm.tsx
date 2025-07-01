import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { SearchFilters, TrainStation } from '../types';

interface SearchFormProps {
  filters: SearchFilters;
  stations: TrainStation[];
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'supermarket', label: 'Supermarkets' },
  { value: 'gym', label: 'Sports & Fitness' },
  { value: 'cinema', label: 'Entertainment' },
  { value: 'shop', label: 'Shopping' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'bank', label: 'Banking' }
];

export const SearchForm: React.FC<SearchFormProps> = ({
  filters,
  stations,
  onFiltersChange,
  onSearch,
  isLoading
}) => {
  const handleInputChange = (field: keyof SearchFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Query */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              What are you looking for?
            </label>
            <div className="relative">
              <input
                type="text"
                id="query"
                value={filters.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                placeholder="e.g., restaurant, supermarket, gym"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ns-blue focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Train Station */}
          <div>
            <label htmlFor="station" className="block text-sm font-medium text-gray-700 mb-1">
              Train Station
            </label>
            <div className="relative">
              <select
                id="station"
                value={filters.stationId}
                onChange={(e) => handleInputChange('stationId', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ns-blue focus:border-transparent appearance-none"
                required
              >
                <option value="">Select a station</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ns-blue focus:border-transparent appearance-none"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Distance */}
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distance (km)
            </label>
            <input
              type="range"
              id="distance"
              min="0.5"
              max="10"
              step="0.5"
              value={filters.distance}
              onChange={(e) => handleInputChange('distance', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5km</span>
              <span className="font-medium">{filters.distance}km</span>
              <span>10km</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !filters.stationId}
            className="bg-ns-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
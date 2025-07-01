import React from 'react';
import { Search, Filter } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFormProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'restaurant', label: 'Restaurants & Food' },
  { value: 'supermarket', label: 'Supermarkets' },
  { value: 'gym', label: 'Sports & Fitness' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'pharmacy', label: 'Pharmacy & Health' },
  { value: 'bank', label: 'Banking & ATM' },
  { value: 'hotel', label: 'Hotels' },
  { value: 'fuel', label: 'Gas Stations' },
  { value: 'hospital', label: 'Medical' },
  { value: 'school', label: 'Education' },
  { value: 'tourism', label: 'Tourism & Culture' }
];

export const SearchForm: React.FC<SearchFormProps> = ({
  filters,
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
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-ns-blue mb-2">Find Venues Near Train Stations</h1>
        <p className="text-gray-600">Search for restaurants, shops, and services near any Dutch train station</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="e.g., McDonald's, Albert Heijn, gym"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ns-blue focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
              Max Distance from Train Station
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
            disabled={isLoading}
            className="bg-ns-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Searching...' : 'Find Venues'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
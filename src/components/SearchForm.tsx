import React, { useState } from 'react';
import { Search, Filter, Loader2, MapPin, Info } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchFormProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'restaurant', label: 'Restaurants & Food', examples: 'McDonald\'s, KFC, Subway' },
  { value: 'supermarket', label: 'Supermarkets', examples: 'Albert Heijn, Jumbo, Lidl' },
  { value: 'gym', label: 'Sports & Fitness', examples: 'Basic-Fit, David Lloyd' },
  { value: 'entertainment', label: 'Entertainment', examples: 'Cinema, Theater' },
  { value: 'shopping', label: 'Shopping', examples: 'H&M, MediaMarkt' },
  { value: 'pharmacy', label: 'Pharmacy & Health', examples: 'Etos, Kruidvat' },
  { value: 'bank', label: 'Banking & ATM', examples: 'ING, ABN AMRO' },
  { value: 'hotel', label: 'Hotels', examples: 'NH Hotel, Ibis' },
  { value: 'fuel', label: 'Gas Stations', examples: 'Shell, BP, Esso' },
  { value: 'hospital', label: 'Medical', examples: 'Hospital, Clinic' },
  { value: 'school', label: 'Education', examples: 'University, School' },
  { value: 'tourism', label: 'Tourism & Culture', examples: 'Museum, Tourist Info' }
];

export const SearchForm: React.FC<SearchFormProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  isLoading
}) => {
  const [showHints, setShowHints] = useState(false);

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

  const selectedCategory = categories.find(cat => cat.value === filters.category);
  const hasValidSearch = filters.query.trim() || filters.category !== 'all';

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-ns-blue mb-2">Find Venues Near Train Stations</h1>
        <p className="text-gray-600">Search for restaurants, shops, and services near any Dutch train station</p>
        
        {/* Info toggle */}
        <button
          onClick={() => setShowHints(!showHints)}
          className="mt-2 flex items-center mx-auto text-sm text-gray-500 hover:text-ns-blue transition-colors"
        >
          <Info className="w-4 h-4 mr-1" />
          {showHints ? 'Hide examples' : 'Show search examples'}
        </button>

        {/* Search hints */}
        {showHints && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold text-ns-blue mb-2">💡 Search Examples:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>
                <strong>By Brand:</strong> "McDonald's", "Albert Heijn", "Starbucks"
              </div>
              <div>
                <strong>By Type:</strong> "gym", "pharmacy", "supermarket"
              </div>
              <div>
                <strong>By Category:</strong> Select from dropdown below
              </div>
              <div>
                <strong>Mixed:</strong> "coffee" + Restaurant category
              </div>
            </div>
          </div>
        )}
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
                placeholder={selectedCategory?.examples || "e.g., McDonald's, Albert Heijn, gym"}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ns-blue focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            {filters.query.trim() && (
              <p className="text-xs text-gray-500 mt-1">
                Searching for "{filters.query}" near train stations
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category Filter
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
            {selectedCategory?.examples && (
              <p className="text-xs text-gray-500 mt-1">
                e.g., {selectedCategory.examples}
              </p>
            )}
          </div>

          {/* Distance */}
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Max Walking Distance
            </label>
            <input
              type="range"
              id="distance"
              min="0.5"
              max="5"
              step="0.5"
              value={filters.distance}
              onChange={(e) => handleInputChange('distance', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5km</span>
              <span className="font-medium text-ns-blue">{filters.distance}km</span>
              <span>5km</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {filters.distance <= 1 ? 'Quick walk' : filters.distance <= 2 ? 'Comfortable walk' : 'Longer walk'}
            </p>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex flex-col items-center space-y-3">
          <button
            type="submit"
            disabled={isLoading || !hasValidSearch}
            className="bg-ns-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 min-w-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Venues</span>
              </>
            )}
          </button>
          
          {!hasValidSearch && (
            <p className="text-sm text-amber-600 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Enter a search term or select a category to search
            </p>
          )}
          
          {isLoading && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                🔍 Searching near Dutch train stations...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This may take a moment for the best results
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
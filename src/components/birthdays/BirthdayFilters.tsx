import React from 'react';
import { Search, Calendar, X } from 'lucide-react';
import type { BirthdayFilters as BirthdayFiltersType } from '../../types/birthday';

interface FiltersProps {
  filters: BirthdayFiltersType;
  onFilterChange: (filters: Partial<BirthdayFiltersType>) => void;
}

export function BirthdayFilters({ filters, onFilterChange }: FiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      searchTerm: '',
      gender: undefined,
      timeframe: 'all',
      sortBy: 'nextBirthday',
      sortOrder: 'asc'
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <select
          value={filters.gender || ''}
          onChange={(e) => onFilterChange({ gender: e.target.value as 'male' | 'female' | undefined })}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          value={filters.timeframe || 'all'}
          onChange={(e) => onFilterChange({ timeframe: e.target.value as 'all' | 'thisMonth' | 'nextMonth' })}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Time</option>
          <option value="thisMonth">This Month</option>
          <option value="nextMonth">Next Month</option>
        </select>

        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFilterChange({
              sortBy: sortBy as 'name' | 'date' | 'age' | 'nextBirthday',
              sortOrder: sortOrder as 'asc' | 'desc'
            });
          }}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="nextBirthday-asc">Next Birthday (Soonest)</option>
          <option value="nextBirthday-desc">Next Birthday (Latest)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="date-asc">Birthday (Oldest)</option>
          <option value="date-desc">Birthday (Newest)</option>
          <option value="age-asc">Age (Youngest)</option>
          <option value="age-desc">Age (Oldest)</option>
        </select>

        <button
          onClick={handleClearFilters}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </button>
      </div>
    </div>
  );
}
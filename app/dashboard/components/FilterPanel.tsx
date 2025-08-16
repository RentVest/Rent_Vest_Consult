'use client';

import React from 'react';
import './FilterPanel.scss';

interface FilterPanelProps {
  filters: {
    userType: 'all' | 'tenant' | 'landlord';
    limit: number;
    searchTerm: string;
  };
  onFilterChange: (filters: Partial<FilterPanelProps['filters']>) => void;
  totalCount: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, totalCount }) => {
  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ userType: e.target.value as 'all' | 'tenant' | 'landlord' });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ limit: parseInt(e.target.value) });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ searchTerm: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({ userType: 'all', searchTerm: '', limit: 10 });
  };

  const hasActiveFilters = filters.userType !== 'all' || filters.searchTerm !== '';

  return (
    <div className="filter-panel">
      <div className="filters">
        <input
          type="text"
          placeholder="Search..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        
        <select
          value={filters.userType}
          onChange={handleUserTypeChange}
          className="filter-select"
        >
          <option value="all">All Users</option>
          <option value="tenant">Tenants</option>
          <option value="landlord">Landlords</option>
        </select>

        <select
          value={filters.limit}
          onChange={handleLimitChange}
          className="filter-select"
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-btn">
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
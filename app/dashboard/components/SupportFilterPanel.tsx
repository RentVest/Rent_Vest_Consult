'use client';

import React from 'react';
import './FilterPanel.scss';

interface SupportFilterPanelProps {
  filters: {
    supportStatus: 'All' | 'New' | 'In Progress' | 'Resolved' | 'Closed';
    limit: number;
    searchTerm: string;
  };
  onFilterChange: (filters: Partial<SupportFilterPanelProps['filters']>) => void;
}

const SupportFilterPanel: React.FC<SupportFilterPanelProps> = ({ filters, onFilterChange }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ supportStatus: e.target.value as SupportFilterPanelProps['filters']['supportStatus'] });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ limit: parseInt(e.target.value) });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ searchTerm: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({ supportStatus: 'All', searchTerm: '', limit: 10 });
  };

  const hasActiveFilters = filters.supportStatus !== 'All' || filters.searchTerm !== '';

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
          value={filters.supportStatus}
          onChange={handleStatusChange}
          className="filter-select"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
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

export default SupportFilterPanel;



'use client';

import React, { useState, useEffect } from 'react';
import { consultingApi, validateApiResponse } from '@/app/services/consultingApi';
import { FormData } from '@/app/types/form';
import { SupportTicketData } from '@/app/types/support';
import { AuthProvider, useAuth } from '@/app/auth/AuthContext';
import LoginForm from '@/app/auth/LoginForm';
import ConsultingDataTable from './components/ConsultingDataTable';
import SupportTicketTable from './components/SupportTicketTable';
import FilterPanel from './components/FilterPanel';
import SupportFilterPanel from './components/SupportFilterPanel';
import LoadingSpinner from './components/LoadingSpinner';
import './dashboard.scss';

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

const DashboardContent: React.FC = () => {
  const { logout } = useAuth();
  // State management
  const [consultingData, setConsultingData] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
    has_more: false,
  });

  const [supportData, setSupportData] = useState<SupportTicketData[]>([]);
  const [supportPagination, setSupportPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
    has_more: false,
  });

  const [activeTab, setActiveTab] = useState<'consulting' | 'support'>('consulting');

  // Filter state
  const [filters, setFilters] = useState({
    userType: 'all' as 'all' | 'tenant' | 'landlord',
    limit: 10,
    searchTerm: '',
    supportStatus: 'All' as 'All' | 'New' | 'In Progress' | 'Resolved' | 'Closed',
  });

  // Fetch data function
  const fetchConsultingData = async (offset: number = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const options = {
        limit: filters.limit,
        offset: offset,
        ...(filters.userType !== 'all' && { userType: filters.userType }),
      };

      const response = await consultingApi.getAllConsultingData(options);

      if (validateApiResponse(response)) {
        setConsultingData(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch support data function
  const fetchSupportData = async (offset: number = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const options = {
        limit: filters.limit,
        offset: offset,
        ...(filters.userType !== 'all' && { userType: filters.userType }),
      };

      const response = await consultingApi.getAllSupportTickets(options);
      console.log('response', response);
    if (validateApiResponse(response)) {
      setSupportData(response.data.data);
      setSupportPagination(response.data.pagination);
    } else {
      setError(response.error || 'Failed to fetch data');
    }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchSupportData();
  }, [filters.limit]);

  // Initial data load
  useEffect(() => {
    fetchConsultingData();
  }, [filters.userType, filters.limit]);

  // Filter by search term (client-side)
  const filteredData = consultingData.filter((item) => {
    if (!filters.searchTerm) return true;

    const searchLower = filters.searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      item.tenantPreferences?.location?.toLowerCase().includes(searchLower) ||
      item.landlordDetails?.propertyType?.toLowerCase().includes(searchLower)
    );
  });

  // Support: filter by search and status (client-side)
  const filteredSupportData = supportData.filter((item) => {
    const matchesSearch = (() => {
      if (!filters.searchTerm) return true;
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.message?.toLowerCase().includes(searchLower)
      );
    })();

    const matchesStatus = (() => {
      if (filters.supportStatus === 'All') return true;
      const status = (item.admin_status || 'New').toLowerCase();
      return status === filters.supportStatus.toLowerCase();
    })();

    return matchesSearch && matchesStatus;
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handle pagination
  const handlePageChange = (newOffset: number) => {
    fetchConsultingData(newOffset);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchConsultingData(pagination.offset);
  };

  return (
    <div className='dashboard-container'>
      <div className='dashboard-header'>
        <h1>{activeTab === 'consulting' ? 'Consulting Data Dashboard' : 'Support Ticket Dashboard'}</h1>
        <p>
          {activeTab === 'consulting' 
            ? 'Manage and track all consulting submissions from tenants and landlords. View details, update status, and add comments to streamline your workflow.' 
            : 'Manage and track all support tickets from users. View details, update status, and add comments to streamline your workflow.'}
        </p>

        {/* Header Section including all buttons */}
        <div className='header-actions'>
          <div className='header-actions-left'>
            <button 
              onClick={() => setActiveTab('consulting')} 
              className={`btn-secondary ${activeTab === 'consulting' ? 'active' : ''}`}
            >
              Consulting
            </button>
            <button 
              onClick={() => setActiveTab('support')} 
              className={`btn-secondary ${activeTab === 'support' ? 'active' : ''}`}
            >
              Support
            </button>
          </div>

          <div className='header-actions-right'>
            <button onClick={handleRefresh} className='btn-secondary' disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button onClick={logout} className='btn-secondary'>
              Logout
            </button>
            <a href='/' className='btn-secondary'>
              Back to Home
            </a>
          </div>
        </div>
      </div>

      <div className='dashboard-content'>
      {activeTab === 'consulting' && (
        <>
        <div className='content-header'>
          <div className='stats'>
            <span className='total-count'>{pagination.total} total submissions</span>
            {filters.userType !== 'all' && (
              <span className='filter-count'>
                ({pagination.total} {filters.userType}s)
              </span>
            )}
          </div>
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} totalCount={pagination.total} />
        </div>

        {error && (
          <div className='error-message'>
            {error}
            <button onClick={handleRefresh} className='retry-btn'>
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {filteredData.length > 0 ? (
              <ConsultingDataTable data={filteredData} onUpdate={() => fetchConsultingData(pagination.offset)} />
            ) : (
              <div className='empty-state'>
                <h3>No submissions found</h3>
                <p>{filters.searchTerm || filters.userType !== 'all' ? 'Try adjusting your filters' : 'No submissions have been received yet'}</p>
              </div>
            )}

            {/* Pagination */}
            {!filters.searchTerm && pagination.total > pagination.limit && (
              <div className='pagination'>
                <span className='page-info'>
                  {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <div className='page-controls'>
                  <button
                    onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                    disabled={pagination.offset === 0 || isLoading}
                    className='page-btn'
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                    disabled={!pagination.has_more || isLoading}
                    className='page-btn'
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        </>
      )}

      {activeTab === 'support' && (
        <>
        <div className='content-header'>
          <div className='stats'>
            <span className='total-count'>{supportPagination.total} total tickets</span>
            {filters.supportStatus !== 'All' || filters.searchTerm ? (
              <span className='filter-count'>
                ({filteredSupportData.length} matching)
              </span>
            ) : null}
          </div>
          <SupportFilterPanel filters={{ supportStatus: filters.supportStatus, limit: filters.limit, searchTerm: filters.searchTerm }} onFilterChange={(f) => handleFilterChange(f as any)} />
        </div>

        {error && (
          <div className='error-message'>
            {error}
            <button onClick={handleRefresh} className='retry-btn'>
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {filteredSupportData.length > 0 ? (
              <SupportTicketTable
                data={filteredSupportData}
                onUpdate={() => fetchSupportData(supportPagination.offset)}
              />
            ) : (
              <div className='empty-state'>
                <h3>No tickets found</h3>
                <p>
                  {supportPagination.total === 0
                    ? 'No support tickets have been submitted yet.'
                    : (filters.supportStatus !== 'All' || !!filters.searchTerm)
                      ? 'No tickets match the current status.'
                      : 'No tickets found.'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!filters.searchTerm && supportPagination.total > supportPagination.limit && (
          <div className='pagination'>
            <span className='page-info'>
              {supportPagination.offset + 1}-{Math.min(supportPagination.offset + supportPagination.limit, supportPagination.total)} of {supportPagination.total}
            </span>
            <div className='page-controls'>
              <button className='page-btn' onClick={() => fetchSupportData(supportPagination.offset - supportPagination.limit)} disabled={supportPagination.offset === 0 || isLoading}>
                ←
                </button>
              <button className='page-btn' onClick={() => fetchSupportData(supportPagination.offset + supportPagination.limit)} disabled={!supportPagination.has_more || isLoading}>
                →
              </button>
            </div>
          </div>
        )}
        </>
      )}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <AuthProvider>
      <ProtectedDashboard />
    </AuthProvider>
  );
};

const ProtectedDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <DashboardContent />;
};

export default DashboardPage;

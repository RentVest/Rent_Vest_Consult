'use client';

import React, { useState } from 'react';
import { FormData } from '@/app/types/form';
import ConsultingDetailModal from './ConsultingDetailModal';
import './ConsultingDataTable.scss';

interface ConsultingDataTableProps {
  data: FormData[];
  onUpdate: () => void;
}

const ConsultingDataTable: React.FC<ConsultingDataTableProps> = ({ data, onUpdate }) => {
  const [selectedData, setSelectedData] = useState<FormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Handle scroll indicators
  const handleScroll = React.useCallback(() => {
    const element = tableRef.current;
    const wrapper = wrapperRef.current;
    if (!element || !wrapper) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;
    const hasOverflow = scrollWidth > clientWidth;
    const isAtStart = scrollLeft === 0;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    if (!hasOverflow) {
      wrapper.setAttribute('data-scroll', 'no-overflow');
    } else if (isAtStart) {
      wrapper.setAttribute('data-scroll', 'start');
    } else if (isAtEnd) {
      wrapper.setAttribute('data-scroll', 'end');
    } else {
      wrapper.setAttribute('data-scroll', 'middle');
    }
  }, []);

  React.useEffect(() => {
    const element = tableRef.current;
    if (!element) return;

    // Set initial state
    handleScroll();

    element.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const handleViewClick = (rowData: FormData) => {
    setSelectedData(rowData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const getRentBudget = (item: FormData) => {
    if (item.userType === 'tenant' && item.tenantPreferences) {
      return item.tenantPreferences.budget || 'Not specified';
    } else if (item.userType === 'landlord' && item.landlordDetails) {
      return item.landlordDetails.rent || 'Not specified';
    }
    return 'Not specified';
  };

  const getAvailability = (item: FormData) => {
    if (item.userType === 'tenant' && item.tenantPreferences) {
      return item.tenantPreferences.moveInTime || 'Not specified';
    } else if (item.userType === 'landlord' && item.landlordDetails) {
      return item.landlordDetails.availability || 'Not specified';
    }
    return 'Not specified';
  };

  return (
    <>
      <div className='table-wrapper' ref={wrapperRef} data-scroll='start'>
        <div className='scroll-fade-left'></div>
        <div className='scroll-fade-right'></div>
        <div className='consulting-data-table' ref={tableRef}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Rent/Budget</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={`${item.email}-${index}`}>
                  <td className='name-cell'>{item.name}</td>
                  <td className='email-cell'>{item.email}</td>
                  <td className='phone-cell'>{item.phoneNumber}</td>
                  <td className='type-cell'>
                    <span className={`user-type-badge ${item.userType}`}>{item.userType.charAt(0).toUpperCase() + item.userType.slice(1)}</span>
                  </td>
                  <td className='rent-cell'>{getRentBudget(item)}</td>
                  <td className='availability-cell'>{getAvailability(item)}</td>
                  <td className='status-cell'>
                    <span className='status-badge'>{item.admin_status || 'New'}</span>
                  </td>
                  <td className='actions-cell'>
                    <button className='view-btn' onClick={() => handleViewClick(item)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedData && (
        <ConsultingDetailModal
          data={selectedData}
          onClose={handleModalClose}
          onUpdate={() => {
            onUpdate();
            handleModalClose();
          }}
        />
      )}
    </>
  );
};

export default ConsultingDataTable;

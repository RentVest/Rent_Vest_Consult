'use client';

import React, { useState } from 'react';
import { SupportTicketData } from '@/app/types/support';
import SupportDetailModal from './SupportDetailModal';
import './SupportTicketTable.scss';

interface SupportTicketTableProps {
  data: SupportTicketData[];
  onUpdate: () => void;
}

const SupportTicketTable: React.FC<SupportTicketTableProps> = ({ data, onUpdate }) => {
  const [selectedData, setSelectedData] = useState<SupportTicketData | null>(null);
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

  const handleViewClick = (rowData: SupportTicketData) => {
    setSelectedData(rowData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return '#D9534F';
      case 'In Progress':
        return '#F0AD4E';
      case 'Resolved':
        return '#5CB85C';
      case 'Closed':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const formatDate = (dateInput: string | { $date: string } | any) => {
    try {
      let dateString: string;
      if (typeof dateInput === 'object' && dateInput.$date) {
        dateString = dateInput.$date;
      } else if (typeof dateInput === 'string') {
        dateString = dateInput;
      } else {
        return 'N/A';
      }

      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'N/A';
    }
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
                <th>Ticket</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message Preview</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={`${item.email}-${index}`}>
                <td className="ticket-id-cell">{item.ticket_id ?? ((item as any)._id?.$oid ? (item as any)._id.$oid.slice(-6).toUpperCase() : '-')}</td>
                  <td className='name-cell'>{item.name}</td>
                  <td className='email-cell'>{item.email}</td>
                  <td className='message-cell'>{item.message}</td>
                  <td className='status-cell'>
                    <span
                      className='status-badge-with-color'
                      style={{
                        backgroundColor: getStatusColor(item.admin_status || 'New'),
                        color: 'white',
                      }}
                    >
                      {item.admin_status || 'New'}
                    </span>
                  </td>
                  <td className='submitted-at-cell'>{formatDate(item.created_at)}</td>
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
        <SupportDetailModal
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

export default SupportTicketTable;

'use client';

import React, { useState } from 'react';
import { SupportTicketData } from '@/app/types/support';
import { consultingApi } from '@/app/services/consultingApi';
import './SupportTicketCard.scss';

interface SupportTicketCardProps {
  data: SupportTicketData;
  onUpdate?: () => void;
}

const SupportTicketCard: React.FC<SupportTicketCardProps> = ({ data, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    admin_name: '',
    admin_status: data.admin_status || 'New',
    admin_comment: '',
  });

  const statusOptions = ['New', 'In Progress', 'Resolved', 'Closed'];

  const handleAdminUpdate = async () => {
    if (!data._id) return;

    setIsUpdating(true);
    try {
      const response = await consultingApi.updateSupportAdminStatus({
        ticket_id: (data as any)._id ?? String((data as any).ticket_id ?? ''),
        admin_name: adminFormData.admin_name,
        admin_status: adminFormData.admin_status,
        admin_comment: adminFormData.admin_comment,
      } as any);

      if (response.success) {
        setIsEditingAdmin(false);
        setAdminFormData({
          admin_name: '',
          admin_status: data.admin_status || 'New',
          admin_comment: '',
        });
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to update: ' + response.error);
      }
    } catch (_error) {
      alert('Error updating submission');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return '#6c757d';
      case 'In Progress':
        return '#ffc107';
      case 'Resolved':
        return '#17a2b8';
      case 'Closed':
        return '#343a40';
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
    <div className='submission-card'>
      <div className='card-header' onClick={() => setIsExpanded(!isExpanded)}>
        <div className='user-info'>
          <div className='user-details'>
            <h3 className='name'>{data.name}</h3>
            <h3 className='name'>{data.ticket_id ? <span className='ticket-badge'>#{data.ticket_id}</span> : null}</h3>
            <div className='contact-info'>
              <span className='email'>{data.email}</span>
            </div>
          </div>
        </div>

        <div className='card-meta'>
          <span
            className='admin-status'
            style={{
              backgroundColor: getStatusColor(data.admin_status || 'New'),
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          >
            {data.admin_status || 'New'}
          </span>
          <span className='date'>{(data as any).created_at ? formatDate((data as any).created_at) : 'N/A'}</span>
          <button className='expand-btn'>{isExpanded ? '−' : '+'}</button>
        </div>
      </div>

      
      {isExpanded && (
        <div className='admin-section'>
          <div className='admin-header'>
            <h4>Admin Management</h4>
            {!isEditingAdmin ? (
              <button className='edit-btn' onClick={() => setIsEditingAdmin(true)}>
                Edit Status
              </button>
            ) : (
              <div className='admin-actions'>
                <button className='save-btn' onClick={handleAdminUpdate} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
                <button
                  className='cancel-btn'
                  onClick={() => {
                    setIsEditingAdmin(false);
                    setAdminFormData({
                      admin_name: '',
                      admin_status: data.admin_status || 'New',
                      admin_comment: '',
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!isEditingAdmin ? (
            <div className='admin-display'>
              <div className='admin-item'>
                <label>Current Status:</label>
                <span style={{ color: getStatusColor(data.admin_status || 'New'), fontWeight: 'bold' }}>{data.admin_status || 'New'}</span>
              </div>
              {data.admin_updated_at && (
                <div className='admin-item'>
                  <label>Last Updated:</label>
                  <span>{formatDate(data.admin_updated_at)}</span>
                </div>
              )}

              {/* Comment Timeline */}
              {data.admin_comments && data.admin_comments.length > 0 && (
                <div className='admin-timeline'>
                  <label>Timeline:</label>
                  <div className='timeline-container'>
                    {data.admin_comments
                      .slice()
                      .reverse()
                      .map((comment, index) => (
                        <div key={index} className='timeline-item'>
                          <div className='timeline-header'>
                            <span className='timeline-admin'>{comment.admin_name}</span>
                            <span className='timeline-date'>{formatDate(comment.timestamp)}</span>
                            <span className='timeline-status' style={{ backgroundColor: getStatusColor(comment.status), color: 'white' }}>
                              {comment.status}
                            </span>
                          </div>
                          {comment.comment && <div className='timeline-comment'>{comment.comment}</div>}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='admin-form'>
              <div className='form-row'>
                <div className='form-group'>
                  <label>Admin Name:</label>
                  <input
                    type='text'
                    value={adminFormData.admin_name}
                    onChange={(e) => setAdminFormData({ ...adminFormData, admin_name: e.target.value })}
                    placeholder='Enter your name'
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Status:</label>
                  <select value={adminFormData.admin_status} onChange={(e) => setAdminFormData({ ...adminFormData, admin_status: e.target.value })}>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <label>Comments:</label>
                <textarea
                  value={adminFormData.admin_comment}
                  onChange={(e) => setAdminFormData({ ...adminFormData, admin_comment: e.target.value })}
                  placeholder='Add comments about this submission...'
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportTicketCard;

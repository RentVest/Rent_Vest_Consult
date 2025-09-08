'use client';

import React from 'react';
import Image from 'next/image';
import { SupportTicketData } from '@/app/types/support';
import { consultingApi } from '@/app/services/consultingApi';
import './SupportDetailModal.scss';

import emailIcon from '@/public/email.svg';
import close from '@/public/close.svg';
import add from '@/public/add-blue.svg';

interface SupportDetailModalProps {
  data: SupportTicketData;
  onClose: () => void;
  onUpdate: () => void;
}

const SupportDetailModal: React.FC<SupportDetailModalProps> = ({ data, onClose, onUpdate }) => {
  const [isEditingAdmin, setIsEditingAdmin] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [adminFormData, setAdminFormData] = React.useState({
    admin_name: '',
    admin_status: data.admin_status || 'New',
    admin_comment: '',
  });

  // Close on Escape
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onUpdate();
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose, onUpdate]);

  const formatDate = (dateInput: string | { $date: string } | any) => {
    try {
      if (!dateInput) return 'N/A';
      const raw = typeof dateInput === 'object' && dateInput.$date ? dateInput.$date : dateInput;
      return new Date(raw).toLocaleString('en-US', {
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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onUpdate();
      onClose();
    }
  };

  const handleAdminUpdate = async () => {
    if (!data._id) return;

    // Clear previous validation errors
    setValidationErrors({});

    // Validate
    const errors: Record<string, string> = {};
    if (!adminFormData.admin_name.trim()) errors.admin_name = 'Please enter your admin name.';
    if (!adminFormData.admin_comment.trim()) errors.admin_comment = 'Please enter a comment.';
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsUpdating(true);
    try {
      // The API expects ticket_id; map from _id and include admin_comment.
      const payload = {
        submission_id: data._id,
        admin_name: adminFormData.admin_name,
        admin_status: adminFormData.admin_status,
        admin_comment: adminFormData.admin_comment,
      } as any;

      const response = await consultingApi.updateSupportAdminStatus(payload);
      if (response.success) {
        setIsEditingAdmin(false);
        setAdminFormData({ admin_name: '', admin_status: adminFormData.admin_status, admin_comment: '' });
        alert('Comment submitted successfully! Please reload the page to see the update.');
        onUpdate();
      } else {
        alert('Failed to update: ' + response.error);
      }
    } catch (_error) {
      alert('Error updating ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='modal-overlay' onClick={handleOverlayClick}>
      <div className='modal-container'>
        <div className='modal-header'>
          <div className='header-content'>
            <div className='user-info'>
              <h2>
                {data.name}
                {data.ticket_id ? <span className='ticket-badge'>#{data.ticket_id}</span> : null}
              </h2>
              <span className='submitted-date'>Submitted {data.created_at ? formatDate(data.created_at) : 'N/A'}</span>
            </div>
            <div className='header-actions'>
              <button
                className='close-btn'
                onClick={() => {
                  onUpdate();
                  onClose();
                }}
              >
                <Image src={close} alt='Close' width={12} height={12} />
              </button>
            </div>
          </div>
        </div>

        <div className='modal-content'>
          <div className='left-panel'>
            <div className='contact-section'>
              <h3>Summary</h3>
              <div className='contact-cards'>
                <div className='contact-card'>
                  <div className='card-icon'>
                    <Image src={emailIcon} alt='Email' width={20} height={20} />
                  </div>
                  <div className='card-content'>
                    <span className='card-label'>Email</span>
                    <span className='card-value'>{data.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='details-section'>
              <div className='details-grid-modern'>
                <div className='detail-card'>
                  <span className='detail-label'>Message</span>
                  <div className='detail-content'>
                    <div className='detail-row'>
                      <span className='value'>{data.message || 'No message provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Admin/TImeLine (same as Consulting) */}
          <div className='right-panel'>
            <div className='admin-section'>
              <div className='admin-header'>
                <h3>Admin Management</h3>
                <p>Status: {data.admin_status || 'New'}</p>
              </div>

              {!isEditingAdmin ? (
                <div className='admin-display'>
                  <div className='status-management'>
                    <button className='edit-status-btn' onClick={() => setIsEditingAdmin(true)}>
                      <Image src={add} alt='Add' width={16} height={16} /> Add Note
                    </button>
                  </div>
                </div>
              ) : (
                <div className='admin-form'>
                  <div className='form-group'>
                    <label>Admin Name:</label>
                    <input
                      type='text'
                      value={adminFormData.admin_name}
                      onChange={(e) => setAdminFormData({ ...adminFormData, admin_name: e.target.value })}
                      placeholder='Enter your name'
                      className={validationErrors.admin_name ? 'error' : ''}
                      required
                    />
                    {validationErrors.admin_name && <div className='error-message'>{validationErrors.admin_name}</div>}
                  </div>
                  <div className='form-group'>
                    <label>Status:</label>
                    <select value={adminFormData.admin_status} onChange={(e) => setAdminFormData({ ...adminFormData, admin_status: e.target.value })}>
                      {['New', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='form-group'>
                    <label>Comments:</label>
                    <textarea
                      value={adminFormData.admin_comment}
                      onChange={(e) => setAdminFormData({ ...adminFormData, admin_comment: e.target.value })}
                      placeholder='Add comments about this ticket...'
                      className={validationErrors.admin_comment ? 'error' : ''}
                      rows={3}
                    />
                    {validationErrors.admin_comment && <div className='error-message'>{validationErrors.admin_comment}</div>}
                  </div>
                  <div className='form-actions'>
                    <button
                      className='cancel-btn'
                      onClick={() => {
                        setIsEditingAdmin(false);
                        setValidationErrors({});
                        setAdminFormData({ admin_name: '', admin_status: data.admin_status || 'New', admin_comment: '' });
                      }}
                    >
                      Cancel
                    </button>
                    <button className='save-btn' onClick={handleAdminUpdate} disabled={isUpdating}>
                      {isUpdating ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Section */}
            <div className='timeline-section'>
              <h3>Activity Timeline</h3>
              {data.admin_comments && data.admin_comments.length > 0 ? (
                <div className='timeline-container'>
                  {data.admin_comments
                    .slice()
                    .reverse()
                    .map((comment, index) => (
                      <div key={index} className='timeline-item'>
                        <div className='timeline-marker'></div>
                        <div className='timeline-content'>
                          <div className='timeline-card'>
                            <div className='timeline-header'>
                              <div className='admin-info'>
                                <span className='timeline-admin'>{comment.admin_name}</span>
                                <p className='timeline-status'>Status: {comment.status}</p>
                              </div>
                              <span className='timeline-date'>{formatDate(comment.timestamp)}</span>
                            </div>
                            {comment.comment && (
                              <div className='timeline-comment'>
                                <p className='comment-text'>{comment.comment}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className='empty-timeline'>
                  <h4>No Activity Yet</h4>
                  <p>😔 No admin notes yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDetailModal;



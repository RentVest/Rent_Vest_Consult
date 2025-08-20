'use client';

import React, { useState } from 'react';
import { FormData } from '@/app/types/form';
import { consultingApi } from '@/app/services/consultingApi';
import './ConsultingDetailModal.scss';
import email from '@/public/email.svg';
import phone from '@/public/phone.svg';
import Image from 'next/image';
import close from '@/public/close.svg';
import add from '@/public/add-blue.svg';

interface ConsultingDetailModalProps {
  data: FormData;
  onClose: () => void;
  onUpdate: () => void;
}

const ConsultingDetailModal: React.FC<ConsultingDetailModalProps> = ({ data, onClose, onUpdate }) => {
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localData, setLocalData] = useState(() => ({ ...data })); // Local state for optimistic updates
  const [adminFormData, setAdminFormData] = useState({
    admin_name: '',
    admin_status: localData.admin_status || 'New',
    admin_comment: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onUpdate();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose, onUpdate]);

  // Sync localData when data prop changes
  React.useEffect(() => {
    setLocalData({ ...data });
  }, [data]);

  const statusOptions = ['New', 'In Review', 'Contacted', 'Matched', 'Closed', 'Follow-up Required'];

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

  const handleAdminUpdate = async () => {
    if (!localData._id) return;

    // Clear previous validation errors
    setValidationErrors({});

    // Validation
    const errors: Record<string, string> = {};

    if (!adminFormData.admin_name.trim()) {
      errors.admin_name = 'Please enter your admin name.';
    }

    if (!adminFormData.admin_comment.trim()) {
      errors.admin_comment = 'Please enter a comment.';
    }

    // If there are validation errors, set them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsUpdating(true);

    try {
      const response = await consultingApi.updateAdminStatus({
        submission_id: localData._id,
        admin_name: adminFormData.admin_name,
        admin_status: adminFormData.admin_status,
        admin_comment: adminFormData.admin_comment,
      });

      if (response.success) {
        setIsEditingAdmin(false);
        setAdminFormData({
          admin_name: '',
          admin_status: adminFormData.admin_status,
          admin_comment: '',
        });
        alert('Comment submitted successfully! Please reload the page to see the update.');
      } else {
        alert('Failed to update: ' + response.error);
      }
    } catch (_error) {
      alert('Error updating submission');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onUpdate();
      onClose();
    }
  };

  return (
    <div className='modal-overlay' onClick={handleOverlayClick}>
      <div className='modal-container'>
        <div className='modal-header'>
          <div className='header-content'>
            <div className='user-info'>
              <h2>
                {localData.name}
                <div className='user-meta'>
                  <span className={`user-type-badge ${localData.userType || ''}`}>
                    {localData.userType ? localData.userType.charAt(0).toUpperCase() + localData.userType.slice(1) : 'Unknown'}
                  </span>
                </div>
              </h2>

              <span className='submitted-date'>Submitted {(localData as any).created_at ? formatDate((localData as any).created_at) : 'N/A'}</span>
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
          {/* Left Panel - Details */}
          <div className='left-panel'>
            <div className='contact-section'>
              <h3>Summary</h3>
              <div className='contact-cards'>
                <div className='contact-card'>
                  <div className='card-icon'>
                    <Image src={email} alt='Email' width={20} height={20} />
                  </div>
                  <div className='card-content'>
                    <span className='card-label'>Email</span>
                    <span className='card-value'>{localData.email}</span>
                  </div>
                </div>
                <div className='contact-card'>
                  <div className='card-icon'>
                    <Image src={phone} alt='Phone' width={20} height={20} />
                  </div>
                  <div className='card-content'>
                    <span className='card-label'>Phone</span>
                    <span className='card-value'>{localData.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {localData.userType === 'tenant' && localData.tenantPreferences && (
              <div className='details-section'>
                <div className='details-grid-modern'>
                  <div className='detail-card'>
                    <span className='detail-label'>Housing & Budget</span>
                    <div className='detail-content'>
                      <div className='detail-row'>
                        <span className='key'>Type</span>
                        <span className='value'>{localData.tenantPreferences.housingType || 'Not specified'}</span>
                      </div>
                      <div className='detail-row'>
                        <span className='key'>Budget</span>
                        <span className='value highlight'>{localData.tenantPreferences.budget || 'Not specified'}</span>
                      </div>
                      <div className='detail-row'>
                        <span className='key'>Location</span>
                        <span className='value'>{localData.tenantPreferences.location || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className='detail-card'>
                    <span className='detail-label'>Timeline & Terms</span>
                    <div className='detail-content'>
                      <div className='detail-row'>
                        <span className='key'>Move-in</span>
                        <span className='value'>{localData.tenantPreferences.moveInTime || 'Not specified'}</span>
                      </div>
                      <div className='detail-row'>
                        <span className='key'>Lease Length</span>
                        <span className='value'>{localData.tenantPreferences.leaseLength || 'Not specified'}</span>
                      </div>
                      <div className='detail-row'>
                        <span className='key'>Rent-to-Own</span>
                        <span className='value'>{localData.tenantPreferences.rentToOwn || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className='detail-card'>
                    <span className='detail-label'>Personal Info</span>
                    <div className='detail-content'>
                      <div className='detail-row'>
                        <span className='key'>Profession</span>
                        <span className='value'>{localData.tenantPreferences.profession || 'Not specified'}</span>
                      </div>
                      <div className='detail-row'>
                        <span className='key'>Pets</span>
                        <span className='value'>{localData.tenantPreferences.hasPets || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {localData.tenantPreferences.requirements && (
                  <div className='requirements-card'>
                    <span className='requirements-label'>Additional Requirements</span>
                    <p className='requirements-text'>{localData.tenantPreferences.requirements}</p>
                  </div>
                )}
              </div>
            )}

            {localData.userType === 'landlord' && localData.landlordDetails && (
              <div className='details-section'>
                <div className='details-grid-modern'>
                  <div className='detail-card'>
                    <span className='detail-label'>Property Info</span>
                    <div className='detail-content'>
                      <div className='detail-row'>
                        <span className='key'>Type</span>
                        <span className='value'>{localData.landlordDetails.propertyType || 'Not specified'}</span>
                      </div>
                      <div className='detail-row'>
                        <span className='key'>Rent</span>
                        <span className='value highlight'>{localData.landlordDetails.rent || 'Not specified'}</span>
                      </div>
                      <div className='detail-row'>
                        <span className='key'>Availability</span>
                        <span className='value'>{localData.landlordDetails.availability || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className='detail-card'>
                    <span className='detail-label'>Terms & Options</span>
                    <div className='detail-content'>
                      <div className='detail-row'>
                        <span className='key'>Rent-to-Own</span>
                        <span className='value'>{localData.landlordDetails.rentToOwn || 'Not specified'}</span>
                      </div>
                      <div className='detail-row'>
                        <span className='key'>Utilities</span>
                        <span className='value'>{localData.landlordDetails.utilitiesIncluded || 'Not specified'}</span>
                      </div>
                      <div className='detail-row'>
                        <span className='key'>Lease Options</span>
                        <span className='value'>
                          {localData.landlordDetails.leaseLength && localData.landlordDetails.leaseLength.length > 0
                            ? localData.landlordDetails.leaseLength.join(', ')
                            : 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='detail-card'>
                    <span className='detail-label'>Services</span>
                    <div className='detail-content'>
                      <div className='detail-row'>
                        <span className='key'>Screening Help</span>
                        <span className='value'>{localData.landlordDetails.screeningHelp || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {(localData.landlordDetails.requirements || localData.landlordDetails.concerns) && (
                  <div className='additional-info'>
                    {localData.landlordDetails.requirements && (
                      <div className='requirements-card'>
                        <span className='requirements-label'>Requirements</span>
                        <p className='requirements-text'>{localData.landlordDetails.requirements}</p>
                      </div>
                    )}
                    {localData.landlordDetails.concerns && (
                      <div className='requirements-card'>
                        <span className='requirements-label'>Concerns</span>
                        <p className='requirements-text'>{localData.landlordDetails.concerns}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Timeline/Comments */}
          <div className='right-panel'>
            <div className='admin-section'>
              <div className='admin-header'>
                <h3>Admin Management</h3>
                <p>Status: {localData.admin_status || 'New'}</p>
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
                      {statusOptions.map((status) => (
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
                      placeholder='Add comments about this submission...'
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
                        setAdminFormData({
                          admin_name: '',
                          admin_status: localData.admin_status || 'New',
                          admin_comment: '',
                        });
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
              {localData.admin_comments && localData.admin_comments.length > 0 ? (
                <div className='timeline-container'>
                  {localData.admin_comments
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
                  <p>😔 Which means BD/Marketing team haven&apos;t done their work yet.😔</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultingDetailModal;

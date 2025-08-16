'use client';

import React, { useState } from 'react';
import { FormData } from '@/app/types/form';
import './ConsultingDataCard.scss';

interface ConsultingDataCardProps {
  data: FormData;
}

const ConsultingDataCard: React.FC<ConsultingDataCardProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log(data);

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
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
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
            <div className='contact-info'>
              <span className='email'>{data.email}</span>
              <span className='phone'>{data.phoneNumber}</span>
            </div>
          </div>
        </div>

        <div className='card-meta'>
          <span className={`user-type ${data.userType}`}>{data.userType.charAt(0).toUpperCase() + data.userType.slice(1)}</span>
          <span className='date'>{(data as any).created_at ? formatDate((data as any).created_at) : 'N/A'}</span>
          <button className='expand-btn'>{isExpanded ? '−' : '+'}</button>
        </div>
      </div>

      <div className='card-summary'>
        {data.userType === 'tenant' && data.tenantPreferences && (
          <div className='summary-info'>
            <span>
              <strong>Location:</strong> {data.tenantPreferences.location || 'Not specified'}
            </span>
            <span>
              <strong>Budget:</strong> {data.tenantPreferences.budget || 'Not specified'}
            </span>
            <span>
              <strong>Housing:</strong> {data.tenantPreferences.housingType || 'Not specified'}
            </span>
          </div>
        )}
        {data.userType === 'landlord' && data.landlordDetails && (
          <div className='summary-info'>
            <span>
              <strong>Property:</strong> {data.landlordDetails.propertyType || 'Not specified'}
            </span>
            <span>
              <strong>Rent:</strong> {data.landlordDetails.rent || 'Not specified'}
            </span>
            <span>
              <strong>Availability:</strong> {data.landlordDetails.availability || 'Not specified'}
            </span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className='card-details'>
          {data.userType === 'tenant' && data.tenantPreferences && (
            <div className='details-content'>
              <h4>Tenant Preferences</h4>
              <div className='details-grid'>
                <div className='detail-item'>
                  <label>Housing Type:</label>
                  <span>{data.tenantPreferences.housingType || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Move-in Time:</label>
                  <span>{data.tenantPreferences.moveInTime || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Lease Length:</label>
                  <span>{data.tenantPreferences.leaseLength || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Pets:</label>
                  <span>{data.tenantPreferences.hasPets || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Profession:</label>
                  <span>{data.tenantPreferences.profession || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Rent-to-Own:</label>
                  <span>{data.tenantPreferences.rentToOwn || 'Not specified'}</span>
                </div>
              </div>
              {data.tenantPreferences.requirements && (
                <div className='notes'>
                  <label>Requirements:</label>
                  <p>{data.tenantPreferences.requirements}</p>
                </div>
              )}
            </div>
          )}

          {data.userType === 'landlord' && data.landlordDetails && (
            <div className='details-content'>
              <h4>Landlord Details</h4>
              <div className='details-grid'>
                <div className='detail-item'>
                  <label>Property Type:</label>
                  <span>{data.landlordDetails.propertyType || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Rent:</label>
                  <span>{data.landlordDetails.rent || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Availability:</label>
                  <span>{data.landlordDetails.availability || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Rent-to-Own:</label>
                  <span>{data.landlordDetails.rentToOwn || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Utilities:</label>
                  <span>{data.landlordDetails.utilitiesIncluded || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Screening Help:</label>
                  <span>{data.landlordDetails.screeningHelp || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <label>Lease Options:</label>
                  <span>
                    {data.landlordDetails.leaseLength && data.landlordDetails.leaseLength.length > 0
                      ? data.landlordDetails.leaseLength.join(', ')
                      : 'Not specified'}
                  </span>
                </div>
              </div>
              {data.landlordDetails.requirements && (
                <div className='notes'>
                  <label>Requirements:</label>
                  <p>{data.landlordDetails.requirements}</p>
                </div>
              )}
              {data.landlordDetails.concerns && (
                <div className='notes'>
                  <label>Concerns:</label>
                  <p>{data.landlordDetails.concerns}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultingDataCard;

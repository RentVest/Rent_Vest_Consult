'use client';

// React and Next.js imports
import React from 'react';

// Types and interfaces
import { FormData, TenantPreferences, LandlordDetails } from '@/app/types/form';

// Components
import WidgetLoader from '@/app/reusable/WidgetLoader';
import RequirementsDropdown from './RequirementsDropdown';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AddressAutocomplete } from '@/app/components/LocationAutocomplete';

// Styles
import './consult-form.scss';

// Interface for Step2 component props
interface Step2Props {
  formData: FormData;
  validationErrors: Record<string, string>;
  updateTenantField: (field: keyof TenantPreferences, value: string) => void;
  updateLandlordField: (field: keyof LandlordDetails, value: string | string[]) => void;
  handleLeaseLengthChange: (value: string, checked: boolean) => void;
  goBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submissionError?: string | null;
}

// Step 2 component - collects detailed preferences based on user type (Tenant/Landlord)
const ConsultFormDetail: React.FC<Step2Props> = ({
  formData,
  validationErrors,
  updateTenantField,
  updateLandlordField,
  handleLeaseLengthChange,
  goBack,
  onSubmit,
  isSubmitting = false,
  submissionError = null,
}) => {
  // Tenant form - collects housing preferences and requirements
  if (formData.userType === 'tenant') {
    return (
      <div className='form-section'>
        {/* Form header with back button and title */}
        <div className='form-header-small'>
          <button type='button' onClick={goBack} className='back-button'>
            ← Back
          </button>
          <h4>
            Your Housing Search Details <span>Tenant</span>
          </h4>
        </div>

        {/* Housing type selection */}
        <div className='form-group'>
          <label htmlFor='housingType'>What type of housing are you looking for?</label>
          <select
            id='housingType'
            value={formData.tenantPreferences?.housingType || ''}
            onChange={(e) => updateTenantField('housingType', e.target.value)}
            className={validationErrors.housingType ? 'error' : ''}
          >
            <option value=''>Select housing type</option>
            <option value='Apartment'>Apartment</option>
            <option value='Condo'>Condo</option>
            <option value='Single-family home'>Single-family home</option>
            <option value='Shared housing / Roommate'>Shared housing / Roommate</option>
            <option value='No preference'>No preference</option>
          </select>
          {validationErrors.housingType && <div className='error-message'>{validationErrors.housingType}</div>}
        </div>

        {/* Budget input field */}
        <div className='form-group'>
          <label htmlFor='budget'>What&apos;s your ideal monthly rent budget (USD)?</label>
          <input
            type='text'
            id='budget'
            value={formData.tenantPreferences?.budget || ''}
            onChange={(e) => updateTenantField('budget', e.target.value)}
            placeholder='1000'
            className={validationErrors.budget ? 'error' : ''}
          />
          {validationErrors.budget && <div className='error-message'>{validationErrors.budget}</div>}
        </div>

        {/* Location preference */}
        <div className='form-group'>
          <label htmlFor='location'>What city/neighborhood are you looking in?</label>
          <APIProvider apiKey={process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY || ''}>
            <AddressAutocomplete
              value={formData.tenantPreferences?.location || ''}
              onChange={(value) => updateTenantField('location', value)}
              className={validationErrors.location ? 'error' : ''}
            />
            {validationErrors.location && <div className='error-message'>{validationErrors.location}</div>}
          </APIProvider>
        </div>

        {/* Move-in timeline */}
        <div className='form-group'>
          <label htmlFor='moveInTime'>When would you like to move in?</label>
          <select
            id='moveInTime'
            value={formData.tenantPreferences?.moveInTime || ''}
            onChange={(e) => updateTenantField('moveInTime', e.target.value)}
            className={validationErrors.moveInTime ? 'error' : ''}
          >
            <option value=''>Select move-in time</option>
            <option value='Immediately'>Immediately</option>
            <option value='Within 30 days'>Within 30 days</option>
            <option value='1-3 months'>1-3 months</option>
            <option value='Flexible'>Flexible</option>
          </select>
          {validationErrors.moveInTime && <div className='error-message'>{validationErrors.moveInTime}</div>}
        </div>

        {/* Rent-to-own interest */}
        <div className='form-group'>
          <label htmlFor='rentToOwn'>Are you interested in rent-to-own options?</label>
          <select id='rentToOwn' value={formData.tenantPreferences?.rentToOwn || ''} onChange={(e) => updateTenantField('rentToOwn', e.target.value)}>
            <option value=''>Select option</option>
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
            <option value="Maybe / I'd like to learn more">Maybe / I&apos;d like to learn more</option>
          </select>
        </div>

        {/* Lease length preference */}
        <div className='form-group'>
          <label htmlFor='leaseLength'>What is your ideal lease length?</label>
          <select
            id='leaseLength'
            value={formData.tenantPreferences?.leaseLength || ''}
            onChange={(e) => updateTenantField('leaseLength', e.target.value)}
          >
            <option value=''>Select lease length</option>
            <option value='Month-to-month'>Month-to-month</option>
            <option value='6 months'>6 months</option>
            <option value='12 months'>12 months</option>
            <option value='Longer than 12 months'>Longer than 12 months</option>
          </select>
        </div>

        {/* Pet ownership */}
        <div className='form-group'>
          <label>Do you have any pets?</label>
          <div className='selection-container'>
            {['Yes', 'No'].map((option) => (
              <div
                key={option}
                className={`selection ${formData.tenantPreferences?.hasPets === option ? 'selected' : ''}`}
                onClick={() => updateTenantField('hasPets', option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Professional status */}
        <div className='form-group'>
          <label htmlFor='profession'>Are you a student or working professional?</label>
          <select
            id='profession'
            value={formData.tenantPreferences?.profession || ''}
            onChange={(e) => updateTenantField('profession', e.target.value)}
          >
            <option value=''>Select option</option>
            <option value='Student'>Student</option>
            <option value='Working professional'>Working professional</option>
            <option value='Other'>Other</option>
          </select>
        </div>

        {/* Additional requirements */}
        <div className='form-group'>
          <label htmlFor='requirements'>Do you have any specific requirements or deal-breakers?</label>
          <textarea
            id='requirements'
            value={formData.tenantPreferences?.requirements || ''}
            onChange={(e) => updateTenantField('requirements', e.target.value)}
            placeholder='e.g., no stairs, washer/dryer, pet-friendly, close to subway'
            rows={3}
          />
        </div>

        {/* Error display */}
        {submissionError && (
          <div
            className='error-message'
            style={{
              color: '#e74c3c',
              backgroundColor: '#fdf2f2',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            <strong>Submission failed:</strong> {submissionError}
          </div>
        )}

        {/* Submit button */}
        <div className='form-submit'>
          <button type='submit' className='btn-primary' onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? <WidgetLoader color='light' /> : 'Submit'}
          </button>
        </div>
      </div>
    );
  }

  // Landlord form - collects property details and rental preferences
  if (formData.userType === 'landlord') {
    return (
      <div className='form-section'>
        {/* Form header with back button and title */}
        <div className='form-header-small'>
          <button type='button' onClick={goBack} className='back-button'>
            ← Back
          </button>
          <h4>
            Complete Property Listing Details <span>Landlord</span>
          </h4>
        </div>

        {/* Property type selection */}
        <div className='form-group'>
          <label htmlFor='propertyType'>What kind of property are you listing?</label>
          <select
            id='propertyType'
            value={formData.landlordDetails?.propertyType || ''}
            onChange={(e) => updateLandlordField('propertyType', e.target.value)}
            className={validationErrors.propertyType ? 'error' : ''}
          >
            <option value=''>Select property type</option>
            <option value='Apartment'>Apartment</option>
            <option value='Condo'>Condo</option>
            <option value='Single-family home'>Single-family home</option>
            <option value='Multi-unit building'>Multi-unit building</option>
            <option value='Other'>Other</option>
          </select>
          {validationErrors.propertyType && <div className='error-message'>{validationErrors.propertyType}</div>}
        </div>

        {/* Rental amount */}
        <div className='form-group'>
          <label htmlFor='rent'>What is your ideal monthly rent (USD)?</label>
          <input
            type='text'
            id='rent'
            value={formData.landlordDetails?.rent || ''}
            onChange={(e) => updateLandlordField('rent', e.target.value)}
            placeholder='1500'
            className={validationErrors.rent ? 'error' : ''}
          />
          {validationErrors.rent && <div className='error-message'>{validationErrors.rent}</div>}
        </div>

        {/* Property availability */}
        <div className='form-group'>
          <label htmlFor='availability'>Is your property currently...</label>
          <select
            id='availability'
            value={formData.landlordDetails?.availability || ''}
            onChange={(e) => updateLandlordField('availability', e.target.value)}
          >
            <option value=''>Select status</option>
            <option value='Vacant'>Vacant</option>
            <option value='Occupied but will be available soon'>Occupied but will be available soon</option>
            <option value='Occupied and not available for now'>Occupied and not available for now</option>
          </select>
        </div>

        {/* Rent-to-own options */}
        <div className='form-group'>
          <label htmlFor='rentToOwnLandlord'>Are you open to rent-to-own offers?</label>
          <select
            id='rentToOwnLandlord'
            value={formData.landlordDetails?.rentToOwn || ''}
            onChange={(e) => updateLandlordField('rentToOwn', e.target.value)}
          >
            <option value=''>Select option</option>
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
            <option value='Possibly / Need more info'>Possibly / Need more info</option>
          </select>
        </div>

        {/* Tenant requirements */}
        <div className='form-group'>
          <label htmlFor='requirements'>Do you require tenants to have a certain credit score or income threshold?</label>
          <RequirementsDropdown
            value={formData.landlordDetails?.requirements || ''}
            onChange={(value) => updateLandlordField('requirements', value)}
            placeholder='Select requirement'
            className={validationErrors.requirements ? 'error' : ''}
          />
          {validationErrors.requirements && <div className='error-message'>{validationErrors.requirements}</div>}
        </div>

        {/* Lease length options */}
        <div className='form-group'>
          <label>What lease lengths are you willing to offer?</label>
          <div className='checkbox-group'>
            {['Month-to-month', '6 months', '12 months', 'Longer'].map((option) => (
              <label key={option} className='checkbox-option'>
                <input
                  type='checkbox'
                  value={option}
                  checked={formData.landlordDetails?.leaseLength?.includes(option) || false}
                  onChange={(e) => handleLeaseLengthChange(option, e.target.checked)}
                />
                <span className='checkbox-checkmark'></span>
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Utilities inclusion */}
        <div className='form-group'>
          <label htmlFor='utilitiesIncluded'>Are utilities included in the rent?</label>
          <select
            id='utilitiesIncluded'
            value={formData.landlordDetails?.utilitiesIncluded || ''}
            onChange={(e) => updateLandlordField('utilitiesIncluded', e.target.value)}
          >
            <option value=''>Select option</option>
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
            <option value='Some (explain in notes)'>Some (explain in notes)</option>
          </select>
        </div>

        {/* Tenant screening help */}
        <div className='form-group'>
          <label htmlFor='screeningHelp'>Would you like help screening tenants?</label>
          <select
            id='screeningHelp'
            value={formData.landlordDetails?.screeningHelp || ''}
            onChange={(e) => updateLandlordField('screeningHelp', e.target.value)}
          >
            <option value=''>Select option</option>
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
            <option value='Not sure yet'>Not sure yet</option>
          </select>
        </div>

        {/* Additional concerns */}
        <div className='form-group'>
          <label htmlFor='concerns'>What other concerns or preferences do you have when renting out your property?</label>
          <textarea
            id='concerns'
            value={formData.landlordDetails?.concerns || ''}
            onChange={(e) => updateLandlordField('concerns', e.target.value)}
            placeholder='Share any other concerns or preferences'
            rows={3}
          />
        </div>

        {/* Error display */}
        {submissionError && (
          <div
            className='error-message'
            style={{
              color: '#e74c3c',
              backgroundColor: '#fdf2f2',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            <strong>Submission failed:</strong> {submissionError}
          </div>
        )}

        {/* Submit button */}
        <div className='form-submit'>
          <button type='submit' className='btn-primary' onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? <WidgetLoader color='light' /> : 'Submit'}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ConsultFormDetail;

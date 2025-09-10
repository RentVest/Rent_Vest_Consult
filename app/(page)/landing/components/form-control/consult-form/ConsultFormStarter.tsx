'use client';

// React and Next.js imports
import React from 'react';
import Image from 'next/image';

// Types and interfaces
import { FormData } from '@/app/types/form';

// Assets
import logo from '@/public/logo-full.png';

// Styles
import './consult-form.scss';

// Interface for Step1 component props
interface Step1Props {
  formData: FormData;
  validationErrors: Record<string, string>;
  updateFormField: (field: keyof FormData, value: string) => void;
  updateUserType: (type: string) => void;
  formatPhoneForDisplay: (value: string) => string;
  isStep1Complete: () => boolean;
  onContinue: () => void;
  onSupportClick: () => void;
}

// Step 1 component - collects basic user information and user type
const ConsultFormStarter: React.FC<Step1Props> = ({
  formData,
  validationErrors,
  updateFormField,
  updateUserType,
  formatPhoneForDisplay,
  isStep1Complete,
  onContinue,
  onSupportClick,
}) => {
  return (
    <div className='form-section'>
      {/* Form header with logo and title */}
      <div className='form-header-small'>
        <Image src={logo} alt='Logo' className='logo' />
        <h4>Get started for consultation</h4>
      </div>

      {/* Full name input field */}
      <div className='form-group'>
        <label htmlFor='name'>Full Name</label>
        <input
          type='text'
          id='name'
          value={formData.name}
          onChange={(e) => updateFormField('name', e.target.value)}
          placeholder='Enter your full name'
          className={validationErrors.name ? 'error' : ''}
          required
        />
        {validationErrors.name && <div className='error-message'>{validationErrors.name}</div>}
      </div>

      {/* Email address input field */}
      <div className='form-group'>
        <label htmlFor='email'>Email Address</label>
        <input
          type='email'
          id='email'
          value={formData.email}
          onChange={(e) => updateFormField('email', e.target.value)}
          placeholder='Enter your email address'
          className={validationErrors.email ? 'error' : ''}
          required
        />
        {validationErrors.email && <div className='error-message'>{validationErrors.email}</div>}
      </div>

      {/* Phone number input field with country prefix */}
      <div className='form-group'>
        <label htmlFor='phoneNumber'>Phone Number</label>
        <div className={`phone-input-wrapper ${validationErrors.phoneNumber ? 'error' : ''}`}>
          <span className='country-prefix'>+1</span>
          <input
            type='tel'
            id='phoneNumber'
            value={formData.phoneNumber}
            onChange={(e) => updateFormField('phoneNumber', formatPhoneForDisplay(e.target.value))}
            placeholder='123-456-7890'
            maxLength={12}
            required
          />
        </div>
        {validationErrors.phoneNumber && <div className='error-message'>{validationErrors.phoneNumber}</div>}
      </div>

      {/* User type selection (Landlord/Tenant) */}
      <div className='form-group'>
        <label htmlFor='userType'>Are you a...</label>

        <div className='selection-container'>
          <div
            className={`selection ${formData.userType === 'landlord' ? 'selected' : ''} ${validationErrors.userType ? 'error' : ''}`}
            onClick={() => updateUserType('landlord')}
          >
            Landlord / Owner
          </div>
          <div
            className={`selection ${formData.userType === 'tenant' ? 'selected' : ''} ${validationErrors.userType ? 'error' : ''}`}
            onClick={() => updateUserType('tenant')}
          >
            Prospective Tenant
          </div>
        </div>
        {validationErrors.userType && <div className='error-message'>{validationErrors.userType}</div>}
      </div>

      {/* Continue button - disabled until form is complete */}
      <button className='btn-primary --continue' disabled={!isStep1Complete()} onClick={onContinue} type='button'>
        Continue
      </button>

      <p className='support-link' onClick={onSupportClick}>
        Need support?
      </p>
    </div>
  );
};

export default ConsultFormStarter;

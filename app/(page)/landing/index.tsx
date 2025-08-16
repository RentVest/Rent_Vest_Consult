'use client';

// React and Next.js imports
import React from 'react';

// Styles
import './index.scss';

// Components
import InfoPanel from '@/app/(page)/landing/components/InfoPanel_V2';
import FormComponent from '@/app/(page)/landing/components/FormComponent';

// Main page component - RentVest consultation form
export default function FormPage() {
  return (
    <div className='form-page'>
      <InfoPanel />
      <FormComponent />
    </div>
  );
}

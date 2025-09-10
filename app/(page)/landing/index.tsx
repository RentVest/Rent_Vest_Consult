'use client';

// React and Next.js imports
import React from 'react';

// Styles
import './index.scss';

// Components
import InfoPanel from '@/app/(page)/landing/components/hero/Hero';
import FormComponent from '@/app/(page)/landing/components/form-control';

// Main page component - RentVest consultation form
export default function FormPage() {
  return (
    <div className='landing-page'>
      <InfoPanel />
      <FormComponent />
    </div>
  );
}

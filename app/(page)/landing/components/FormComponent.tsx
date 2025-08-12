'use client';

// React and Next.js imports
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hooks and utilities
import { useFormState } from '@/app/(page)/landing/components/useFormState';

// Components
import Step1Component from './Step1Component';
import Step2Component from './Step2Component';
import Confetti from '@/app/reusable/Confetti';

// Assets
import Check from '../../../../public/check.svg';

// Styles
import './FormComponent.scss';

// Main form component - handles multi-step consultation form with animations
const FormComponent: React.FC = () => {
  // State for tracking animation direction
  const [isGoingForward, setIsGoingForward] = React.useState(true);

  // Animation variants for bidirectional sliding
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    // exit: (direction: number) => ({
    //   x: direction > 0 ? 20 : -20,
    //   opacity: 0,
    // }),
  };

  // Form state management
  const {
    formData,
    currentStep,
    setCurrentStep,
    validationErrors,
    updateFormField,
    updateUserType,
    updateTenantField,
    updateLandlordField,
    handleLeaseLengthChange,
    formatPhoneForDisplay,
    isStep1Complete,
    goBack,
  } = useFormState();

  // Local state for form submission
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Mock API call for form submission
  const submitFormData = async () => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form submitted:', formData);
    return { success: true };
  };

  // Handle form submission with loading state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitFormData();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleContinue = () => {
    setIsGoingForward(true);
    setCurrentStep(2);
  };

  const handleGoBack = () => {
    setIsGoingForward(false);
    goBack();
  };

  // Success screen component
  if (isSubmitted) {
    return (
      <div className='form-panel'>
        <Confetti />
        <div className='form-container'>
          <motion.div key='success'>
            <div className='form-section success-section'>
              <div className='success-icon'>
                <Image src={Check} alt='Check' />
              </div>
              <h2 className='success-title'>Thank You!</h2>
              <p className='success-message'>Your consultation request has been submitted successfully.</p>
              <div className='success-confirmation'>
                <p className='confirmation-email'>📧 Please check your email for confirmation</p>
                <p className='confirmation-followup'>We&apos;ll be in touch shortly to discuss your requirements.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main form component with step navigation
  return (
    <div className='form-panel'>
      <div className='form-container'>
        <form onSubmit={handleSubmit} className='rental-form'>
          <div>
            <AnimatePresence initial={false} mode='wait' custom={isGoingForward ? 1 : -1}>
              {currentStep === 1 && (
                <motion.div
                  key='step1'
                  custom={isGoingForward ? 1 : -1}
                  variants={slideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Step1Component
                    formData={formData}
                    validationErrors={validationErrors}
                    updateFormField={updateFormField}
                    updateUserType={updateUserType}
                    formatPhoneForDisplay={formatPhoneForDisplay}
                    isStep1Complete={isStep1Complete}
                    onContinue={handleContinue}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key='step2'
                  custom={isGoingForward ? 1 : -1}
                  variants={slideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Step2Component
                    formData={formData}
                    validationErrors={validationErrors}
                    updateTenantField={updateTenantField}
                    updateLandlordField={updateLandlordField}
                    handleLeaseLengthChange={handleLeaseLengthChange}
                    goBack={handleGoBack}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;

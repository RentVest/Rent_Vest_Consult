'use client';

// React and Next.js imports
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Utilities
import { consultingApi } from '@/app/services/consultingApi';

// Components
import WidgetLoader from '@/app/reusable/WidgetLoader';

// Assets
import Check from '@/public/check.svg';

// Interface for Support Ticket data structure
interface SupportTicketData {
  name: string;
  email: string;
  message: string;
}

// Interface for SupportForm component props
interface SupportFormProps {
  onBackToForm: () => void;
}

// Support form success screen component
const SupportFormSuccess: React.FC<{
  onBackToForm: () => void;
  lastTicketId: string | null;
  onReset: () => void;
}> = ({ onBackToForm, lastTicketId, onReset }) => {
  const handleOK = () => {
    onReset();
    onBackToForm();
  };

  return (
    <div className='form-panel'>
      <div className='form-container'>
        <motion.div key='support-success'>
          <div className='form-section success-section'>
            <div className='success-icon'>
              <Image src={Check} alt='Check' />
            </div>
            <h2 className='success-title'>Thank You!</h2>
            <p className='success-message'>Your support ticket has been submitted successfully.</p>
            {lastTicketId ? (
              <p className='success-message'>
                Ticket ID: <strong>#{lastTicketId}</strong>
              </p>
            ) : null}
            <div className='success-confirmation'>
              <p className='confirmation-followup'>Our team will review your ticket and get back to you shortly!</p>
            </div>
            <button className='btn-primary --close' onClick={handleOK} style={{ marginTop: '20px' }}>
              OK
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Support form component
const SupportForm: React.FC<SupportFormProps> = ({ onBackToForm }) => {
  // State for form data - stores user input values
  const [supportFormData, setSupportFormData] = useState<SupportTicketData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastTicketId, setLastTicketId] = useState<string | null>(null);

  // Updates the form data and clears any validation errors for the specified field
  const updateSupportFormField = (field: keyof SupportTicketData, value: string) => {
    setSupportFormData({ ...supportFormData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const isFormComplete = () => Boolean(supportFormData.name.trim() && supportFormData.email.trim() && supportFormData.message.trim());

  /**
   * Validates the form data and sets validation errors
   * @returns - True if the form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!supportFormData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!supportFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(supportFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!supportFormData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with loading state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await consultingApi.submitSupportTicket(supportFormData);

      if (result.success) {
        setIsSubmitted(true);
        const tId = (result.data as any)?.ticket_id ?? (result.data as any)?.id ?? null;
        setLastTicketId(tId != null ? String(tId) : null);
        console.log('Submission successful with Ticket ID:', tId);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert(error instanceof Error ? error.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSupportFormData({
      name: '',
      email: '',
      message: '',
    });
    setErrors({});
    setLastTicketId(null);
  };

  if (isSubmitted) {
    return <SupportFormSuccess onBackToForm={onBackToForm} lastTicketId={lastTicketId} onReset={resetForm} />;
  }

  return (
    <div className='form-panel'>
      <div className='form-container'>
        <motion.div key='support-form'>
          <div className='form-section'>
            {/* Form header with back button */}
            <div className='go-back-to-form' onClick={onBackToForm}>
              ← Back
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full name input field */}
              <div className='form-group'>
                <label htmlFor='support-name'>Full Name</label>
                <input
                  type='text'
                  id='support-name'
                  value={supportFormData.name}
                  onChange={(e) => updateSupportFormField('name', e.target.value)}
                  placeholder='Enter your full name'
                  className={errors.name ? 'error' : ''}
                  required
                />
                {errors.name && <div className='error-message'>{errors.name}</div>}
              </div>

              {/* Email address input field */}
              <div className='form-group'>
                <label htmlFor='support-email'>Email Address</label>
                <input
                  type='email'
                  id='support-email'
                  value={supportFormData.email}
                  onChange={(e) => updateSupportFormField('email', e.target.value)}
                  placeholder='Enter your email address'
                  className={errors.email ? 'error' : ''}
                  required
                />
                {errors.email && <div className='error-message'>{errors.email}</div>}
              </div>

              {/* Message textarea field */}
              <div className='form-group'>
                <label htmlFor='support-message'>Message</label>
                <textarea
                  id='support-message'
                  value={supportFormData.message}
                  onChange={(e) => updateSupportFormField('message', e.target.value)}
                  placeholder='Please describe your concerns or questions...'
                  className={errors.message ? 'error' : ''}
                  rows={4}
                  required
                />
                {errors.message && <div className='error-message'>{errors.message}</div>}
              </div>

              {/* Submit button */}
              <div className='form-submit'>
                <button type='submit' className='btn-primary' onClick={handleSubmit} disabled={isSubmitting || !isFormComplete()}>
                  {isSubmitting ? <WidgetLoader color='light' /> : 'Submit'}
                </button>
              </div>

              <p className='support-followup'>We will get back to you shortly via email.</p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main SupportForm component that handles both form and success states
const SupportFormContainer: React.FC<SupportFormProps> = ({ onBackToForm }) => {
  return <SupportForm onBackToForm={onBackToForm} />;
};

export default SupportFormContainer;

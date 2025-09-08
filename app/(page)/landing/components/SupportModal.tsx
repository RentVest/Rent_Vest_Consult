'use client';

// React and Next.js imports
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

//utilities
import { consultingApi } from '@/app/services/consultingApi';

// Components
import WidgetLoader from '@/app/reusable/WidgetLoader';
// Assets
import logo from '@/public/logo-full.png';
import close from '@/public/close.svg';
import Check from '../../../../public/check.svg';
// Styles
import './SupportModal.scss';

// Interface for Support Ticket data structure
interface SupportTicketData {
  name: string;
  email: string;
  message: string;
}

// Props interface for Support Ticket component
interface SupportTicketProps {
  isOpen: boolean;
  onClose: () => void;
}

// Modal form component for users to submit support requests
const SupportModal: React.FC<SupportTicketProps> = ({ isOpen, onClose }) => {
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
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isFormComplete = () => Boolean(
    supportFormData.name.trim() &&
    supportFormData.email.trim() &&
    supportFormData.message.trim()
  );

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
  }

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

  if (!isOpen) return null;

  return (
    <div className='modal-overlay'
      //onClick={onClose}
    >
      <div className='modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Submission success message */}
        {isSubmitted ? (
          <div className='modal-success'>
            <motion.div key='success'>
            <div className='form-section success-section'>
              <div className='success-icon'>
                <Image src={Check} alt='Check' />
              </div>
              <h2 className='success-title'>Thank You!</h2>
              <p className='success-message'>Your support ticket has been submitted successfully.</p>
              {lastTicketId ? (
                <p className='success-message'>Ticket ID: <strong>#{lastTicketId}</strong></p>
              ) : null}
              <div className='success-confirmation'>
                {/*<p className='confirmation-email'>📧 Please check your email for confirmation</p>*/}
                <p className='confirmation-followup'>Our team will review your ticket and get back to you shortly!</p>
              </div>
            </div>
          </motion.div>
            <button 
              className='btn-primary --close' 
              onClick={() => {
                setIsSubmitted(false);
                setSupportFormData({
                  name: '',
                  email: '',
                  message: '',
                });
                onClose();
              }} 
              >OK</button>
          </div>
        ) : (
          <>
            {/* Form header with logo and title */}
            <div className='modal-header'>
              <Image src={logo} alt='Logo' className='logo' />
              <h4>How can we help you?</h4>
              <button 
                className='close-button' 
                onClick={onClose} 
                type='button'
              >
                <Image src={close} width={16} height={16} alt='Close' className='close-icon' />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full name input field */}
              <div className='form-group'>
                <label htmlFor='name'>Full Name</label>
                <input
                  type='text'
                  id='name'
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
                <label htmlFor='email'>Email Address</label>
                <input
                  type='email'
                  id='email'
                  value={supportFormData.email}
                  onChange={(e) => updateSupportFormField('email', e.target.value)}
                  placeholder='Enter your email address'
                  className={errors.email ? 'error' : ''}
                  required
                />
                {errors.email && <div className='error-message'>{errors.email}</div>}
              </div>

              {/* Concerns textarea field */}
              <div className='form-group'>
                <label htmlFor='message'>Message</label>
                <textarea
                  id='message'
                  value={supportFormData.message}
                  onChange={(e) => updateSupportFormField('message', e.target.value)}
                  placeholder='Please describe your concerns or questions...'
                  className={errors.message ? 'error' : ''}
                  rows={4}
                  required
                />
                {errors.message && <div className='error-message'>{errors.message}</div>}
              </div>

              {/* Continue button - disabled until form is complete */}
              <div className='form-submit'>
                <button type='submit' className='btn-primary' onClick={handleSubmit} disabled={isSubmitting || !isFormComplete()}>
                  {isSubmitting ? <WidgetLoader color='light' /> : 'Submit'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportModal;

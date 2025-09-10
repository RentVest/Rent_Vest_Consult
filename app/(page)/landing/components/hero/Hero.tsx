'use client';

// React and Next.js imports
import React from 'react';
import Image from 'next/image';

// Assets
import linkWhite from '@/public/link-white.svg';
import link from '@/public/link.svg';

// Styles
import './hero.scss';

// Information panel component - displays consultation details and partner information
const InfoPanel: React.FC = () => {
  return (
    <div className='hero-info'>
      <div className='info-content'>
        {/* Consultation banner */}
        <p className='banner'>Consultation</p>

        {/* Main information text */}
        <div className='info-text'>
          <h2>Connect with perfect tenants or find your dream home</h2>
          <p>
            Rent Vest connects tenants and landlords directly, cutting out costly agent fees and delays. Our free consultation gives you tailored
            recommendations and a clear plan to confidently take your next step.
          </p>
        </div>

        {/* Call-to-action buttons */}
        <div className='cta-buttons'>
          <button
            type='button'
            className='cta-button'
            onClick={() => window.open('https://calendly.com/iven-rentvest/30min?month=2025-09', '_blank')}
          >
            Request Demo
            <Image src={linkWhite} alt='Link' className='link-image' />
          </button>

          <button type='button' className='cta-button  --outline' onClick={() => window.open('https://rentvest.io/', '_blank')}>
            About us
            <Image src={link} alt='Question Mark' className='question-mark' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;

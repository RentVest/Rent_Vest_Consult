'use client';

// React and Next.js imports
import React from 'react';
import Image from 'next/image';

// Assets
import linkWhite from '@/public/link-white.svg';

import check from '@/public/check.svg';

// Styles
import './InfoPanel-v2.scss';

// Information panel component - displays consultation details and partner information
const InfoPanel: React.FC = () => {
  return (
    <div className='info-panel'>
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

          <div className='features'>
            <span>
              <Image src={check} alt='Check' className='check-image' />
              100% transparent pricing
            </span>
            <span>
              <Image src={check} alt='Check' className='check-image' />
              0% agent fees
            </span>
            <span>
              <Image src={check} alt='Check' className='check-image' />
              3x faster leasing process
            </span>
          </div>
        </div>

        {/* Call-to-action buttons */}
        <div className='cta-buttons'>
          <button type='button' className='cta-button' onClick={() => window.open('https://rentvest.io/', '_blank')}>
            About us
            <Image src={linkWhite} alt='Link' className='link-image' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;

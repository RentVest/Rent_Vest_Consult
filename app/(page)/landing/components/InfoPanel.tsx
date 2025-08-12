'use client';

// React and Next.js imports
import React from 'react';
import Image from 'next/image';

// Assets
import linkWhite from '@/public/link-white.svg';
import link from '@/public/link.svg';
import stripe from '@/public/stripe.svg';
import tu from '@/public/transunion.svg';
import sign from '@/public/sign.svg';

// Styles
import './InfoPanel.scss';

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
            Get personalized assistance through our expert consultation service to find the perfect rental match for your specific requirements and
            preferences.
          </p>

          {/* Partner section */}
          <h5>We partner with:</h5>

          {/* Partner logos */}
          <div className='features'>
            <Image src={stripe} alt='Stripe' className='feature-image' />
            <div className='separator' />
            <Image src={tu} alt='TransUnion' className='feature-image --tu' />
            <div className='separator' />
            <Image src={sign} alt='Sign' className='feature-image' />
          </div>
        </div>

        {/* Call-to-action buttons */}
        <div className='cta-buttons'>
          <button type='button' className='cta-button' onClick={() => window.open('https://www.rentnvest.com', '_blank')}>
            Our Platform
            <Image src={linkWhite} alt='Link' className='link-image' />
          </button>

          <button type='button' className='cta-button --outline' onClick={() => window.open('https://rentvest.io/', '_blank')}>
            About us
            <Image src={link} alt='Link' className='link-image' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;

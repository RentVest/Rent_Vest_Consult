// React and Next.js imports
import React from 'react';

// Styles
import './loader.scss';

// WidgetLoader props interface
interface WidgetLoaderProps {
  color?: 'light' | 'dark';
}

// WidgetLoader component - displays spinner loader with color variants
const Loader = ({ color = 'dark' }: WidgetLoaderProps) => {
  return (
    <svg viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg' className={`spinner-loader --${color}`}>
      <circle cx='20' cy='20' r='18' strokeLinecap='round' strokeWidth='3' strokeLinejoin='round' stroke='white' />
    </svg>
  );
};

export default Loader;

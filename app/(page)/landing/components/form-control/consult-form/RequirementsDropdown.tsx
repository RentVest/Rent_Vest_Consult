'use client';

import React, { useState } from 'react';

interface RequirementsDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const RequirementsDropdown: React.FC<RequirementsDropdownProps> = ({ value, onChange, className = '', placeholder = 'Select requirement' }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const predefinedOptions = [
    { value: '600 (credit score)', label: '600 (credit score)' },
    { value: '650 (credit score)', label: '650 (credit score)' },
    { value: '700 (credit score)', label: '700 (credit score)' },
    { value: '3x (income)', label: '3x (income)' },
    { value: '2.5x (income)', label: '2.5x (income)' },
    { value: '4x (income)', label: '4x (income)' },
    { value: 'No credit score required, but proof of credit history', label: 'No credit score required, but proof of credit history' },
    { value: 'other', label: 'Other (specify)' },
  ];

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'other') {
      setShowCustomInput(true);
      setCustomValue(value && !predefinedOptions.some((opt) => opt.value === value) ? value : '');
    } else {
      setShowCustomInput(false);
      setCustomValue('');
      onChange(selectedValue);
    }
  };

  const handleCustomInputChange = (customInput: string) => {
    setCustomValue(customInput);
    onChange(customInput);
  };

  // Check if current value is a predefined option
  const currentValue = predefinedOptions.some((opt) => opt.value === value) ? value : 'other';

  React.useEffect(() => {
    if (value && !predefinedOptions.some((opt) => opt.value === value)) {
      setShowCustomInput(true);
      setCustomValue(value);
    }
  }, [value]);

  return (
    <div>
      <select value={currentValue} onChange={(e) => handleSelectChange(e.target.value)} className={className}>
        <option value=''>{placeholder}</option>
        {predefinedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {showCustomInput && (
        <input
          type='text'
          value={customValue}
          onChange={(e) => handleCustomInputChange(e.target.value)}
          placeholder='Enter custom requirement'
          className={`${className} mt-2`}
          style={{ marginTop: '8px' }}
        />
      )}
    </div>
  );
};

export default RequirementsDropdown;

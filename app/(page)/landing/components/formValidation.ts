// Validation utilities for RentVest consultation form

import { FormData, TenantPreferences, LandlordDetails } from '../../../types/form';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Individual field validators
export const validateRequiredField = (value: string, fieldName: string): string | null => {
  if (!value?.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim()) {
    return 'Email is required';
  }
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePhoneNumber = (phone: string): string | null => {
  const cleanedPhone = phone?.replace(/\D/g, '') || '';
  if (!cleanedPhone) {
    return 'Phone number is required';
  }
  if (cleanedPhone.length !== 10) {
    return 'Phone number must be 10 digits';
  }
  return null;
};

export const validateUserType = (userType: string): string | null => {
  if (!userType?.trim()) {
    return 'Please select whether you are a landlord or tenant';
  }
  if (!['landlord', 'tenant'].includes(userType)) {
    return 'Please select a valid user type';
  }
  return null;
};

export const validateBudget = (budget: string): string | null => {
  if (!budget?.trim()) {
    return 'Budget is required';
  }
  const numericValue = parseFloat(budget);
  if (isNaN(numericValue)) {
    return 'Budget must be a valid number';
  }
  if (numericValue < 0) {
    return 'Budget cannot be negative';
  }
  if (numericValue < 100) {
    return 'Budget should be at least $100';
  }
  if (numericValue > 10000) {
    return 'Budget cannot exceed $10,000';
  }
  return null;
};

export const validateRent = (rent: string): string | null => {
  if (!rent?.trim()) {
    return 'Rent amount is required';
  }
  const numericValue = parseFloat(rent);
  if (isNaN(numericValue)) {
    return 'Rent must be a valid number';
  }
  if (numericValue < 0) {
    return 'Rent cannot be negative';
  }
  if (numericValue < 100) {
    return 'Rent should be at least $100';
  }
  if (numericValue > 10000) {
    return 'Rent cannot exceed $10,000';
  }
  return null;
};

// Step 1 validation
export const validateStep1 = (formData: FormData): ValidationResult => {
  const errors: Record<string, string> = {};

  const nameError = validateRequiredField(formData.name, 'Full name');
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhoneNumber(formData.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;

  const userTypeError = validateUserType(formData.userType);
  if (userTypeError) errors.userType = userTypeError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Tenant preferences validation
export const validateTenantPreferences = (tenantPreferences: TenantPreferences): ValidationResult => {
  const errors: Record<string, string> = {};

  const housingTypeError = validateRequiredField(tenantPreferences.housingType, 'Housing type');
  if (housingTypeError) errors.housingType = housingTypeError;

  const locationError = validateRequiredField(tenantPreferences.location, 'Location');
  if (locationError) errors.location = locationError;

  const moveInTimeError = validateRequiredField(tenantPreferences.moveInTime, 'Move-in time');
  if (moveInTimeError) errors.moveInTime = moveInTimeError;

  const rentToOwnError = validateRequiredField(tenantPreferences.rentToOwn, 'Rent-to-own preference');
  if (rentToOwnError) errors.rentToOwn = rentToOwnError;

  const leaseLengthError = validateRequiredField(tenantPreferences.leaseLength, 'Lease length');
  if (leaseLengthError) errors.leaseLength = leaseLengthError;

  const hasPetsError = validateRequiredField(tenantPreferences.hasPets, 'Pet information');
  if (hasPetsError) errors.hasPets = hasPetsError;

  const professionError = validateRequiredField(tenantPreferences.profession, 'Profession');
  if (professionError) errors.profession = professionError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Landlord details validation
export const validateLandlordDetails = (landlordDetails: LandlordDetails): ValidationResult => {
  const errors: Record<string, string> = {};

  const propertyTypeError = validateRequiredField(landlordDetails.propertyType, 'Property type');
  if (propertyTypeError) errors.propertyType = propertyTypeError;

  const availabilityError = validateRequiredField(landlordDetails.availability, 'Property availability');
  if (availabilityError) errors.availability = availabilityError;

  const rentToOwnError = validateRequiredField(landlordDetails.rentToOwn, 'Rent-to-own preference');
  if (rentToOwnError) errors.rentToOwn = rentToOwnError;

  const utilitiesIncludedError = validateRequiredField(landlordDetails.utilitiesIncluded, 'Utilities information');
  if (utilitiesIncludedError) errors.utilitiesIncluded = utilitiesIncludedError;

  const screeningHelpError = validateRequiredField(landlordDetails.screeningHelp, 'Screening help preference');
  if (screeningHelpError) errors.screeningHelp = screeningHelpError;

  // Validate lease length array (at least one option should be selected)
  if (!landlordDetails.leaseLength || landlordDetails.leaseLength.length === 0) {
    errors.leaseLength = 'Please select at least one lease length option';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Step 2 validation (handles both tenant and landlord)
export const validateStep2 = (formData: FormData): ValidationResult => {
  if (formData.userType === 'tenant' && formData.tenantPreferences) {
    return validateTenantPreferences(formData.tenantPreferences);
  }
  
  if (formData.userType === 'landlord' && formData.landlordDetails) {
    return validateLandlordDetails(formData.landlordDetails);
  }

  return {
    isValid: false,
    errors: { general: 'Invalid form data structure' },
  };
};

// Real-time validation for individual fields
export const validateFieldRealTime = (field: string, value: string): string | null => {
  switch (field) {
    case 'name':
      return validateRequiredField(value, 'Full name');
    case 'email':
      return validateEmail(value);
    case 'phoneNumber':
      return validatePhoneNumber(value);
    case 'userType':
      return validateUserType(value);
    
    // Tenant fields
    case 'housingType':
      return validateRequiredField(value, 'Housing type');
    case 'budget':
      return validateBudget(value);
    case 'location':
      return validateRequiredField(value, 'Location');
    case 'moveInTime':
      return validateRequiredField(value, 'Move-in time');
    case 'rentToOwn':
      return validateRequiredField(value, 'Rent-to-own preference');
    case 'leaseLength':
      return validateRequiredField(value, 'Lease length');
    case 'hasPets':
      return validateRequiredField(value, 'Pet information');
    case 'profession':
      return validateRequiredField(value, 'Profession');
    
    // Landlord fields
    case 'propertyType':
      return validateRequiredField(value, 'Property type');
    case 'rent':
      return validateRent(value);
    case 'availability':
      return validateRequiredField(value, 'Property availability');
    case 'landlordRentToOwn':
      return validateRequiredField(value, 'Rent-to-own preference');
    case 'utilitiesIncluded':
      return validateRequiredField(value, 'Utilities information');
    case 'screeningHelp':
      return validateRequiredField(value, 'Screening help preference');
    case 'landlordLeaseLength':
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return 'Please select at least one lease length option';
      }
      return null;
    
    default:
      return null;
  }
};

// Check if form has minimum required data for enabling continue/submit button
export const hasMinimumRequiredDataStep1 = (formData: FormData): boolean => {
  return Boolean(
    formData.name?.trim() &&
    formData.email?.trim() &&
    formData.phoneNumber?.trim() &&
    formData.userType?.trim()
  );
};

export const hasMinimumRequiredDataStep2 = (formData: FormData): boolean => {
  if (formData.userType === 'tenant' && formData.tenantPreferences) {
    return Boolean(
      formData.tenantPreferences.housingType?.trim() &&
      formData.tenantPreferences.location?.trim() &&
      formData.tenantPreferences.moveInTime?.trim() &&
      formData.tenantPreferences.rentToOwn?.trim() &&
      formData.tenantPreferences.leaseLength?.trim() &&
      formData.tenantPreferences.hasPets?.trim() &&
      formData.tenantPreferences.profession?.trim()
    );
  }

  if (formData.userType === 'landlord' && formData.landlordDetails) {
    return Boolean(
      formData.landlordDetails.propertyType?.trim() &&
      formData.landlordDetails.availability?.trim() &&
      formData.landlordDetails.rentToOwn?.trim() &&
      formData.landlordDetails.utilitiesIncluded?.trim() &&
      formData.landlordDetails.screeningHelp?.trim() &&
      formData.landlordDetails.leaseLength?.length > 0
    );
  }

  return false;
};
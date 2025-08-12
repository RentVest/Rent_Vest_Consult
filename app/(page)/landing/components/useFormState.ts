import { useState } from 'react';
import { FormData, TenantPreferences, LandlordDetails } from '@/app/types/form';
import { 
  validateStep1, 
  validateStep2, 
  validateFieldRealTime, 
  hasMinimumRequiredDataStep1, 
  hasMinimumRequiredDataStep2 
} from './formValidation';

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    userType: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Update basic form fields with real-time validation
  const updateFormField = (field: keyof FormData, value: string) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedFormData);

    // Real-time validation
    const error = validateFieldRealTime(field, value);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    } else if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Update user type selection with real-time validation
  const updateUserType = (type: string) => {
    console.log('updateUserType called with:', type);
    if (!type) return;
    const updatedFormData = {
      ...formData,
      userType: type,
      ...(type === 'tenant' && {
        tenantPreferences: {
          housingType: '',
          budget: '1000',
          location: '',
          moveInTime: '',
          rentToOwn: '',
          leaseLength: '',
          hasPets: '',
          profession: '',
          requirements: '',
        },
      }),
      ...(type === 'landlord' && {
        landlordDetails: {
          propertyType: '',
          rent: '1500',
          availability: '',
          rentToOwn: '',
          requirements: '',
          leaseLength: [],
          utilitiesIncluded: '',
          screeningHelp: '',
          concerns: '',
        },
      }),
    };
    setFormData(updatedFormData);
    console.log('FormData updated:', updatedFormData);

    // Real-time validation for user type
    const error = validateFieldRealTime('userType', type);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, userType: error }));
    } else if (validationErrors.userType) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.userType;
        return newErrors;
      });
    }
  };

  // Update tenant preferences with real-time validation
  const updateTenantField = (field: keyof TenantPreferences, value: string) => {
    if (!formData.tenantPreferences) return;
    const updatedFormData = {
      ...formData,
      tenantPreferences: {
        ...formData.tenantPreferences,
        [field]: value,
      },
    };
    setFormData(updatedFormData);

    // Real-time validation
    const error = validateFieldRealTime(field, value);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    } else if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Update landlord details with real-time validation
  const updateLandlordField = (field: keyof LandlordDetails, value: string | string[]) => {
    if (!formData.landlordDetails) return;
    const updatedFormData = {
      ...formData,
      landlordDetails: {
        ...formData.landlordDetails,
        [field]: value,
      },
    };
    setFormData(updatedFormData);

    // Real-time validation
    const error = validateFieldRealTime(field, value as string);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    } else if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle lease length checkbox changes for landlords
  const handleLeaseLengthChange = (value: string, checked: boolean) => {
    if (!formData.landlordDetails) return;
    const currentLengths = formData.landlordDetails.leaseLength || [];
    const newLengths = checked ? [...currentLengths, value] : currentLengths.filter((length) => length !== value);
    updateLandlordField('leaseLength', newLengths);
  };

  // Phone number formatting utility
  const formatPhoneForDisplay = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  // Check if Step 1 is complete
  const isStep1Complete = () => {
    return hasMinimumRequiredDataStep1(formData) && Object.keys(validationErrors).length === 0;
  };

  // Check if Step 2 is complete
  const isStep2Complete = () => {
    return hasMinimumRequiredDataStep2(formData) && Object.keys(validationErrors).length === 0;
  };

  // Validate entire forms
  const validateStep1Form = () => {
    const result = validateStep1(formData);
    setValidationErrors(result.errors);
    return result.isValid;
  };

  const validateStep2Form = () => {
    const result = validateStep2(formData);
    setValidationErrors(result.errors);
    return result.isValid;
  };

  // Reset form to go back
  const goBack = () => {
    setCurrentStep(1);
    // Keep the user type selection when going back
    setFormData({ 
      name: formData.name, 
      email: formData.email, 
      phoneNumber: formData.phoneNumber, 
      userType: formData.userType 
    });
    setValidationErrors({});
  };

  return {
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
    isStep2Complete,
    validateStep1Form,
    validateStep2Form,
    goBack,
  };
};
// Form data interfaces
export interface TenantPreferences {
  housingType: string;
  budget: string;
  location: string;
  moveInTime: string;
  rentToOwn: string;
  leaseLength: string;
  hasPets: string;
  profession: string;
  requirements: string;
}

export interface LandlordDetails {
  propertyType: string;
  rent: string;
  availability: string;
  rentToOwn: string;
  requirements: string;
  leaseLength: string[];
  utilitiesIncluded: string;
  screeningHelp: string;
  concerns: string;
}

export interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  userType: string;
  tenantPreferences?: TenantPreferences;
  landlordDetails?: LandlordDetails;
}
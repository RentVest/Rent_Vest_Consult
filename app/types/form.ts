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

export interface AdminComment {
  admin_name: string;
  comment: string;
  status: string;
  timestamp: string;
}

export interface FormData {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: string;
  tenantPreferences?: TenantPreferences;
  landlordDetails?: LandlordDetails;
  created_at?: string;
  updated_at?: string;
  admin_status?: string;
  admin_comments?: AdminComment[];
  admin_updated_at?: string;
}

export interface AdminUpdateData {
  submission_id: string;
  admin_name: string;
  admin_status: string;
  admin_comment?: string;
}
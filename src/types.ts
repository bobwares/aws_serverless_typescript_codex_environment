// App: CustomerAPI
// Directory: src
// File: types.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: TypeScript types for customer profile.

export interface PhoneNumber {
  type: 'mobile' | 'home' | 'work' | 'other';
  number: string;
}

export interface PostalAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PrivacySettings {
  marketingEmailsEnabled: boolean;
  twoFactorEnabled: boolean;
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emails: string[];
  phoneNumbers?: PhoneNumber[];
  address?: PostalAddress;
  privacySettings: PrivacySettings;
}

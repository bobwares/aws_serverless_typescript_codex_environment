// App: CustomerAPI
// Directory: test/unit
// File: validate.test.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Tests for schema validation helper.

import { validateProfile } from '../../src/utils/validate';
import type { CustomerProfile } from '../../src/types';

describe('validateProfile', () => {
  it('accepts a valid profile', () => {
    const profile: CustomerProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'Jane',
      lastName: 'Doe',
      emails: ['jane@example.com'],
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false }
    };
    expect(() => validateProfile(profile)).not.toThrow();
  });

  it('throws for invalid data', () => {
    expect(() => validateProfile({})).toThrow();
  });
});

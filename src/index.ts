// App: CustomerAPI
// Directory: src
// File: index.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Lambda handler exports.

export { handler as createCustomer } from './handlers/createCustomer';
export { handler as getCustomer } from './handlers/getCustomer';
export { handler as updateCustomer } from './handlers/updateCustomer';
export { handler as patchCustomer } from './handlers/patchCustomer';
export { handler as deleteCustomer } from './handlers/deleteCustomer';
export { handler as searchCustomers } from './handlers/searchCustomers';
export { handler as getOperationStatus } from './handlers/getOperationStatus';

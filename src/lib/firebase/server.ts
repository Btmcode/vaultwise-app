// This file is intentionally left simple to avoid initialization issues.
// The actual Firebase Admin SDK initialization is handled in the API
// routes or server components that need it, ensuring that environment
// variables are loaded correctly before the SDK is initialized.

// You can re-export auth or other services if needed, but avoid
// calling initializeApp() at the top level of this module.
// For this simple case, we don't need to export anything as the
// API routes will handle their own initialization.
export {};

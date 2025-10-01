"use client";

import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// This configuration now securely reads directly from process.env.
// These variables are baked in at build time by Next.js.
const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Centralized function to get the client-side Firebase app instance.
// This uses a singleton pattern to ensure the app is only initialized once.
export const getClientApp = () => {
    if (getApps().length) {
        return getApp();
    }

    // This is a critical check. If the API key is not available, it means
    // the environment variables are not set correctly in the deployment environment.
    if (!firebaseConfig.apiKey) {
        const errorMessage = "CRITICAL: Firebase client configuration is not available. Check that NEXT_PUBLIC_FIREBASE_API_KEY environment variable is set and accessible in your deployment environment.";
        console.error(errorMessage);
        // We throw an error here to fail fast and make debugging clear.
        // This will stop the app from loading, making the error impossible to miss.
        throw new Error(errorMessage);
    }
    
    return initializeApp(firebaseConfig);
}

// Get the app instance using our singleton function
const app = getClientApp();
// Export the auth module for use in other client components
export const auth = getAuth(app);
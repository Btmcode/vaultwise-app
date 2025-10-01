"use client";
import { getClientApp } from "@/lib/firebase/client";
import type { ReactNode } from 'react';

// This provider's sole purpose is to ensure that the Firebase app is initialized
// on the client side before any other client components try to use it.
export function FirebaseProvider({ children }: { children: ReactNode }) {
  // Initialize the app. This function uses a singleton pattern so it's safe to call.
  getClientApp(); 
  
  return <>{children}</>;
}

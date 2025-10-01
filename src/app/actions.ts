
'use server';

import {
  generateSavingsGoalSuggestion,
  type AutomatedSavingsGoalInput,
  type AutomatedSavingsGoalOutput,
} from '@/ai/flows/automated-savings-goal-suggestions';
import {
  analyzeFeedback as analyzeFeedbackFlow,
  type FeedbackAnalysisInput,
  type FeedbackAnalysisOutput,
} from '@/ai/flows/feedback-analysis';
import {
  getMarketAnalysis as getMarketAnalysisFlow,
  type MarketAnalysisInput,
  type MarketAnalysisOutput,
} from '@/ai/flows/market-analysis';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {getAdminApp} from '@/lib/firebase/server';
import {getAuth} from 'firebase-admin/auth';
import {createNewUserDoc} from '@/lib/firebase/firestore';

export async function getAutomatedSavingsGoal(
  input: AutomatedSavingsGoalInput
): Promise<AutomatedSavingsGoalOutput> {
  // In a real app, you would add user authentication checks here.
  const suggestion = await generateSavingsGoalSuggestion(input);
  return suggestion;
}

export async function analyzeFeedback(
  input: FeedbackAnalysisInput
): Promise<FeedbackAnalysisOutput> {
  // In a real app, you would add user authentication checks here.
  const analysis = await analyzeFeedbackFlow(input);
  return analysis;
}

export async function getMarketAnalysis(
  input: MarketAnalysisInput
): Promise<MarketAnalysisOutput> {
  const analysis = await getMarketAnalysisFlow(input);
  return analysis;
}

export async function logout() {
  // Set the cookie to an empty value and expire it immediately.
  // This is a more robust way to ensure the browser deletes it.
  cookies().set('firebase-session', '', {
      expires: new Date(0),
      maxAge: -1, 
      path: '/', 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
  });

  // Redirect to the base path, middleware will handle language.
  redirect('/');
}

// This function creates the session cookie. It's the critical link between client-side auth and server-side sessions.
async function createSessionCookie(idToken: string) {
  const adminApp = getAdminApp();
  const adminAuth = getAuth(adminApp);
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    cookies().set('firebase-session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Session Cookie Creation Error:', error);
    // This is a critical server error, the client should know it failed.
    return { error: `Server-side session creation failed: ${error.message}` };
  }
}

// The login action now only needs to create the session cookie.
// The client handles the initial sign-in.
export async function loginWithEmail({ idToken }: { idToken: string; }): Promise<{error?: string}> {
  const result = await createSessionCookie(idToken);
  if (result.error) {
     return { error: result.error };
  }
  return {};
}

export async function signupWithEmail({ email, password, }: { email: string; password: string; }): Promise<{error?: string, idToken?: string}> {
  try {
    const adminApp = getAdminApp();
    const adminAuth = getAuth(adminApp);

    // 1. Create the user in Firebase Auth using the Admin SDK
    const userRecord = await adminAuth.createUser({
        email,
        password,
    });
    
    // 2. Create the corresponding user document in Firestore
    await createNewUserDoc(userRecord);

    // 3. Create a custom token for the new user. This allows them to sign in immediately
    // without needing to re-enter their password.
    const customToken = await adminAuth.createCustomToken(userRecord.uid);
    
    // 4. Exchange the custom token for an ID token on the server.
    // This is more secure than doing it on the client.
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error('FATAL: Firebase API Key is not configured on the server.');
    }

    const tokenResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    });

    const tokenResult = await tokenResponse.json();
    if (!tokenResponse.ok) {
        // If this fails, delete the created user to allow them to try again.
        await adminAuth.deleteUser(userRecord.uid);
        throw new Error(tokenResult.error.message || 'Failed to exchange custom token for ID token.');
    }
    
    // 5. Create the session cookie with the newly obtained ID token.
    await createSessionCookie(tokenResult.idToken);
    
    // Return the ID token so the client can finalize its state if needed.
    return { idToken: tokenResult.idToken };

  } catch (error: any) {
    console.error('Signup Action Unhandled Error:', error);
    
    let errorMessage = 'An unexpected server error occurred during signup. Please try again later.';
    // Provide user-friendly error messages based on the error code.
    if (error.code === 'auth/email-already-exists') {
        errorMessage = 'This email address is already in use.';
    } else if (error.code === 'auth/invalid-password') {
        errorMessage = 'Password must be at least 6 characters long.';
    } else if (error.message.includes('API key not valid')) {
        errorMessage = 'Server configuration error: The server-side API key is invalid. Please contact support.';
    }
    
    return { error: errorMessage };
  }
}

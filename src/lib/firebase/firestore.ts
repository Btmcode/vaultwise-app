
'use server';

import { getAdminApp } from '@/lib/firebase/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import type { IbanAccount, FirestoreUser, PortfolioAsset, Transaction, UserProfile } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { getAuth } from 'firebase-admin/auth';


async function getCurrentUserId(): Promise<string | null> {
  try {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const sessionCookie = await cookies().get('firebase-session');
    const sessionCookieValue = sessionCookie?.value;
    
    if (!sessionCookieValue) {
      console.log("No session cookie found.");
      return null;
    }
    const decodedToken = await auth.verifySessionCookie(sessionCookieValue, true);
    return decodedToken.uid;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

// Function to get the user document from Firestore
export async function getUserDoc(): Promise<FirestoreUser | null> {
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    
    const userId = await getCurrentUserId();
    if (!userId) {
        console.log("Could not get current user ID. User may not be logged in.");
        return null;
    };

    const userDocRef = db.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (userDocSnap.exists) {
        const data = userDocSnap.data() as any;
        // Convert Firestore Timestamps to serializable strings
        const transactions = data.transactions?.map((tx: any) => ({
            ...tx,
            date: tx.date.toDate().toISOString(),
        })) || [];
        
        // Sıfırlama mantığı: Portföydeki tüm varlıkların miktarını 0 yap
        const resetPortfolio = data.portfolio.map((asset: PortfolioAsset) => ({
            ...asset,
            amount: 0,
        }));

        return { ...data, portfolio: resetPortfolio, transactions, id: userDocSnap.id } as FirestoreUser;
    } else {
        console.log(`User document for ${userId} not found, creating one.`);
        const newUser: Omit<FirestoreUser, 'id'> = {
            name: 'Ali Veli',
            email: 'ali.veli@example.com',
            availableBalanceTRY: 150000.75,
            portfolio: [
                { assetSymbol: "BTC", amount: 0 },
                { assetSymbol: "XAU", amount: 0 },
                { assetSymbol: "PAXG", amount: 0 },
            ],
            ibanAccounts: [],
            transactions: [],
        };
        await userDocRef.set(newUser);
        
        const createdUserDoc = await userDocRef.get();
        const createdData = createdUserDoc.data() as any;
         const transactions = createdData.transactions?.map((tx: any) => ({
            ...tx,
            date: tx.date.toDate().toISOString(),
        })) || [];

        return { ...createdData, transactions, id: createdUserDoc.id } as FirestoreUser;
    }
}


export async function getIbanAccounts(): Promise<IbanAccount[]> {
    const userDoc = await getUserDoc();
    return userDoc?.ibanAccounts || [];
}

export async function addIbanAccount(account: Omit<IbanAccount, 'id'>): Promise<void> {
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");

    const newAccount: IbanAccount = { ...account, id: uuidv4() };
    const userDocRef = db.collection('users').doc(userId);
    await userDocRef.update({
        ibanAccounts: FieldValue.arrayUnion(newAccount)
    });
    revalidatePath('/[lang]/settings', 'page');
}

export async function removeIbanAccount(accountId: string): Promise<void> {
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);

    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const userDoc = await getUserDoc();
    if (!userDoc) throw new Error("User document not found");
    
    const accountToRemove = userDoc.ibanAccounts.find(acc => acc.id === accountId);
    if (!accountToRemove) return;

    const userDocRef = db.collection('users').doc(userId);
    await userDocRef.update({
        ibanAccounts: FieldValue.arrayRemove(accountToRemove)
    });
    revalidatePath('/[lang]/settings', 'page');
}

export async function getPortfolioAssets(): Promise<PortfolioAsset[]> {
    const userDoc = await getUserDoc();
    return userDoc?.portfolio || [];
}

export async function getTransactions(): Promise<Transaction[]> {
    const userDoc = await getUserDoc();
    // Ensure the date is returned as a Date object for server-side use, or ISO string for client
     return userDoc?.transactions.map(tx => ({...tx, date: new Date(tx.date)})) || [];
}

export async function getUserProfile(): Promise<Omit<UserProfile, 'id'> | null> {
    const userDoc = await getUserDoc();
    if (!userDoc) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, portfolio, ibanAccounts, transactions, ...profileData } = userDoc;
    return profileData;
}


'use server';

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { IbanAccount, FirestoreUser, PortfolioAsset, Transaction, UserProfile } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { getAdminApp, getCurrentUser } from '@/lib/firebase/server';

// Function to get the user document from Firestore
export async function getUserDoc(): Promise<FirestoreUser | null> {
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        console.log("Could not get current user. User may not be logged in.");
        return null;
    };
    const { uid, email } = currentUser;

    const userDocRef = db.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();

    if (userDocSnap.exists) {
        const data = userDocSnap.data() as any;
        // Convert Firestore Timestamps to serializable strings
        const transactions = data.transactions?.map((tx: any) => ({
            ...tx,
            date: tx.date.toDate().toISOString(),
        })) || [];
        
        return { ...data, transactions, id: userDocSnap.id } as FirestoreUser;
    } else {
        console.log(`User document for ${uid} not found, creating a new empty one.`);
        const newUser: Omit<FirestoreUser, 'id'> = {
            name: 'New User',
            email: email || 'user@example.com',
            availableBalanceTRY: 0,
            portfolio: [],
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
    
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    const newAccount: IbanAccount = { ...account, id: uuidv4() };
    const userDocRef = db.collection('users').doc(currentUser.uid);
    await userDocRef.update({
        ibanAccounts: FieldValue.arrayUnion(newAccount)
    });
    revalidatePath('/[lang]/settings', 'page');
    revalidatePath('/[lang]/deposit', 'page');
    revalidatePath('/[lang]/withdraw', 'page');
}

export async function removeIbanAccount(accountId: string): Promise<void> {
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);

    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");
    
    const userDoc = await getUserDoc();
    if (!userDoc) throw new Error("User document not found");
    
    const accountToRemove = userDoc.ibanAccounts.find(acc => acc.id === accountId);
    if (!accountToRemove) return;

    const userDocRef = db.collection('users').doc(currentUser.uid);
    await userDocRef.update({
        ibanAccounts: FieldValue.arrayRemove(accountToRemove)
    });
    revalidatePath('/[lang]/settings', 'page');
    revalidatePath('/[lang]/deposit', 'page');
    revalidatePath('/[lang]/withdraw', 'page');
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
    const { id, ...profileData } = userDoc;
    return profileData as Omit<UserProfile, 'id'>;
}


'use server';

import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getFirebaseServices } from './client';
import { revalidatePath } from 'next/cache';
import type { IbanAccount, FirestoreUser, PortfolioAsset, Transaction } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

async function getCurrentUserId(): Promise<string> {
    // This is a placeholder for getting the current user's ID.
    // In a real app, this would come from an authentication context.
    // For now, we will use a static ID, but this needs to be updated
    // when proper authentication is in place.
    return 'user-123-placeholder';
}


// Function to get the user document from Firestore
export async function getUserDoc(): Promise<FirestoreUser | null> {
    const { db } = getFirebaseServices();
    if (!db) return null;

    const userId = await getCurrentUserId();
    if (!userId) return null;

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data() as FirestoreUser;
    } else {
        // If the user document doesn't exist, create it with default values
        console.log(`User document for ${userId} not found, creating one.`);
        const newUser: FirestoreUser = {
            id: userId,
            name: 'Ali Veli',
            email: 'ali.veli@example.com',
            availableBalanceTRY: 150000.75,
            portfolio: [
                { assetSymbol: "BTC", amount: 0.5 },
                { assetSymbol: "XAU", amount: 10 },
                { assetSymbol: "PAXG", amount: 5 },
            ],
            ibanAccounts: [],
            transactions: [
                { id: "1", assetSymbol: "BTC", type: "Buy", amountUsd: 681.23, date: new Date("2024-05-20T10:00:00Z") },
                { id: "2", assetSymbol: "XAU", type: "Auto-Save", amountUsd: 100, date: new Date("2024-05-18T09:00:00Z") },
            ],
        };
        await setDoc(userDocRef, newUser);
        return newUser;
    }
}


export async function getIbanAccounts(): Promise<IbanAccount[]> {
    const userDoc = await getUserDoc();
    return userDoc?.ibanAccounts || [];
}

export async function addIbanAccount(account: Omit<IbanAccount, 'id'>): Promise<void> {
    const { db } = getFirebaseServices();
    if (!db) return;

    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");

    const newAccount: IbanAccount = { ...account, id: uuidv4() };
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
        ibanAccounts: arrayUnion(newAccount)
    });
    revalidatePath('/[lang]/settings', 'page');
}

export async function removeIbanAccount(accountId: string): Promise<void> {
    const { db } = getFirebaseServices();
    if (!db) return;

    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const userDoc = await getUserDoc();
    if (!userDoc) throw new Error("User document not found");
    
    const accountToRemove = userDoc.ibanAccounts.find(acc => acc.id === accountId);
    if (!accountToRemove) return;

    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
        ibanAccounts: arrayRemove(accountToRemove)
    });
    revalidatePath('/[lang]/settings', 'page');
}

export async function getPortfolioAssets(): Promise<PortfolioAsset[]> {
    const userDoc = await getUserDoc();
    return userDoc?.portfolio || [];
}

export async function getTransactions(): Promise<Transaction[]> {
    const userDoc = await getUserDoc();
    // Convert Firestore timestamps to Date objects if necessary
    return userDoc?.transactions.map(tx => ({...tx, date: new Date(tx.date)})) || [];
}

export async function getUserProfile(): Promise<Omit<FirestoreUser, 'portfolio' | 'ibanAccounts' | 'transactions'> | null> {
    const userDoc = await getUserDoc();
    if (!userDoc) return null;

    const { portfolio, ibanAccounts, transactions, ...profileData } = userDoc;
    return profileData;
}

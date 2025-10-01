
'use server';

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { IbanAccount, FirestoreUser, PortfolioAsset, Transaction, UserProfile } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { getAdminApp, getCurrentUser } from '@/lib/firebase/server';
import admin, { auth } from 'firebase-admin';

// Initialize the app and db ONCE at the module level (Singleton pattern)
const adminApp = getAdminApp();
const db = getFirestore(adminApp);


// This function is now intended for server-side use where session is guaranteed,
// for example in secure API routes.
export async function getUserDoc(uid: string): Promise<FirestoreUser | null> {
    if (!uid) {
        console.log("No UID provided to getUserDoc.");
        return null;
    }

    try {
        const userDocRef = db.collection('users').doc(uid);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const data = userDocSnap.data() as any;
            // Convert Firestore Timestamps to serializable strings
            const transactions = data.transactions?.map((tx: any) => ({
                ...tx,
                date: tx.date.toDate().toISOString(),
            })) || [];
            
            return { ...data, id: userDocSnap.id, transactions } as FirestoreUser;
        } else {
             console.log(`User document for ${uid} not found.`);
             return null;
        }
    } catch (error) {
        console.error("Error fetching user document from Firestore:", error);
        return null;
    }
}


// This function is now intended for server-side use where session is guaranteed.
export async function createNewUserDoc(user: admin.auth.UserRecord): Promise<FirestoreUser> {
    const userDocRef = db.collection('users').doc(user.uid);

    console.log(`LOG: Creating new user document for UID: ${user.uid}.`);
    const newUser: Omit<FirestoreUser, 'id'> = {
        name: user.displayName || 'New User',
        email: user.email!,
        photoURL: user.photoUrl || null,
        availableBalanceTRY: 0,
        portfolio: [
            { assetSymbol: 'XAU', amount: 2.5 },
            { assetSymbol: 'XAG', amount: 15 },
        ],
        ibanAccounts: [],
        transactions: [],
    };
    await userDocRef.set(newUser);
    
    return { ...newUser, id: user.uid };
}


export async function getIbanAccounts(): Promise<IbanAccount[]> {
    const user = await getCurrentUser();
    if (!user) return [];
    const userDoc = await getUserDoc(user.uid);
    return userDoc?.ibanAccounts || [];
}

export async function addIbanAccount(account: Omit<IbanAccount, 'id'>): Promise<void> {
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
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");
    
    const userDoc = await getUserDoc(currentUser.uid);
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
    const user = await getCurrentUser();
    if (!user) return [];
    const userDoc = await getUserDoc(user.uid);
    return userDoc?.portfolio || [];
}

export async function getTransactions(): Promise<Transaction[]> {
    const user = await getCurrentUser();
    if (!user) return [];
    const userDoc = await getUserDoc(user.uid);
    // userDoc already has serialized dates, so we can return it directly.
    return userDoc?.transactions || [];
}

export async function getUserProfile(): Promise<Omit<UserProfile, 'id'> | null> {
    const user = await getCurrentUser();
    if (!user) return null;
    const userDoc = await getUserDoc(user.uid);
    if (!userDoc) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...profileData } = userDoc;
    return profileData as Omit<UserProfile, 'id'>;
}

export async function updateUserProfile(data: { name: string; email: string; photoURL?: string | null; }): Promise<void> {
    const auth = admin.auth(adminApp);

    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    const { uid } = currentUser;

    // Prepare data for Auth and Firestore updates
    const authUpdateData: { displayName: string; email: string; photoURL?: string } = {
        displayName: data.name,
        email: data.email,
    };
     if (data.photoURL) {
        authUpdateData.photoURL = data.photoURL;
    }


    const firestoreUpdateData: { name: string; email: string; photoURL?: string | null } = {
        name: data.name,
        email: data.email,
    };
    // Only include photoURL in firestore update if it's provided in the input
    if (data.photoURL !== undefined) {
        firestoreUpdateData.photoURL = data.photoURL;
    }


    // Update Firestore document
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.update(firestoreUpdateData);

    // Update Firebase Authentication record
    await auth.updateUser(uid, authUpdateData);
    
    // Revalidate paths to reflect changes
    revalidatePath('/[lang]/profile', 'page');
    revalidatePath('/[lang]/dashboard', 'page'); // Header might show profile pic
}



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
    const { uid, email, picture } = currentUser;

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
        console.log(`User document for ${uid} not found, creating a new empty one.`);
        const newUser: Omit<FirestoreUser, 'id'> = {
            name: currentUser.name || 'New User',
            email: email || 'user@example.com',
            photoURL: picture || null,
            availableBalanceTRY: 0,
            portfolio: [],
            ibanAccounts: [],
            transactions: [],
        };
        await userDocRef.set(newUser);
        
        // Return the newly created (and empty) user data
        return { ...newUser, id: uid } as FirestoreUser;
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
    // userDoc already has serialized dates, so we can return it directly.
    return userDoc?.transactions || [];
}

export async function getUserProfile(): Promise<Omit<UserProfile, 'id'> | null> {
    const userDoc = await getUserDoc();
    if (!userDoc) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...profileData } = userDoc;
    return profileData as Omit<UserProfile, 'id'>;
}

export async function updateUserProfile(data: { name: string; email: string; photoURL?: string | null; }): Promise<void> {
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    const auth = admin.auth(adminApp);

    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    const { uid } = currentUser;

    // Prepare data for Firestore and Auth updates
    const firestoreUpdateData: { name: string; email: string; photoURL?: string | null } = {
        name: data.name,
        email: data.email,
    };
    if(data.photoURL !== undefined) {
        firestoreUpdateData.photoURL = data.photoURL;
    }

    // Update Firestore document
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.update(firestoreUpdateData);

    // Update Firebase Authentication record
    await auth.updateUser(uid, {
        displayName: data.name,
        email: data.email,
        photoURL: data.photoURL,
    });
    
    // Revalidate paths to reflect changes
    revalidatePath('/[lang]/profile', 'page');
    revalidatePath('/[lang]/dashboard', 'page'); // Header might show profile pic
}
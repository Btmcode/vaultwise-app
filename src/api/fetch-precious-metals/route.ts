
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/server';

type FormattedAsset = {
    symbol: string;
    buyPrice: number;
    sellPrice: number;
    change24h: number;
};

/**
 * Fetches precious metal prices from the Firebase Firestore 'precious_metals' collection.
 * This is the single source of truth for this data.
 */
export async function GET() {
    try {
        const adminApp = getAdminApp();
        const db = getFirestore(adminApp);
        
        const snapshot = await db.collection('precious_metals').get();

        if (snapshot.empty) {
            console.warn("Firestore 'precious_metals' collection is empty.");
             return NextResponse.json({ error: 'No precious metals data found in database.' }, { status: 404 });
        }

        const data: Record<string, FormattedAsset> = {};
        snapshot.forEach(doc => {
            data[doc.id] = doc.data() as FormattedAsset;
        });

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error fetching data from Firestore:', error.message);
        return NextResponse.json({ error: 'Failed to fetch data from Firestore: ' + error.message }, { status: 500 });
    }
}

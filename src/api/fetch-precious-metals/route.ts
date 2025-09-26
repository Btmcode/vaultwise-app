
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/server';

export async function GET() {
    try {
        const adminApp = getAdminApp();
        const db = getFirestore(adminApp);
        
        const snapshot = await db.collection('precious_metals').get();

        if (snapshot.empty) {
            console.warn("Firestore 'precious_metals' collection is empty.");
             return NextResponse.json({ error: 'No precious metals data found in database.' }, { status: 404 });
        }

        const data: any[] = [];
        snapshot.forEach(doc => {
            // Add the document ID (which is the product name) to the data object
            // to match the expected format of the frontend.
            data.push({
                "Ürün": doc.id,
                ...doc.data()
            });
        });

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error fetching data from Firestore:', error.message);
        return NextResponse.json({ error: 'Failed to fetch data from Firestore: ' + error.message }, { status: 500 });
    }
}

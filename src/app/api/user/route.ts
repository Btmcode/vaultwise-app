
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/firebase/server';
import { getUserDoc } from '@/lib/firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userDoc = await getUserDoc(currentUser.uid);

    if (!userDoc) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    return NextResponse.json({ user: userDoc });

  } catch (error) {
    console.error('API /user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

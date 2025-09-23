import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

// Bu API rotası, session cookie'yi temizleyerek
// sunucu tarafında kullanıcının oturumunu sonlandırır.
export async function POST() {
  cookies().delete('firebase-session');
  return NextResponse.json({status: 'success'}, {status: 200});
}

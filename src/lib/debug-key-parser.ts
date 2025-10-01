
import 'dotenv/config';
import admin from 'firebase-admin';

console.log('--- Firebase Private Key Debug Script ---');

function checkPrivateKey() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // IMPORTANT: This mimics the logic used in the main application.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ ERROR: One or more required Firebase environment variables are missing.');
    console.log(`- FIREBASE_PROJECT_ID: ${projectId ? 'Found' : 'Missing'}`);
    console.log(`- FIREBASE_CLIENT_EMAIL: ${clientEmail ? 'Found' : 'Missing'}`);
    console.log(`- FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? 'Found' : 'Missing'}`);
    console.log('\nPlease ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your .env file.');
    return;
  }
  
  console.log('✅ All required environment variables found.');
  
  try {
    // Check if an app is already initialized to avoid errors
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    }
    console.log('✅ SUCCESS: Firebase Admin SDK initialized successfully!');
    console.log('The private key was parsed correctly.');
    
  } catch (error: any) {
    console.error('❌ ERROR: Firebase Admin SDK initialization failed.');
    console.error('This means the private key is likely malformed or incorrect, even after formatting.');
    console.error('\n--- Original Error ---');
    console.error(error.message);
    console.error('----------------------\n');
  }
}

checkPrivateKey();
process.exit();

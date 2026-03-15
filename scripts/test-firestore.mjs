import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    console.log('Fetching notices...');
    const noticesSnapshot = await getDocs(collection(db, 'notices'));
    console.log(`Found ${noticesSnapshot.size} notices.`);
    noticesSnapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });

    console.log('Fetching events...');
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    console.log(`Found ${eventsSnapshot.size} events.`);
    eventsSnapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

test();

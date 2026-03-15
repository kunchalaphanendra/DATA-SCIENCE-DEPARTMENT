import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFPK-275TXkEyV1p7h3mgpkCCCfSSbPMk",
  authDomain: "data-science-department.firebaseapp.com",
  projectId: "data-science-department",
  storageBucket: "data-science-department.firebasestorage.app",
  messagingSenderId: "677679614717",
  appId: "1:677679614717:web:e0d66168f0030d6b004c94",
  measurementId: "G-EMTK444XXZ"
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

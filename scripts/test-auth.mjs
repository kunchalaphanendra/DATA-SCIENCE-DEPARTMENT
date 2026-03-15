import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
const auth = getAuth(app);

async function testAuth() {
  try {
    console.log('Attempting to sign in...');
    await signInWithEmailAndPassword(auth, 'admin@vignan.ac.in', 'admin123');
    console.log('Successfully signed in!');
  } catch (error: any) {
    console.error('Auth Error:', error.code, error.message);
  }
}

testAuth();

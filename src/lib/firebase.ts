import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDFPK-275TXkEyV1p7h3mgpkCCCfSSbPMk",
  authDomain: "data-science-department.firebaseapp.com",
  projectId: "data-science-department",
  storageBucket: "data-science-department.firebasestorage.app",
  messagingSenderId: "677679614717",
  appId: "1:677679614717:web:e0d66168f0030d6b004c94",
  measurementId: "G-EMTK444XXZ"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with experimentalForceLongPolling to bypass college network restrictions
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

export const storage = getStorage(app);
storage.maxUploadRetryTime = 60000; // Increase max retry time for slow networks

export default app;

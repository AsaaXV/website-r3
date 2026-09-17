import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';

// Konfigurasi Firebase dari Environment Variables (Vite)
// Pengguna dapat mengisi variabel ini melalui panel Settings atau file .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderUNM3R2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ecocampus-unm.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ecocampus-unm',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ecocampus-unm.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
};

// Cek apakah kredensial asli Firebase sudah diisi oleh pengguna
export const isFirebaseLiveConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
    !import.meta.env.VITE_FIREBASE_API_KEY.includes('Placeholder')
);

// Inisialisasi Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Ekspor instance Auth untuk digunakan di seluruh aplikasi
export const auth = getAuth(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
};

export type { FirebaseUser };
export default app;

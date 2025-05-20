// app/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 🔒 Vos clés Firebase (à conserver en safe env var en prod !)
const firebaseConfig = {
  apiKey: 'AIzaSyAgcsi9TuJ5u3IbJ5xxMn2uCr-ezMAeCuI',
  authDomain: 'ajeutchim-f8c6f.firebaseapp.com',
  projectId: 'ajeutchim-f8c6f',
  storageBucket: 'ajeutchim-f8c6f.firebasestorage.app',
  messagingSenderId: '101268096881',
  appId: '1:101268096881:web:991b41251961eeec58d0',
};

// Initialisation de l’app Firebase
const app = initializeApp(firebaseConfig);

// Auth sans persistance native (on stocke déjà le token manuellement)
export const auth = getAuth(app);

// Autres services
export const db = getFirestore(app);
export const storage = getStorage(app);

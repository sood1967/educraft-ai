import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBq_XFjv9DqPWwziJGhIAUjdxzOA_9gjSk',
  authDomain: 'educraft-f1bf8.firebaseapp.com',
  projectId: 'educraft-f1bf8',
  storageBucket: 'educraft-f1bf8.firebasestorage.app',
  messagingSenderId: '764948058342',
  appId: '1:764948058342:web:cc40e0915bcc314daa2b27'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

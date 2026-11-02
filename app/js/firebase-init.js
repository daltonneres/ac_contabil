import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import * as A from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import * as F from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';
const app = initializeApp(firebaseConfig);
window.FB = {auth: A.getAuth(app), db: F.getFirestore(app), A, F};
if (window.onFirebaseReady) window.onFirebaseReady();

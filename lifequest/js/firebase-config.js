/**
 * LifeQuest Firebase Configuration
 * LEDGER_ID: WV-LIFEQUEST-FIREBASE-CONFIG
 *
 * INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a project named "lifequest"
 * 3. Add a Web App
 * 4. Copy your config values below
 * 5. Enable Authentication > Email/Password
 * 6. Enable Firestore Database (production mode)
 */

// ============================================
// REPLACE THESE VALUES WITH YOUR FIREBASE CONFIG
// ============================================
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ============================================
// DO NOT MODIFY BELOW THIS LINE
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let app = null;
let auth = null;
let db = null;
let initialized = false;

/**
 * Initialize Firebase
 * @returns {boolean} Whether initialization was successful
 */
export function initFirebase() {
    if (initialized) return true;

    // Check if config is set
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.warn('LifeQuest: Firebase not configured. Running in pilgrim (local) mode.');
        return false;
    }

    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        initialized = true;
        console.log('LifeQuest: Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('LifeQuest: Firebase initialization error:', error);
        return false;
    }
}

/**
 * Get Firebase Auth instance
 * @returns {Auth|null}
 */
export function getAuthInstance() {
    return auth;
}

/**
 * Get Firestore instance
 * @returns {Firestore|null}
 */
export function getDbInstance() {
    return db;
}

/**
 * Check if Firebase is configured and initialized
 * @returns {boolean}
 */
export function isFirebaseReady() {
    return initialized && auth !== null && db !== null;
}

/**
 * Check if running in pilgrim (local) mode
 * @returns {boolean}
 */
export function isPilgrimMode() {
    return localStorage.getItem('lifequest_pilgrim_mode') === 'true';
}

// JESUS IS LORD

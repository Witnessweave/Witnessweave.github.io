/**
 * LifeQuest Authentication Module
 * LEDGER_ID: WV-LIFEQUEST-AUTH-MODULE
 *
 * Handles user authentication state and session management
 */

import { getAuthInstance, isFirebaseReady, isPilgrimMode } from './firebase-config.js';
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

/**
 * Current user state
 */
let currentUser = null;
let authStateCallbacks = [];

/**
 * Initialize auth state listener
 * @param {Function} callback - Called when auth state changes
 */
export function initAuthListener(callback) {
    if (callback) {
        authStateCallbacks.push(callback);
    }

    // Check pilgrim mode first
    if (isPilgrimMode()) {
        currentUser = {
            uid: 'pilgrim_local',
            displayName: localStorage.getItem('lifequest_pilgrim_name') || 'Anonymous Pilgrim',
            email: null,
            isPilgrim: true
        };
        notifyCallbacks(currentUser);
        return;
    }

    // Check Firebase auth
    if (isFirebaseReady()) {
        const auth = getAuthInstance();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = {
                    uid: user.uid,
                    displayName: user.displayName || 'Knight',
                    email: user.email,
                    isPilgrim: false
                };
            } else {
                currentUser = null;
            }
            notifyCallbacks(currentUser);
        });
    } else {
        // No Firebase, no pilgrim mode - redirect to login
        currentUser = null;
        notifyCallbacks(null);
    }
}

/**
 * Notify all registered callbacks of auth state change
 * @param {Object|null} user
 */
function notifyCallbacks(user) {
    authStateCallbacks.forEach(cb => {
        try {
            cb(user);
        } catch (e) {
            console.error('Auth callback error:', e);
        }
    });
}

/**
 * Get current user
 * @returns {Object|null}
 */
export function getCurrentUser() {
    return currentUser;
}

/**
 * Check if user is authenticated (either Firebase or Pilgrim mode)
 * @returns {boolean}
 */
export function isAuthenticated() {
    return currentUser !== null;
}

/**
 * Check if current user is in pilgrim mode
 * @returns {boolean}
 */
export function isUserPilgrim() {
    return currentUser?.isPilgrim === true;
}

/**
 * Sign out the current user
 */
export async function logout() {
    if (isPilgrimMode()) {
        // Clear pilgrim mode
        localStorage.removeItem('lifequest_pilgrim_mode');
        localStorage.removeItem('lifequest_pilgrim_name');
        // Keep local data for potential migration later
        currentUser = null;
        window.location.href = 'login.html';
        return;
    }

    if (isFirebaseReady()) {
        const auth = getAuthInstance();
        try {
            await signOut(auth);
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
}

/**
 * Require authentication - redirect to login if not authenticated
 * Call this on protected pages
 */
export function requireAuth() {
    // Small delay to let auth state initialize
    setTimeout(() => {
        if (!isAuthenticated() && !isPilgrimMode()) {
            window.location.href = 'login.html';
        }
    }, 500);
}

/**
 * Update pilgrim display name (for pilgrim mode users)
 * @param {string} name
 */
export function setPilgrimName(name) {
    if (isPilgrimMode() && currentUser) {
        localStorage.setItem('lifequest_pilgrim_name', name);
        currentUser.displayName = name;
    }
}

/**
 * Convert pilgrim to registered user
 * This should be called after successful Firebase signup to migrate local data
 * @param {string} firebaseUid - The new Firebase user's UID
 * @returns {Object|null} Local data to migrate, or null if none
 */
export function getPilgrimDataForMigration() {
    if (!isPilgrimMode()) return null;

    const localData = localStorage.getItem('lifequest_local_data');
    if (localData) {
        return JSON.parse(localData);
    }
    return null;
}

/**
 * Clear pilgrim mode after successful migration
 */
export function clearPilgrimMode() {
    localStorage.removeItem('lifequest_pilgrim_mode');
    localStorage.removeItem('lifequest_pilgrim_name');
    localStorage.removeItem('lifequest_local_data');
}

// JESUS IS LORD

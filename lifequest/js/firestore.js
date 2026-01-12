/**
 * LifeQuest Firestore Data Module
 * LEDGER_ID: WV-LIFEQUEST-FIRESTORE-MODULE
 *
 * Handles quest data storage - Firestore for registered users, localStorage for pilgrims
 */

import { getDbInstance, isFirebaseReady, isPilgrimMode } from './firebase-config.js';
import { getCurrentUser } from './auth.js';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/**
 * Badge definitions with Scripture anchors
 */
export const BADGES = {
    first_step: {
        name: "First Step",
        description: "Log your first quest",
        verse: "The journey of a thousand miles begins with a single step.",
        scripture: "Proverbs 16:9",
        criteria: { min_events: 1 }
    },
    faithful_five: {
        name: "Faithful Five",
        description: "Log 5 quests",
        verse: "Well done, good and faithful servant.",
        scripture: "Matthew 25:21",
        criteria: { min_events: 5 }
    },
    iron_forged: {
        name: "Iron Forged",
        description: "Earn 100 XP in Strength",
        verse: "As iron sharpens iron, so one person sharpens another.",
        scripture: "Proverbs 27:17",
        criteria: { category_xp: { strength: 100 } }
    },
    prayer_warrior: {
        name: "Prayer Warrior",
        description: "Earn 100 XP in Faith",
        verse: "Pray without ceasing.",
        scripture: "1 Thessalonians 5:17",
        criteria: { category_xp: { faith: 100 } }
    },
    seeker_of_wisdom: {
        name: "Seeker of Wisdom",
        description: "Earn 100 XP in Wisdom",
        verse: "Get wisdom, get understanding.",
        scripture: "Proverbs 4:5",
        criteria: { category_xp: { wisdom: 100 } }
    },
    level_five: {
        name: "Knight Apprentice",
        description: "Reach Level 5",
        verse: "I press toward the goal for the prize.",
        scripture: "Philippians 3:14",
        criteria: { min_level: 5 }
    },
    level_ten: {
        name: "Knight Errant",
        description: "Reach Level 10",
        verse: "Fight the good fight of faith.",
        scripture: "1 Timothy 6:12",
        criteria: { min_level: 10 }
    },
    centurion: {
        name: "Centurion",
        description: "Log 100 quests",
        verse: "Be faithful unto death, and I will give you the crown of life.",
        scripture: "Revelation 2:10",
        criteria: { min_events: 100 }
    },
    balanced_knight: {
        name: "Balanced Knight",
        description: "Earn XP in all 8 categories",
        verse: "A time for every purpose under heaven.",
        scripture: "Ecclesiastes 3:1",
        criteria: { all_categories: true }
    },
    servant_heart: {
        name: "Servant's Heart",
        description: "Earn 100 XP in Service",
        verse: "Whoever wants to become great among you must be your servant.",
        scripture: "Matthew 20:26",
        criteria: { category_xp: { service: 100 } }
    }
};

/**
 * XP required per level (100 XP per level)
 */
const XP_PER_LEVEL = 100;

/**
 * Get quest data for current user
 * @returns {Promise<Object>}
 */
export async function getQuestData() {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('No authenticated user');
    }

    // Pilgrim mode - use localStorage
    if (user.isPilgrim) {
        const localData = localStorage.getItem('lifequest_local_data');
        if (localData) {
            return JSON.parse(localData);
        }
        return createInitialData();
    }

    // Firebase mode
    if (isFirebaseReady()) {
        const db = getDbInstance();
        const docRef = doc(db, 'quests', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Create initial data for new user
            const initialData = createInitialData();
            await setDoc(docRef, {
                ...initialData,
                lastUpdated: serverTimestamp()
            });
            return initialData;
        }
    }

    throw new Error('No data source available');
}

/**
 * Save quest data for current user
 * @param {Object} data
 */
export async function saveQuestData(data) {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('No authenticated user');
    }

    // Pilgrim mode - use localStorage
    if (user.isPilgrim) {
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem('lifequest_local_data', JSON.stringify(data));
        return;
    }

    // Firebase mode
    if (isFirebaseReady()) {
        const db = getDbInstance();
        const docRef = doc(db, 'quests', user.uid);
        await updateDoc(docRef, {
            ...data,
            lastUpdated: serverTimestamp()
        });
        return;
    }

    throw new Error('No data source available');
}

/**
 * Log a new quest/event
 * @param {string} description
 * @param {string} category
 * @param {number} points
 * @returns {Promise<Object>} Result with level-up and badge info
 */
export async function logQuest(description, category, points) {
    const data = await getQuestData();
    const result = {
        success: true,
        levelUp: false,
        newLevel: data.level,
        newBadges: [],
        totalXp: data.xp
    };

    // Create event
    const event = {
        description,
        category,
        points: parseInt(points),
        timestamp: new Date().toISOString()
    };

    // Add event to list
    data.events = data.events || [];
    data.events.unshift(event);

    // Update XP
    const oldLevel = data.level;
    data.xp += event.points;
    data.level = Math.floor(data.xp / XP_PER_LEVEL) + 1;

    // Check for level up
    if (data.level > oldLevel) {
        result.levelUp = true;
        result.newLevel = data.level;
    }

    // Update category stats
    data.stats = data.stats || {};
    data.stats[category] = (data.stats[category] || 0) + event.points;

    // Check for new badges
    data.badges = data.badges || [];
    const newBadges = checkBadges(data);
    newBadges.forEach(badgeId => {
        if (!data.badges.includes(badgeId)) {
            data.badges.push(badgeId);
            result.newBadges.push({
                id: badgeId,
                ...BADGES[badgeId]
            });
        }
    });

    result.totalXp = data.xp;

    // Save updated data
    await saveQuestData(data);

    return result;
}

/**
 * Check which badges the user has earned
 * @param {Object} data
 * @returns {string[]} Array of badge IDs earned
 */
function checkBadges(data) {
    const earned = [];

    for (const [badgeId, badge] of Object.entries(BADGES)) {
        const criteria = badge.criteria;
        let qualifies = false;

        // Check min_events
        if (criteria.min_events && data.events.length >= criteria.min_events) {
            qualifies = true;
        }

        // Check min_level
        if (criteria.min_level && data.level >= criteria.min_level) {
            qualifies = true;
        }

        // Check category_xp
        if (criteria.category_xp) {
            for (const [cat, required] of Object.entries(criteria.category_xp)) {
                if ((data.stats[cat] || 0) >= required) {
                    qualifies = true;
                }
            }
        }

        // Check all_categories
        if (criteria.all_categories) {
            const categories = ['faith', 'strength', 'wisdom', 'social', 'creativity', 'health', 'service', 'rest'];
            const hasAll = categories.every(cat => (data.stats[cat] || 0) > 0);
            if (hasAll) {
                qualifies = true;
            }
        }

        if (qualifies) {
            earned.push(badgeId);
        }
    }

    return earned;
}

/**
 * Create initial quest data structure
 * @returns {Object}
 */
function createInitialData() {
    return {
        xp: 0,
        level: 1,
        stats: {
            faith: 0,
            strength: 0,
            wisdom: 0,
            social: 0,
            creativity: 0,
            health: 0,
            service: 0,
            rest: 0
        },
        badges: [],
        events: [],
        patches: []
    };
}

/**
 * Get progress summary for dashboard display
 * @returns {Promise<Object>}
 */
export async function getProgressSummary() {
    const data = await getQuestData();
    const user = getCurrentUser();

    return {
        displayName: user?.displayName || 'Knight',
        level: data.level,
        xp: data.xp,
        xpToNext: XP_PER_LEVEL - (data.xp % XP_PER_LEVEL),
        xpProgress: (data.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100,
        stats: data.stats,
        badges: data.badges.map(id => ({
            id,
            ...BADGES[id]
        })),
        recentEvents: (data.events || []).slice(0, 5),
        totalQuests: (data.events || []).length
    };
}

/**
 * Migrate pilgrim data to Firebase account
 * @param {string} userId - Firebase user ID
 * @param {Object} pilgrimData - Data from localStorage
 */
export async function migratePilgrimData(userId, pilgrimData) {
    if (!isFirebaseReady()) {
        throw new Error('Firebase not ready');
    }

    const db = getDbInstance();
    const docRef = doc(db, 'quests', userId);

    await setDoc(docRef, {
        ...pilgrimData,
        lastUpdated: serverTimestamp(),
        migratedFromPilgrim: true,
        migratedAt: serverTimestamp()
    });
}

// JESUS IS LORD

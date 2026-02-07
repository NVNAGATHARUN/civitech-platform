import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp
} from "firebase/firestore";
import { CitizenSchemeStatus, SchemeStatus } from "@/lib/types";

import { EmailService } from "@/services/email";

export async function updateSchemeStatus(
    userId: string,
    schemeId: string,
    status: SchemeStatus,
    dropOffReason?: string
): Promise<{ success: boolean; error?: string }> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, updating scheme status in localStorage (demo mode)");
        const statusId = `${userId}_${schemeId}`;
        const localStatuses = JSON.parse(localStorage.getItem(`schemeStatus_${userId}`) || "[]");

        const existingIdx = localStatuses.findIndex((s: any) => s.schemeId === schemeId);
        const statusData: any = {
            userId,
            schemeId,
            managedBy: 'self',
            status,
            updatedAt: new Date().toISOString()
        };
        if (dropOffReason !== undefined) statusData.dropOffReason = dropOffReason;

        if (existingIdx >= 0) {
            localStatuses[existingIdx] = statusData;
        } else {
            localStatuses.push(statusData);
        }

        localStorage.setItem(`schemeStatus_${userId}`, JSON.stringify(localStatuses));
        return { success: true };
    }

    try {
        const statusId = `${userId}_${schemeId}`;
        const docRef = doc(db, "schemeStatus", statusId);

        // Fetch user email and scheme name for the notification
        const [userSnap, schemeSnap] = await Promise.all([
            getDoc(doc(db, "users", userId)),
            getDoc(doc(db, "schemes", schemeId))
        ]);

        const userEmail = userSnap.exists() ? userSnap.data().email : null;
        const schemeName = schemeSnap.exists() ? schemeSnap.data().name : schemeId;

        const statusData: any = {
            userId,
            schemeId,
            managedBy: 'self',
            status,
            updatedAt: Timestamp.now()
        };

        if (dropOffReason !== undefined) {
            statusData.dropOffReason = dropOffReason;
        }

        await setDoc(docRef, statusData, { merge: true });

        // Trigger status update email if user email is found
        if (userEmail) {
            await EmailService.sendStatusUpdateEmail(userEmail, schemeName, status);
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error updating scheme status:", error);
        return { success: false, error: error.message };
    }
}

export async function getSchemeStatus(
    userId: string,
    schemeId: string
): Promise<CitizenSchemeStatus | null> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, fetching scheme status from localStorage (demo mode)");
        const localStatuses = JSON.parse(localStorage.getItem(`schemeStatus_${userId}`) || "[]");
        return localStatuses.find((s: any) => s.schemeId === schemeId) || null;
    }

    try {
        const statusId = `${userId}_${schemeId}`;
        const docRef = doc(db, "schemeStatus", statusId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as CitizenSchemeStatus;
        }
        return null;
    } catch (error) {
        console.error("Error fetching scheme status:", error);
        return null;
    }
}

export async function getUserSchemeStatuses(userId: string): Promise<CitizenSchemeStatus[]> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, fetching user scheme statuses from localStorage (demo mode)");
        return JSON.parse(localStorage.getItem(`schemeStatus_${userId}`) || "[]");
    }

    try {
        const q = query(
            collection(db, "schemeStatus"),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);

        const results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as CitizenSchemeStatus));

        // Sort client-side to avoid needing a Firestore Composite Index
        return results.sort((a, b) => {
            const timeA = a.updatedAt?.toMillis?.() || 0;
            const timeB = b.updatedAt?.toMillis?.() || 0;
            return timeB - timeA;
        });
    } catch (error) {
        console.error("Error fetching user scheme statuses:", error);
        return [];
    }
}

export async function getSchemeAnalytics() {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, returning mock analytics data (demo mode)");
        return {
            totalRecommendations: 42,
            statusCounts: { checked: 15, eligible: 12, planned: 8, applied: 5, benefit_received: 2 },
            topReasons: [
                { reason: "Income exceeds limit", count: 12 },
                { reason: "Missing document (Caste Cert)", count: 8 },
                { reason: "Age mismatch", count: 5 }
            ]
        };
    }

    try {
        const querySnapshot = await getDocs(collection(db, "schemeStatus"));
        const statuses = querySnapshot.docs.map(doc => doc.data() as CitizenSchemeStatus);

        // Aggregate statistics
        const statusCounts = {
            checked: 0,
            eligible: 0,
            planned: 0,
            applied: 0,
            benefit_received: 0
        };

        const dropOffReasons: Record<string, number> = {};

        statuses.forEach(status => {
            statusCounts[status.status]++;

            if (status.dropOffReason) {
                dropOffReasons[status.dropOffReason] =
                    (dropOffReasons[status.dropOffReason] || 0) + 1;
            }
        });

        // Convert dropOffReasons to sorted array
        const topReasons = Object.entries(dropOffReasons)
            .map(([reason, count]) => ({ reason, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            totalRecommendations: statuses.length,
            statusCounts,
            topReasons
        };
    } catch (error) {
        console.error("Error fetching scheme analytics:", error);
        return {
            totalRecommendations: 0,
            statusCounts: {
                checked: 0,
                eligible: 0,
                planned: 0,
                applied: 0,
                benefit_received: 0
            },
            topReasons: []
        };
    }
}

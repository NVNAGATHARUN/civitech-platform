import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { CitizenProfile } from "@/lib/types";

export async function getProfile(userId: string): Promise<CitizenProfile | null> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, fetching profile from localStorage (demo mode)");
        const localData = localStorage.getItem(`citizenProfile_${userId}`);
        return localData ? JSON.parse(localData) : null;
    }

    try {
        const docRef = doc(db, "citizenProfiles", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as unknown as CitizenProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function updateProfile(userId: string, data: Partial<CitizenProfile>): Promise<{ success: boolean; error?: string }> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, updating profile in localStorage (demo mode)");
        const localData = localStorage.getItem(`citizenProfile_${userId}`);
        const currentProfile = localData ? JSON.parse(localData) : { userId, profileData: {} };
        const updatedProfile = { ...currentProfile, ...data };
        localStorage.setItem(`citizenProfile_${userId}`, JSON.stringify(updatedProfile));
        return { success: true };
    }

    try {
        const docRef = doc(db, "citizenProfiles", userId);
        await setDoc(docRef, data, { merge: true });
        return { success: true };
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }
}

export async function createProfile(userId: string, profile: CitizenProfile): Promise<{ success: boolean; error?: string }> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, creating profile in localStorage (demo mode)");
        localStorage.setItem(`citizenProfile_${userId}`, JSON.stringify({ ...profile, userId, createdAt: new Date() }));
        return { success: true };
    }

    try {
        const docRef = doc(db, "citizenProfiles", userId);
        await setDoc(docRef, {
            ...profile,
            userId,
            createdAt: new Date()
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error creating profile:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteProfile(userId: string): Promise<{ success: boolean; error?: string }> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, deleting profile from localStorage (demo mode)");
        localStorage.removeItem(`citizenProfile_${userId}`);
        return { success: true };
    }
    try {
        const docRef = doc(db, "citizenProfiles", userId);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting profile:", error);
        return { success: false, error: error.message };
    }
}

export async function getProfilesByVolunteer(volunteerId: string): Promise<CitizenProfile[]> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, scanning localStorage for volunteer profiles (demo mode)");
        const results: CitizenProfile[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("citizenProfile_")) {
                const profile = JSON.parse(localStorage.getItem(key) || "{}");
                if (profile.managedBy === volunteerId) {
                    results.push(profile);
                }
            }
        }
        return results;
    }

    try {
        const q = query(
            collection(db, "citizenProfiles"),
            where("managedBy", "==", volunteerId)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as unknown as CitizenProfile));
    } catch (error) {
        console.error("Error fetching profiles by volunteer:", error);
        return [];
    }
}

export async function getAllProfiles(): Promise<CitizenProfile[]> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, scanning localStorage for all profiles (demo mode)");
        const results: CitizenProfile[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("citizenProfile_")) {
                results.push(JSON.parse(localStorage.getItem(key) || "{}"));
            }
        }
        return results;
    }

    try {
        const querySnapshot = await getDocs(collection(db, "citizenProfiles"));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as unknown as CitizenProfile));
    } catch (error) {
        console.error("Error fetching all profiles:", error);
        return [];
    }
}

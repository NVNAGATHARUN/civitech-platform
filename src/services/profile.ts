import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { CitizenProfile } from "@/lib/types";

export async function getProfile(userId: string): Promise<CitizenProfile | null> {
    if (!db || !db.app || !db.app.options || !db.app.options.apiKey) return null;
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
    if (!db || !db.app || !db.app.options || !db.app.options.apiKey) return { success: false, error: "Firebase not initialized" };
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
    if (!db || !db.app || !db.app.options || !db.app.options.apiKey) return { success: false, error: "Firebase not initialized" };
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
    if (!db || !db.app || !db.app.options || !db.app.options.apiKey) return { success: false, error: "Firebase not initialized" };
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
    if (!db || !db.app || !db.app.options || !db.app.options.apiKey) return [];
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
    if (!db || !db.app || !db.app.options || !db.app.options.apiKey) return [];
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

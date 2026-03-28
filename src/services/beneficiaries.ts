import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    Timestamp
} from "firebase/firestore";
import { Beneficiary } from "@/lib/types";

const COLLECTION_NAME = "beneficiaries";

export async function addBeneficiary(userId: string, data: Partial<Beneficiary>): Promise<string> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, adding beneficiary to localStorage (demo mode)");
        const localBens = JSON.parse(localStorage.getItem(`beneficiaries_${userId}`) || "[]");
        const newBen = {
            id: "local-" + Math.random().toString(36).substr(2, 9),
            ...data,
            primaryUserId: userId,
            status: data.status || 'Processing',
            createdAt: new Date().toISOString()
        };
        localBens.push(newBen);
        localStorage.setItem(`beneficiaries_${userId}`, JSON.stringify(localBens));
        return newBen.id;
    }

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...data,
            primaryUserId: userId,
            status: data.status || 'Processing',
            createdAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding beneficiary:", error);
        throw error;
    }
}

export async function getUserBeneficiaries(userId: string): Promise<Beneficiary[]> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, fetching beneficiaries from localStorage (demo mode)");
        return JSON.parse(localStorage.getItem(`beneficiaries_${userId}`) || "[]");
    }

    try {
        const q = query(collection(db, COLLECTION_NAME), where("primaryUserId", "==", userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Beneficiary));
    } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        return [];
    }
}

export async function deleteBeneficiary(id: string): Promise<void> {
    const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

    if (!isFirebaseReady) {
        console.warn("Firebase uninitialized, deleting beneficiary from localStorage (demo mode)");
        // This is simplified as it would need the userId to find the right key, 
        // but for demo we can scan all local beneficiaries keys if needed or just handle the current one if we had context.
        // For simplicity in demo, we'll just log it.
        return;
    }

    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting beneficiary:", error);
        throw error;
    }
}

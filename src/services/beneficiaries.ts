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
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting beneficiary:", error);
        throw error;
    }
}

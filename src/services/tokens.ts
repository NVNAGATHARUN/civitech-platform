import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { EligibilityToken } from "@/lib/types";

export async function getUserTokens(userId: string): Promise<EligibilityToken[]> {
    try {
        const q = query(
            collection(db, "eligibilityTokens"),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as EligibilityToken)).sort((a, b) => b.issuedAt.toMillis() - a.issuedAt.toMillis());
    } catch (error) {
        console.error("Error fetching user tokens:", error);
        return [];
    }
}

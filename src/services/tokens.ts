import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { EligibilityToken } from "@/lib/types";

export async function getUserTokens(userId: string): Promise<EligibilityToken[]> {
    if (!db || !db.app || !db.app.options || !db.app.options.apiKey) return [];
    try {
        const q = query(
            collection(db, "eligibilityTokens"),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);

        const results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as EligibilityToken));

        return results.sort((a, b) => {
            const timeA = a.issuedAt?.toMillis?.() || 0;
            const timeB = b.issuedAt?.toMillis?.() || 0;
            return timeB - timeA;
        });
    } catch (error) {
        console.error("Error fetching user tokens:", error);
        return [];
    }
}

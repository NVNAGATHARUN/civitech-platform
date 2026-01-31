import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Scheme, CitizenProfile } from "@/lib/types";
import { getUserBeneficiaries } from "./beneficiaries";

export interface MatchedScheme extends Scheme {
    matchReason?: string;
    isEligible: boolean;
}

export interface SchemeWithReason {
    scheme: Scheme;
    matchReason: string;
}

export async function getAllSchemes(): Promise<Scheme[]> {
    try {
        const snapshot = await getDocs(collection(db, "schemes"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scheme));
    } catch (error) {
        console.error("Error fetching schemes:", error);
        return [];
    }
}

export async function getSchemesForProfile(profile: CitizenProfile): Promise<SchemeWithReason[]> {
    try {
        if (!profile || !profile.profileData) return [];
        // 1. Fetch all schemes
        const allSchemes = await getAllSchemes();

        // DEBUG LOGS - STEP 4
        console.log("Total schemes fetched from Firestore:", allSchemes.length);
        console.log("Current Profile:", profile);

        if (!allSchemes.length) return [];

        const matches: SchemeWithReason[] = [];

        // Map income bands to numeric limits for comparison
        const incomeLimitMap: Record<string, number> = {
            "<1L": 100000,
            "1–3L": 300000,
            ">3L": 10000000 // Very high number for >3L
        };

        if (!profile || !profile.profileData) {
            console.error("Invalid profile passed to getSchemesForProfile:", profile);
            return [];
        }

        const userIncomeNum = profile.profileData.income || 0;

        // Fetch family members for family-size based schemes
        const beneficiaries = await getUserBeneficiaries(profile.userId);
        const familySize = beneficiaries.length + 1; // +1 for the user themselves

        allSchemes.forEach(scheme => {
            // Defensive check for missing arrays (handles legacy data)
            const occTags = scheme.occupationTags || [];
            // Support legacy 'state' field as a fallback
            const states = scheme.states || ((scheme as any).state ? [(scheme as any).state] : []);

            // Eligibility Checks
            const matchesAge = profile.profileData.age >= scheme.minAge && (scheme.maxAge === 0 || profile.profileData.age <= scheme.maxAge);

            const matchesIncome = scheme.incomeLimit === 0 || userIncomeNum <= scheme.incomeLimit;

            const matchesOccupation = occTags.includes("ALL") ||
                occTags.includes(profile.profileData.occupationTags[0] || ""); // Simplified matching

            const matchesState = states.includes("ALL") ||
                states.includes(profile.profileData.state) ||
                states.includes("All India"); // Backward compatibility

            const matchesFamilySize = !scheme.familySizeLimit || familySize >= scheme.familySizeLimit;

            // DEBUG FOR SPECIFIC SCHEME
            console.log(`Checking scheme: ${scheme.name} -> Age: ${matchesAge}, Income: ${matchesIncome}, Occ: ${matchesOccupation}, State: ${matchesState}, Family: ${matchesFamilySize}`);

            if (matchesAge && matchesIncome && matchesOccupation && matchesState && matchesFamilySize) {
                matches.push({
                    scheme,
                    matchReason: `Matches your ${profile.profileData.age} age criteria, ${profile.profileData.state} residence, and income criteria.`
                });
            }
        });

        console.log("Final matching schemes count:", matches.length);

        return matches;
    } catch (e) {
        console.error("Error in getSchemesForProfile:", e);
        return [];
    }
}

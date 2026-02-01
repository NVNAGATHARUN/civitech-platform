import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";

const STATES = [
    "Telangana", "Andhra Pradesh", "Maharashtra", "Karnataka",
    "Tamil Nadu", "Gujarat", "Uttar Pradesh", "Bihar", "Rajasthan"
];

const OCCUPATIONS = [
    "Farmer", "Student", "Daily Wage Laborer", "Artisan",
    "Unemployed", "Small Business Owner", "Domestic Worker"
];

const CASTES = ["General", "OBC", "SC", "ST"];

export async function seedDemoData() {
    console.log("Starting Seeding...");

    // 1. Create Citizen Profiles
    for (let i = 0; i < 50; i++) {
        const state = STATES[Math.floor(Math.random() * STATES.length)];
        const profile = {
            userId: `demo-user-${i}`,
            managedBy: Math.random() > 0.5 ? "self" : "volunteer-demo",
            profileData: {
                name: `Citizen ${i + 1}`,
                age: Math.floor(Math.random() * 60) + 18,
                education: "Secondary",
                income: Math.floor(Math.random() * 150000) + 20000,
                caste: CASTES[Math.floor(Math.random() * CASTES.length)],
                state: state,
                district: `${state} District`,
                occupationTags: [OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)]]
            },
            documentStatus: {
                aadhaar: "verified",
                incomeCert: Math.random() > 0.3 ? "verified" : "pending"
            },
            createdAt: Timestamp.now()
        };
        await addDoc(collection(db, "citizenProfiles"), profile);
    }

    // 2. Create Scheme Statuses (Successful matches)
    const schemeIds = ["pm-kisan", "pmay-urban", "u-scheme-1", "u-scheme-2"];
    for (let i = 0; i < 35; i++) {
        const isSuccess = Math.random() > 0.4;
        await addDoc(collection(db, "schemeStatus"), {
            userId: `demo-user-${Math.floor(Math.random() * 50)}`,
            schemeId: schemeIds[Math.floor(Math.random() * schemeIds.length)],
            status: isSuccess ? "benefit_received" : "applied",
            managedBy: "volunteer-demo",
            updatedAt: Timestamp.now()
        });
    }

    // 3. Create Assessment Logs (for Regional Demand)
    for (let i = 0; i < 100; i++) {
        const state = STATES[Math.floor(Math.random() * STATES.length)];
        await addDoc(collection(db, "citizenAssessmentLog"), {
            timestamp: Timestamp.now(),
            profileData: {
                state: state,
                income: Math.floor(Math.random() * 200000)
            }
        });
    }

    console.log("Seeding Complete!");
}

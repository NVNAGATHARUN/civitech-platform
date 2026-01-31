import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import schemesData from "@/lib/schemes.json";

export async function seedSchemes() {
    console.log("Seeding schemes...");
    for (const scheme of schemesData) {
        await setDoc(doc(db, "schemes", scheme.id), scheme);
    }
    console.log("Seeding complete.");
}

export async function seedDemoUsers() {
    console.log("Seeding demo users...");

    // Demo citizen
    await setDoc(doc(db, "users", "demo-citizen"), {
        uid: "demo-citizen",
        email: "citizen@demo.com",
        role: "citizen",
        createdAt: new Date()
    });

    // Demo volunteer
    await setDoc(doc(db, "users", "demo-volunteer"), {
        uid: "demo-volunteer",
        email: "volunteer@demo.com",
        role: "volunteer",
        createdAt: new Date()
    });

    // Demo admin
    await setDoc(doc(db, "users", "demo-admin"), {
        uid: "demo-admin",
        email: "admin@demo.com",
        role: "admin",
        createdAt: new Date()
    });

    console.log("Demo users seeded.");
}

/**
 * Seeds mock analytics data for a demo citizen.
 * Used for visualizing the admin dashboard funnel.
 */
export async function seedDemoAnalytics() {
    console.log("Seeding demo analytics...");
    const citizenId = "demo-citizen-id";

    const statuses = [
        { schemeId: "scheme-1", status: "planned" },
        { schemeId: "scheme-2", status: "applied" },
        { schemeId: "scheme-3", status: "benefit_received" },
        { schemeId: "scheme-4", status: "eligible" },
        { schemeId: "scheme-5", status: "planned" },
    ];

    for (const s of statuses) {
        await setDoc(doc(db, "schemeStatus", `${citizenId}_${s.schemeId}`), {
            userId: citizenId,
            schemeId: s.schemeId,
            status: s.status,
            updatedAt: new Date()
        });
    }
    console.log("Demo analytics seeded.");
}



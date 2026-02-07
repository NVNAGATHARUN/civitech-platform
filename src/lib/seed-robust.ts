import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { Scheme } from "./types";

const ROBUST_SCHEMES: Scheme[] = [
    {
        id: "pm-kisan",
        name: "PM Kisan Samman Nidhi",
        category: "Agriculture",
        minAge: 18,
        maxAge: 0,
        incomeLimit: 200000,
        occupationTags: ["Farmer"],
        states: ["ALL"],
        descriptionSimple: "Financial benefit of ₹6,000 per year is transferred to the bank accounts of farmer families.",
        benefitsSimple: "₹6,000 Annual Direct Benefit",
        documentsRequired: ["Aadhaar Card", "Land Records", "Bank Passbook"],
        applyLink: "https://pmkisan.gov.in/",
        officialSource: "Ministry of Agriculture",
        deadline: "2026-02-28"
    },
    {
        id: "post-matric-student",
        name: "Post-Matric Scholarship for Students",
        category: "Education",
        minAge: 15,
        maxAge: 25,
        incomeLimit: 250000,
        occupationTags: ["Student"],
        states: ["ALL"],
        descriptionSimple: "Financial assistance for students from economically weaker sections pursuing higher education.",
        benefitsSimple: "Tuition fee waiver and monthly stipend",
        documentsRequired: ["Aadhaar Card", "Income Certificate", "Caste Certificate", "Previous Marksheet"],
        applyLink: "https://scholarships.gov.in/",
        officialSource: "National Scholarship Portal",
        deadline: "2026-02-20"
    },
    {
        id: "lakhpati-didi",
        name: "Lakhpati Didi Initiative",
        category: "Women Empowerment",
        minAge: 18,
        maxAge: 50,
        incomeLimit: 0,
        occupationTags: ["ALL"],
        states: ["ALL"],
        descriptionSimple: "Empowering women in self-help groups (SHGs) to earn at least ₹1 lakh annually through skill training.",
        benefitsSimple: "Skill development, micro-credit access, and market linkage",
        documentsRequired: ["Aadhaar Card", "SHG Membership Proof"],
        applyLink: "https://nrlm.gov.in/",
        officialSource: "Ministry of Rural Development",
        deadline: "2026-03-31"
    },
    {
        id: "maha-unemp-allowance",
        name: "Maharashtra Unemployment Allowance",
        category: "Employment",
        minAge: 21,
        maxAge: 35,
        incomeLimit: 300000,
        occupationTags: ["Unemployed"],
        states: ["Maharashtra"],
        descriptionSimple: "Support scheme for educated unemployed youth in the state of Maharashtra.",
        benefitsSimple: "Monthly allowance of ₹2,500 for up to 2 years",
        documentsRequired: ["Aadhaar Card", "Standard 12th/Degree Certificate", "Domicile Certificate"],
        applyLink: "https://mahaswayam.gov.in/",
        officialSource: "Govt of Maharashtra",
        deadline: "2026-03-15"
    }
];

export async function seedRobustSchemes() {
    console.log("Seeding robust schemes...");
    for (const scheme of ROBUST_SCHEMES) {
        await setDoc(doc(collection(db, "schemes"), scheme.id), scheme);
        console.log(`Seeded: ${scheme.name}`);
    }

    // Seed Regional Demand Mock Data
    const MOCK_REGIONS = [
        { state: "Maharashtra", count: 45 },
        { state: "Delhi", count: 28 },
        { state: "Karnataka", count: 32 },
        { state: "Tamil Nadu", count: 22 },
        { state: "Uttar Pradesh", count: 38 },
        { state: "Gujarat", count: 18 },
        { state: "Rajasthan", count: 12 },
        { state: "Telangana", count: 25 },
        { state: "West Bengal", count: 15 },
        { state: "Kerala", count: 10 }
    ];

    console.log("Seeding regional assessment logs...");
    for (const region of MOCK_REGIONS) {
        for (let i = 0; i < region.count; i++) {
            const userId = `user-${region.state}-${i}`;
            const logId = `log-${region.state}-${i}`;

            // 1. Seed Assessment Log (Demand)
            await setDoc(doc(collection(db, "citizenAssessmentLog"), logId), {
                userId: userId,
                profileData: {
                    state: region.state,
                    name: `Demo Citizen ${i}`,
                    age: 25 + Math.floor(Math.random() * 20),
                    gender: "Male",
                    education: "Graduate",
                    income: 150000,
                    caste: "General",
                    occupationTags: ["Farmer", "Student"][Math.floor(Math.random() * 2)]
                },
                createdAt: new Date()
            });

            // 2. Seed Profile for joined data
            await setDoc(doc(collection(db, "citizenProfiles"), userId), {
                profileData: {
                    state: region.state,
                    name: `Demo Citizen ${i}`,
                    age: 30,
                    gender: "Female",
                    education: "12th Pass",
                    income: 50000,
                    caste: "OBC",
                    occupationTags: ["Worker"]
                }
            });

            // 3. Seed Status (Supply) - Only for some users to show a "Gap"
            // Let's say 40-70% of people get the benefit in our mock data
            const supplyRate = 0.4 + (Math.random() * 0.3);
            if (i < region.count * supplyRate) {
                const statusId = `${userId}_pm-kisan`;
                await setDoc(doc(collection(db, "schemeStatus"), statusId), {
                    userId: userId,
                    schemeId: "pm-kisan",
                    status: "benefit_received",
                    updatedAt: new Date()
                });
            }
        }
    }

    return ROBUST_SCHEMES;
}

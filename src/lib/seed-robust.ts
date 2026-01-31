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
        officialSource: "Ministry of Agriculture"
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
        officialSource: "National Scholarship Portal"
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
        officialSource: "Ministry of Rural Development"
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
        officialSource: "Govt of Maharashtra"
    }
];

export async function seedRobustSchemes() {
    console.log("Seeding robust schemes...");
    for (const scheme of ROBUST_SCHEMES) {
        await setDoc(doc(collection(db, "schemes"), scheme.id), scheme);
        console.log(`Seeded: ${scheme.name}`);
    }
    return ROBUST_SCHEMES;
}

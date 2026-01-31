import { Timestamp } from 'firebase/firestore';

export type UserRole = 'citizen' | 'volunteer' | 'admin';

export interface User {
    uid: string;
    role: UserRole;
    email: string;
    displayName?: string;
    createdAt: Timestamp;
}

export interface CitizenProfile {
    userId: string;
    managedBy: 'self' | string;
    profileData: {
        name: string;
        age: number;
        education: string;
        income: number;
        caste: string;
        state: string;
        occupationTags: string[];
    };
    documentStatus: Record<string, 'verified' | 'pending' | 'missing'>;
    createdAt?: Timestamp;
}

export interface Scheme {
    id: string;
    name: string;
    category: string;
    minAge: number;
    maxAge: number;
    incomeLimit: number;
    occupationTags: string[];
    states: string[]; // Supports ["ALL"]
    descriptionSimple: string;
    benefitsSimple: string;
    documentsRequired: string[];
    familySizeLimit?: number;
    applyLink: string;
    officialSource: string;
}

export type SchemeStatus = 'checked' | 'eligible' | 'planned' | 'applied' | 'benefit_received';

export interface CitizenSchemeStatus {
    id?: string;
    userId: string;
    schemeId: string;
    managedBy: 'self' | string;
    status: SchemeStatus;
    dropOffReason?: string;
    updatedAt: Timestamp;
}

export interface EligibilityToken {
    id?: string;
    userId: string;
    schemeId: string;
    tokenString: string;
    issuedAt: Timestamp;
    expiresAt: Timestamp;
}
export interface Beneficiary {
    id?: string;
    primaryUserId: string; // The user who manages this beneficiary
    name: string;
    relation: string;
    age: number;
    education?: string;
    income?: number;
    occupation?: string;
    status: 'Verified' | 'In Review' | 'Processing';
    createdAt: Timestamp;
}

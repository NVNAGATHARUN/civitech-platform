import { auth, db } from "@/lib/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserRole } from "@/lib/types";

export async function signUp(email: string, password: string, role: UserRole = 'citizen') {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user metadata document
        const assignedRole = email === "nagatharunnv@gmail.com" ? 'admin' : role;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            role: assignedRole,
            createdAt: new Date()
        });

        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function signIn(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function signOut() {
    try {
        await firebaseSignOut(auth);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function resetPassword(email: string) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function getCurrentUser(): User | null {
    return auth.currentUser;
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            return userDoc.data().role as UserRole;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
}

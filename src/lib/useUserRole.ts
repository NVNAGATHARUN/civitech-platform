"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserRole } from "@/services/auth"
import { UserRole } from "@/lib/types"

export function useUserRole() {
    const [role, setRole] = useState<UserRole | null>(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (!auth || !auth.app || !auth.app.options || !auth.app.options.apiKey) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)
            if (currentUser) {
                const userRole = await getUserRole(currentUser.uid)
                setRole(userRole)
            } else {
                setRole(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return { role, loading, user }
}

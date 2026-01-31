"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserRole } from "@/lib/useUserRole"
import { UserRole } from "@/lib/types"

interface RoleGuardProps {
    children: ReactNode
    allowedRoles: UserRole[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { role, loading } = useUserRole()
    const router = useRouter()

    useEffect(() => {
        if (!loading && (!role || !allowedRoles.includes(role))) {
            router.push("/")
        }
    }, [role, loading, allowedRoles, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Verifying Credentials...</p>
                </div>
            </div>
        )
    }

    if (!role || !allowedRoles.includes(role)) {
        return null
    }

    return <>{children}</>
}

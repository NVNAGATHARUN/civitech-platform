"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    Search,
    Bell,
    UserCircle,
    FileText,
    BarChart3,
    Globe,
    Building2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DashboardLayoutProps {
    children: React.ReactNode
    role: "volunteer" | "admin" | "citizen"
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const pathname = usePathname()

    const navItems = role === "admin"
        ? [
            { name: "Overview", href: "/admin", icon: LayoutDashboard },
            { name: "Impact Map", href: "/admin/impact", icon: Globe },
            { name: "Schemes", href: "/admin/schemes", icon: FileText },
            { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
            { name: "Citizens", href: "/admin/citizens", icon: Users },
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ]
        : role === "volunteer"
            ? [
                { name: "Dashboard", href: "/volunteer", icon: LayoutDashboard },
                { name: "Impact Map", href: "/admin/impact", icon: Globe },
                { name: "Beneficiaries", href: "/profile", icon: Users },
                { name: "Check Eligibility", href: "/check", icon: Search },
                { name: "Resources", href: "/resources", icon: FileText },
                { name: "Settings", href: "/volunteer/settings", icon: Settings },
            ]
            : [
                { name: "My Schemes", href: "/schemes", icon: FileText },
                { name: "My Profile", href: "/profile", icon: UserCircle },
                { name: "Resources", href: "/resources", icon: Globe },
                { name: "Settings", href: "/profile/settings", icon: Settings },
            ]

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-[#0F172A] text-white">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight uppercase">CitizenDesk</span>
                    </Link>
                    <p className="text-[10px] text-blue-400 font-semibold tracking-widest mt-1 opacity-80 uppercase">
                        {role === "admin" ? "Administrative Portal" : "Volunteer Workspace"}
                    </p>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group",
                                pathname === item.href
                                    ? "bg-blue-600/10 text-blue-400 border-l-2 border-blue-600 rounded-l-none"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-colors",
                                pathname === item.href ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"
                            )} />
                            {item.name}
                            {pathname === item.href && (
                                <ChevronRight className="ml-auto h-4 w-4" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 gap-3">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 leading-none">Test {role === "admin" ? "Admin" : "Volunteer"}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{role === "admin" ? "Super User" : "Regional Lead"}</p>
                            </div>
                            <UserCircle className="h-8 w-8 text-slate-300" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8 pb-32">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

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
import { useLanguage } from "@/lib/LanguageContext"

interface DashboardLayoutProps {
    children: React.ReactNode
    role: "volunteer" | "admin" | "citizen"
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const { t } = useLanguage()
    const pathname = usePathname()

    const navItems = role === "admin"
        ? [
            { name: t.sidebar.overview, href: "/admin", icon: LayoutDashboard },
            { name: t.sidebar.impactMap, href: "/admin/impact", icon: Globe },
            { name: t.sidebar.schemes, href: "/admin/schemes", icon: FileText },
            { name: t.sidebar.analytics, href: "/admin/data-insights", icon: BarChart3 },
            { name: t.sidebar.citizens, href: "/admin/citizens", icon: Users },
            { name: t.sidebar.settings, href: "/admin/settings", icon: Settings },
        ]
        : role === "volunteer"
            ? [
                { name: t.sidebar.dashboard, href: "/volunteer", icon: LayoutDashboard },
                { name: t.sidebar.impactMap, href: "/admin/impact", icon: Globe },
                { name: t.sidebar.beneficiaries, href: "/profile", icon: Users },
                { name: t.sidebar.checkEligibility, href: "/check", icon: Search },
                { name: t.sidebar.resources, href: "/resources", icon: FileText },
                { name: t.sidebar.settings, href: "/volunteer/settings", icon: Settings },
            ]
            : [
                { name: t.sidebar.mySchemes, href: "/schemes", icon: FileText },
                { name: t.sidebar.myProfile, href: "/profile", icon: UserCircle },
                { name: t.sidebar.resources, href: "/resources", icon: Globe },
                { name: t.sidebar.settings, href: "/profile/settings", icon: Settings },
            ]

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            {/* Sidebar - Refined Premium */}
            <aside className="hidden md:flex flex-col w-72 bg-[#020617] text-white border-r border-slate-800/50">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter uppercase leading-none">CitizenDesk</span>
                            <span className="text-[10px] text-blue-400 font-black tracking-[0.2em] mt-1 opacity-80 uppercase leading-none">
                                {role === "admin" ? "Admin Command" : "Field Workspace"}
                            </span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 group relative overflow-hidden",
                                pathname === item.href
                                    ? "bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-transform duration-500",
                                pathname === item.href ? "text-white scale-110" : "text-slate-500 group-hover:text-slate-300 group-hover:scale-110"
                            )} />
                            {item.name}

                            {pathname === item.href && (
                                <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-white rounded-l-full shadow-[0_0_10px_white]"></div>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-800/50">
                    <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 gap-4 h-12 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest">
                        <LogOut className="h-5 w-5" />
                        {t.sidebar.signOut}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header - Glassmorphic */}
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-10 z-20 sticky top-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.25em]">
                            {navItems.find(i => i.href === pathname)?.name || t.sidebar.overview}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white animate-pulse"></span>
                        </button>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">Test {role === "admin" ? "Admin" : "Volunteer"}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{role === "admin" ? "Super User" : "Regional Lead"}</p>
                            </div>
                            <div className="h-10 w-10 bg-slate-100 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-blue-600">
                                <UserCircle className="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
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

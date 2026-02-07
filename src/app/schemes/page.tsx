"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { getAllSchemes, getSchemesForProfile, MatchedScheme } from "@/services/schemes"
import { Scheme, CitizenProfile } from "@/lib/types"
import { SchemeCard } from "@/components/scheme-card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/LanguageContext"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
    Search,
    Sparkles,
    LayoutGrid,
    ArrowRight,
    ShieldCheck,
    ChevronLeft
} from "lucide-react"

export default function SchemesPage() {
    const { t } = useLanguage()
    const [matches, setMatches] = useState<MatchedScheme[]>([])
    const [allSchemes, setAllSchemes] = useState<Scheme[]>([])
    const [loading, setLoading] = useState(true)
    const [hasProfile, setHasProfile] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)

    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (!auth || !auth.app || !auth.app.options || !auth.app.options.apiKey) {
            console.warn("Firebase uninitialized, using demo user for SchemesPage");
            const demoUser = { uid: "demo-user-123", email: "demo@civitech.in" };
            setUser(demoUser);
            setUserRole("citizen");

            // Fetch local profile and matching schemes
            const localProfile = JSON.parse(localStorage.getItem(`citizenProfile_${demoUser.uid}`) || "null");
            if (localProfile) {
                setHasProfile(true);
                getSchemesForProfile(localProfile).then(results => {
                    setMatches(results.map(r => ({
                        ...r.scheme,
                        matchReason: r.matchReason,
                        isEligible: true
                    })));
                });
            } else {
                setHasProfile(false);
            }

            getAllSchemes().then(setAllSchemes);
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true)
            try {
                const all = await getAllSchemes()
                setAllSchemes(all)

                if (currentUser) { // Check if currentUser exists
                    setUser(currentUser) // Set the user state
                    // Assuming getUserRole is a function that needs to be defined or imported
                    // For now, keeping the existing role determination logic.
                    // const userRole = await getUserRole(currentUser.uid) // This line was requested but getUserRole is not defined.
                    // If this is meant to replace the email-based role logic,
                    // further instructions or definition of getUserRole are needed.

                    // Check if volunteer
                    if (currentUser.email?.includes("volunteer")) {
                        setUserRole("volunteer")
                    } else if (user.email?.includes("admin")) {
                        setUserRole("admin")
                    } else {
                        setUserRole("citizen")
                    }

                    const snap = await getDoc(doc(db, "citizenProfiles", user.uid))
                    if (snap.exists()) {
                        const profile = snap.data() as CitizenProfile

                        const results = await getSchemesForProfile(profile)
                        const matchedSchemes: MatchedScheme[] = results.map(r => ({
                            ...r.scheme,
                            matchReason: r.matchReason,
                            isEligible: true
                        }))
                        setMatches(matchedSchemes)
                        setHasProfile(true)
                    } else {
                        setHasProfile(false)
                        setMatches([])
                    }
                } else {
                    setHasProfile(false)
                    setUserRole(null)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        })
        return () => unsubscribe()
    }, [])

    const filteredMatches = matches.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.descriptionSimple.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.occupationTags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const filteredAll = allSchemes.filter(s =>
        !matches.find(m => m.id === s.id) && (
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.descriptionSimple.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.occupationTags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    )

    const content = (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tight font-display">{t.schemes.title}</h1>
                    <p className="text-slate-500 font-medium">{t.schemes.subtitle}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={t.schemes.searchPlaceholder}
                            className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {!hasProfile && userRole === "citizen" && (
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-2xl font-bold shadow-lg shadow-blue-500/20">
                            <Link href="/check">
                                <Sparkles className="mr-2 h-4 w-4" /> {t.schemes.personalize}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {hasProfile && filteredMatches.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-wider">{t.schemes.recommended}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMatches.map(scheme => (
                            <SchemeCard key={scheme.id} scheme={scheme} isRecommended={true} />
                        ))}
                    </div>
                </section>
            )}

            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <LayoutGrid className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-wider">{t.schemes.all}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAll.map(scheme => (
                        <SchemeCard key={scheme.id} scheme={scheme} />
                    ))}
                </div>
            </section>
        </div>
    )

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
                <div className="h-10 w-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.schemes.loading}</p>
            </div>
        )
    }

    if (userRole) {
        return <DashboardLayout role={userRole as any}>{content}</DashboardLayout>
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="bg-white border-b border-slate-200 py-4 px-8 mb-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-lg font-bold text-[#0F172A] uppercase tracking-wider">
                            {t.schemes.title}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pb-20">
                {content}
            </div>
        </div>
    )
}

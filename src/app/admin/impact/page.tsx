"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Trophy, Users, Heart, Star, Sparkles, MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getGlobalImpactStats, GlobalImpactStats } from "@/services/data-service"

import { StateSchemeExplorer } from "@/components/state-scheme-explorer"

export default function ImpactMapPage() {
    const [stats, setStats] = useState<GlobalImpactStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [level, setLevel] = useState("Silver Bridge-Maker")

    const [mounted, setMounted] = useState(false)
    const [dots, setDots] = useState<{ top: string, left: string, delay: string }[]>([])
    const [regionalDemand, setRegionalDemand] = useState<any[]>([])

    useEffect(() => {
        setMounted(true)

        async function loadData() {
            setLoading(true)
            const [data, regionData] = await Promise.all([
                getGlobalImpactStats(),
                import("@/services/data-service").then(m => m.getRegionalDemand())
            ])
            setStats(data)
            setRegionalDemand(regionData)

            // Generate dots based on assisted count (min 5, max 20 for visual balance)
            const dotCount = Math.min(Math.max(data.citizensAssisted, 5), 20)
            const newDots = [...Array(dotCount)].map(() => ({
                top: `${Math.random() * 70 + 15}%`,
                left: `${Math.random() * 80 + 10}%`,
                delay: `${Math.random() * 2}s`
            }))
            setDots(newDots)

            // Update level based on benefits
            if (data.benefitsEnabled > 50) setLevel("Platinum Bridge-Maker")
            else if (data.benefitsEnabled > 20) setLevel("Gold Bridge-Maker")

            setLoading(false)
        }

        loadData()
    }, [])

    return (
        <DashboardLayout role="volunteer">
            <div className="space-y-10 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Interactive Welfare Map</h2>
                        <p className="text-slate-500 font-medium mt-1">Discover regional programs and visualize community impact.</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-10">
                    <StateSchemeExplorer />
                </div>

                {/* Gamification Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <ImpactStatsCard
                        label="Citizens Assisted"
                        value={loading ? "..." : (stats?.citizensAssisted?.toString() || "0")}
                        icon={<Users className="h-5 w-5" />}
                        color="blue"
                        sub="Verified on platform"
                    />
                    <ImpactStatsCard
                        label="Benefits Enabled"
                        value={loading ? "..." : stats?.estimatedValue || "₹0L"}
                        icon={<Heart className="h-5 w-5" />}
                        color="rose"
                        sub={`${stats?.benefitsEnabled || 0} direct approvals`}
                    />
                    <ImpactStatsCard
                        label="Trust Score"
                        value={loading ? "..." : stats?.trustScore || "0%"}
                        icon={<Star className="h-5 w-5" />}
                        color="amber"
                        sub="Community validation"
                    />
                </div>

                {/* Regional Demand Column */}
                <Card className="lg:col-span-4 border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden flex flex-col">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black text-[#0F172A]">Regional Demand</CardTitle>
                        <CardDescription className="font-medium">Welfare check-ins by state</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex-1 flex flex-col justify-center">
                        {regionalDemand.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 font-medium italic">
                                Analyze logs to see demand...
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {regionalDemand.slice(0, 5).map((region, i) => (
                                    <div key={region.state} className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                                            <span>{region.state}</span>
                                            <span className="text-blue-600">{region.count}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${(region.count / regionalDemand[0].count) * 100}%`,
                                                    transitionDelay: `${i * 100}ms`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Top Performing Region</p>
                            <div className="flex items-center justify-center gap-3">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                <span className="text-xl font-black text-slate-900">{regionalDemand[0]?.state || "N/A"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Badges/Gamification */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-amber-500" /> Achievements Unlocked
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        <BadgeIcon label="Early Bird" date="Oct 2025" active />
                        <BadgeIcon label="10+ Citizens" date="Nov 2025" active={stats ? stats.citizensAssisted >= 10 : false} />
                        <BadgeIcon label="Privacy Pro" date="Dec 2025" active />
                        <BadgeIcon label="Impact Star" date="2026" active={stats ? stats.benefitsEnabled > 20 : false} />
                        <BadgeIcon label="Gold Level" date="Locked" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

function ImpactStatsCard({ label, value, icon, color, sub }: any) {
    return (
        <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-8">
                <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center mb-6",
                    color === 'blue' && "bg-blue-50 text-blue-600",
                    color === 'rose' && "bg-rose-50 text-rose-600",
                    color === 'amber' && "bg-amber-50 text-amber-600",
                )}>
                    {icon}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h4 className="text-3xl font-black text-slate-900">{value}</h4>
                </div>
                <p className="text-xs font-medium text-slate-500 mt-2">{sub}</p>
            </CardContent>
        </Card>
    )
}

function BadgeIcon({ label, date, active = false }: any) {
    return (
        <div className={cn(
            "flex flex-col items-center p-6 rounded-3xl border-2 transition-all",
            active ? "bg-white border-blue-100 shadow-sm" : "bg-slate-50 border-transparent grayscale opacity-40"
        )}>
            <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center mb-4",
                active ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-200 text-slate-400"
            )}>
                <Trophy className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-slate-900 uppercase text-center leading-tight mb-1">{label}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{date}</p>
        </div>
    )
}

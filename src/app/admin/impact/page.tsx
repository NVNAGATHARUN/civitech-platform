"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Trophy, Users, Heart, Star, Sparkles, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ImpactMapPage() {
    const [impactScore, setImpactScore] = useState(1250)
    const [level, setLevel] = useState("Silver Bridge-Maker")

    const [mounted, setMounted] = useState(false)
    const [dots, setDots] = useState<{ top: string, left: string, delay: string }[]>([])

    useEffect(() => {
        setMounted(true)
        const newDots = [...Array(12)].map(() => ({
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            delay: `${Math.random() * 2}s`
        }))
        setDots(newDots)
    }, [])

    return (
        <DashboardLayout role="volunteer">
            <div className="space-y-10 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Your Impact Map</h2>
                        <p className="text-slate-500 font-medium mt-1">Visualizing the bridge you've built between citizens and welfare.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                        <Trophy className="h-5 w-5 text-emerald-600" />
                        <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Impact Level</p>
                            <p className="text-sm font-black text-emerald-900 leading-none">{level}</p>
                        </div>
                    </div>
                </div>

                {/* Gamification Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <ImpactStatsCard
                        label="Citizens Assisted"
                        value="45"
                        icon={<Users className="h-5 w-5" />}
                        color="blue"
                        sub="Across 12 districts"
                    />
                    <ImpactStatsCard
                        label="Benefits Enabled"
                        value="₹2.4L"
                        icon={<Heart className="h-5 w-5" />}
                        color="rose"
                        sub="Direct social impact"
                    />
                    <ImpactStatsCard
                        label="Trust Score"
                        value="98%"
                        icon={<Star className="h-5 w-5" />}
                        color="amber"
                        sub="Based on 32 reviews"
                    />
                </div>

                {/* Visual Map (Placeholder for Hackathon) */}
                <Card className="border-0 bg-[#0F172A] text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <CardHeader className="p-10 pb-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black">Digital Welfare Bridge</CardTitle>
                                <CardDescription className="text-slate-400 mt-2">Active assistance map across your assigned regions.</CardDescription>
                            </div>
                            <Badge className="bg-blue-500 text-white border-0 px-4 py-1.5 font-bold">LIVE FEED</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-8">
                        <div className="aspect-[21/9] bg-slate-900/50 rounded-3xl border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                            {/* Abstract Map Dots - Generated on Client only to avoid hydration mismatch */}
                            {mounted && dots.map((dot, i) => (
                                <div key={i}
                                    className="absolute h-3 w-3 bg-blue-500 rounded-full animate-pulse border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    style={{
                                        top: dot.top,
                                        left: dot.left,
                                        animationDelay: dot.delay
                                    }}
                                />
                            ))}
                            <div className="text-center space-y-4 relative z-10 transition-transform group-hover:scale-105 duration-700">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-full inline-flex border border-white/20">
                                    <Globe className="h-8 w-8 text-blue-400 animate-spin-slow" />
                                </div>
                                <h4 className="text-xl font-black">Interactive Impact Visualizer</h4>
                                <p className="text-slate-400 max-w-md mx-auto text-sm">Real-time GPS tracking of citizen onboarding (Simulated for Demo).</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-60"></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Badges/Gamification */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-amber-500" /> Achievements Unlocked
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        <BadgeIcon label="Early Bird" date="Oct 2025" />
                        <BadgeIcon label="10+ Citizens" date="Nov 2025" active />
                        <BadgeIcon label="Privacy Pro" date="Dec 2025" active />
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

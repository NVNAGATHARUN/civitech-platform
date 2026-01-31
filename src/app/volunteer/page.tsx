"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Plus,
    User,
    FileText,
    LogOut,
    Users,
    TrendingUp,
    BadgeCheck,
    Search,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function VolunteerPage() {
    const [user, setUser] = useState<string | null>(null)
    const [loginName, setLoginName] = useState("")
    const [beneficiaries, setBeneficiaries] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (loginName.trim()) {
            setUser(loginName)
            fetchBeneficiaries(loginName)
        }
    }

    const fetchBeneficiaries = async (volunteerId: string) => {
        setLoading(true)
        try {
            const { getProfilesByVolunteer } = await import("@/services/profile")
            const list = await getProfilesByVolunteer(volunteerId)
            setBeneficiaries(list)
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[90vh] bg-slate-50">
                <Card className="w-full max-w-md border-slate-200 shadow-xl rounded-2xl overflow-hidden">
                    <div className="h-2 bg-blue-600 w-full" />
                    <CardHeader className="pt-10 pb-6 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Volunteer Portal</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Authorized Personnel Access Only</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-10">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Employee ID / Full Name</label>
                                <Input
                                    className="h-12 border-slate-300 focus:ring-blue-500"
                                    placeholder="e.g. Volunteer-01"
                                    value={loginName}
                                    onChange={e => setLoginName(e.target.value)}
                                />
                            </div>
                            <Button className="w-full h-12 bg-[#0F172A] hover:bg-slate-800 font-bold transition-all" type="submit">
                                IDENTITY VERIFICATION
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <DashboardLayout role="volunteer">
            <div className="space-y-10">
                {/* Metrics Row */}
                <div className="grid gap-6 md:grid-cols-3">
                    <MetricCard
                        icon={<Users className="h-5 w-5" />}
                        label="Active Beneficiaries"
                        value={beneficiaries.length}
                        trend="+2 today"
                        color="blue"
                    />
                    <MetricCard
                        icon={<BadgeCheck className="h-5 w-5" />}
                        label="Token Success Rate"
                        value="94%"
                        trend="High Efficiency"
                        color="emerald"
                    />
                    <MetricCard
                        icon={<TrendingUp className="h-5 w-5" />}
                        label="Impact Score"
                        value="2,450"
                        trend="+120 points"
                        color="amber"
                    />
                </div>

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Assigned Beneficiaries</h2>
                        <p className="text-slate-500 font-medium mt-1">Manage and assist citizens with scheme documentation.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-slate-300 h-11 font-bold">
                            <Search className="mr-2 h-4 w-4" /> FIND CITIZEN
                        </Button>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 h-11 px-6 font-bold shadow-lg shadow-blue-200">
                            <Link href="/check">
                                <Plus className="mr-2 h-5 w-5" /> NEW REGISTRATION
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* List View */}
                {loading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl border border-slate-200"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {beneficiaries.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 text-slate-400">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-bold text-slate-500">No active profiles assigned</h3>
                                <p className="text-sm font-medium mt-1">Start by registering a citizen at the last mile.</p>
                            </div>
                        ) : (
                            beneficiaries.map((b: any) => (
                                <Card key={b.id} className="group hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-md border-slate-200">
                                    <CardContent className="flex items-center p-6 gap-6">
                                        <Avatar className="h-14 w-14 border border-slate-200">
                                            <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-lg">
                                                {b.profileData?.fullName?.[0] || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-bold text-[#0F172A] leading-none">{b.profileData?.fullName}</h4>
                                                <Badge variant="secondary" className="bg-blue-100/50 text-blue-700 text-[10px] font-black uppercase tracking-wider border-0">
                                                    Citizen Verified
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">
                                                {b.profileData?.age} yr old • {b.profileData?.occupation} • {b.profileData?.state}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex flex-col items-end gap-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended</p>
                                            <p className="text-sm font-black text-emerald-600 underline underline-offset-4 decoration-2 decoration-emerald-200">8 Matching Schemes</p>
                                        </div>
                                        <Button variant="ghost" className="h-12 w-12 rounded-full p-0 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100" asChild>
                                            <Link href={`/schemes?uid=${b.id}`}>
                                                <ArrowRight className="h-6 w-6" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

function MetricCard({ icon, label, value, trend, color }: { icon: React.ReactNode, label: string, value: string | number, trend: string, color: "blue" | "emerald" | "amber" }) {
    const colorMap: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100"
    }

    return (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className={`h-1 w-full ${color === 'blue' ? 'bg-blue-600' : color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${colorMap[color]}`}>
                        {icon}
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</p>
                </div>
                <div className="flex items-end justify-between">
                    <h5 className="text-3xl font-black text-[#0F172A]">{value}</h5>
                    <p className={`text-[10px] font-bold uppercase tracking-tighter ${color === 'emerald' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {trend}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

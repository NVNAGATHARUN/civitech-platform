"use client"

import { useState, useEffect } from "react"
import { collection, getCountFromServer } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { seedSchemes } from "@/lib/seed"
import {
    Users,
    FileCheck,
    BarChart,
    Activity,
    TrendingUp,
    AlertCircle,
    Download,
    Database,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from "lucide-react"
import { AdminChart } from "@/components/admin-chart"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { RoleGuard } from "@/components/role-guard"
import { IndiaHeatmap } from "@/components/india-heatmap"
import { EligibilityGraph } from "@/components/eligibility-graph"
import { WelfareBridge } from "@/components/welfare-bridge"
import { RegionalWelfareBridge } from "@/services/analytics"

import { seedRobustSchemes } from "@/lib/seed-robust"

export default function AdminDashboard() {
    const [seeding, setSeeding] = useState(false)
    const handleSeed = async () => {
        if (confirm("This will overwrite existing schemes with robust test data. Continue?")) {
            setSeeding(true)
            await seedRobustSchemes()
            setSeeding(false)
            alert("Robust Schemes Seeded!")
        }
    }

    const [stats, setStats] = useState({
        totalCitizens: 0,
        totalRecommendations: 124,
        statusCounts: {
            shortlisted: 45,
            planned: 20,
            applied: 12,
            received: 5
        },
        topReasons: [
            { reason: "Income Limit Exceeded", count: 85 },
            { reason: "Age Mismatch", count: 42 },
            { reason: "Missing Documentation", count: 30 }
        ]
    })
    const [regionalDemand, setRegionalDemand] = useState<any[]>([])
    const [bridgeData, setBridgeData] = useState<RegionalWelfareBridge[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const coll = collection(db, "citizenProfiles");
                const snapshot = await getCountFromServer(coll);

                const { getSchemeAnalytics } = await import("@/services/schemeStatus");
                const analytics = await getSchemeAnalytics();

                const { getRegionalDemand, getRegionalWelfareBridge } = await import("@/services/analytics");
                const regional = await getRegionalDemand();
                const bridge = await getRegionalWelfareBridge();
                setRegionalDemand(regional);
                setBridgeData(bridge);

                setStats(prev => ({
                    ...prev,
                    totalCitizens: snapshot.data().count,
                    totalRecommendations: analytics.totalRecommendations,
                    statusCounts: {
                        shortlisted: analytics.statusCounts.planned,
                        applied: analytics.statusCounts.applied,
                        received: analytics.statusCounts.benefit_received,
                        planned: analytics.statusCounts.planned,
                    },
                    topReasons: analytics.topReasons.length > 0 ? analytics.topReasons : prev.topReasons
                }))
            } catch (error) {
                console.error("Error fetching stats:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    return (
        <RoleGuard allowedRoles={['admin']}>
            <DashboardLayout role="admin">
                <div className="space-y-10">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Governance Intelligence</h2>
                            <p className="text-slate-500 font-medium mt-1">Real-time engagement metrics and scheme funnel analysis.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="border-slate-300 h-11 font-bold" onClick={handleSeed}>
                                <Database className="mr-2 h-4 w-4" /> SEED REPOSITORY
                            </Button>
                            <Button className="bg-[#0F172A] hover:bg-slate-800 h-11 px-6 font-bold shadow-lg shadow-blue-100">
                                <Download className="mr-2 h-4 w-4" /> EXPORT REPORT
                            </Button>
                        </div>
                    </div>

                    {/* KPI Row */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <KPIComponent
                            label="Total Assessed"
                            value={loading ? "..." : stats.totalCitizens}
                            trend="+12%"
                            icon={<Users className="h-4 w-4" />}
                            color="blue"
                        />
                        <KPIComponent
                            label="Matches Found"
                            value={stats.totalRecommendations}
                            trend="+8%"
                            icon={<TrendingUp className="h-4 w-4" />}
                            color="emerald"
                        />
                        <KPIComponent
                            label="Active Funnel"
                            value={stats.statusCounts.applied}
                            trend="+15%"
                            icon={<BarChart className="h-4 w-4" />}
                            color="indigo"
                        />
                        <KPIComponent
                            label="Doc Readiness"
                            value="68%"
                            trend="-2%"
                            icon={<Activity className="h-4 w-4" />}
                            color="amber"
                        />
                    </div>

                    {/* India Heatmap - ENHANCED SECTION */}
                    <IndiaHeatmap data={regionalDemand} />

                    {/* Eligibility Graph - NEW SECTION */}
                    <div className="grid gap-10">
                        <EligibilityGraph />
                    </div>

                    {/* Regional Welfare Bridge */}
                    <div className="grid gap-10">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">Regional Welfare Bridge</h3>
                            <p className="text-slate-500 font-medium">Analyzing the conversion gap between scheme interest and benefit delivery.</p>
                        </div>
                        <WelfareBridge data={bridgeData} />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Funnel Chart */}
                        <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all hover-lift">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-black text-[#0F172A]">Engagement Funnel</CardTitle>
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-0">Live Performance</Badge>
                                </div>
                                <CardDescription className="text-slate-500 mt-1">User journey from discovery to benefit receipt.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <AdminChart statusCounts={stats.statusCounts as any} />
                            </CardContent>
                        </Card>

                        {/* Funnel Drop-offs */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all hover-lift">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                <CardTitle className="text-lg font-black text-[#0F172A]">Drop-off Analysis</CardTitle>
                                <CardDescription className="text-slate-500 mt-1">Primary reasons for ineligibility.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {stats.topReasons.map((item, i) => (
                                        <div key={i} className="group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-slate-700">{item.reason}</span>
                                                <span className="text-xs font-black text-slate-400">{item.count}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-amber-500 h-full transition-all duration-1000 group-hover:bg-amber-600"
                                                    style={{ width: `${Math.min(item.count, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <div className="flex gap-3">
                                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                                            <strong className="text-slate-700">Action Recommended:</strong> High drop-off due to income limits suggests a need for middle-income specific programs.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </RoleGuard>
    )
}

function KPIComponent({ label, value, trend, icon, color }: { label: string, value: string | number, trend: string, icon: React.ReactNode, color: string }) {
    return (
        <Card className="border-slate-200 shadow-sm hover:shadow-xl transition-all hover-lift group">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg transition-colors group-hover:scale-110 duration-500",
                        color === "blue" && "bg-blue-50 text-blue-600",
                        color === "emerald" && "bg-emerald-50 text-emerald-600",
                        color === "indigo" && "bg-indigo-50 text-indigo-600",
                        color === "amber" && "bg-amber-50 text-amber-600",
                    )}>
                        {icon}
                    </div>
                    <div className={cn("flex items-center text-[10px] font-black py-1 px-2 rounded-sm",
                        trend.startsWith('+') ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    )}>
                        {trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                        {trend}
                    </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h4 className="text-2xl font-black text-[#0F172A]">{value}</h4>
            </CardContent>
        </Card>
    )
}

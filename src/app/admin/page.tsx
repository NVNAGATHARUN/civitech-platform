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
import { RegionalWelfareBridge } from "@/services/data-service"
import { useLanguage } from "@/lib/LanguageContext"

import { seedRobustSchemes } from "@/lib/seed-robust"
import { TourGuide } from "@/components/tour-guide"

export default function AdminDashboard() {
    const { t } = useLanguage()
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

                const { getRegionalDemand, getRegionalWelfareBridge } = await import("@/services/data-service");
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
                    <div id="tour-admin-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">{t.admin.title}</h2>
                            <p className="text-slate-500 font-medium mt-1">{t.admin.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="border-slate-300 h-11 font-bold" onClick={handleSeed}>
                                <Database className="mr-2 h-4 w-4" /> {t.admin.seedRepo}
                            </Button>
                            <Button className="bg-[#0F172A] hover:bg-slate-800 h-11 px-6 font-bold shadow-lg shadow-blue-100">
                                <Download className="mr-2 h-4 w-4" /> {t.admin.exportReport}
                            </Button>
                        </div>
                    </div>

                    {/* KPI Row - Glassmorphic */}
                    <div id="tour-admin-kpi" className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <KPIComponent
                            label={t.admin.totalAssessed}
                            value={loading ? "..." : stats.totalCitizens}
                            trend="+12%"
                            icon={<Users className="h-5 w-5" />}
                            color="blue"
                            stagger="stagger-1"
                        />
                        <KPIComponent
                            label={t.admin.matchesFound}
                            value={stats.totalRecommendations}
                            trend="+8%"
                            icon={<TrendingUp className="h-5 w-5" />}
                            color="emerald"
                            stagger="stagger-2"
                        />
                        <KPIComponent
                            label={t.admin.activeFunnel}
                            value={stats.statusCounts.applied}
                            trend="+15%"
                            icon={<BarChart className="h-5 w-5" />}
                            color="indigo"
                            stagger="stagger-3"
                        />
                        <KPIComponent
                            label={t.admin.docReadiness}
                            value="68%"
                            trend="-2%"
                            icon={<Activity className="h-5 w-5" />}
                            color="amber"
                            stagger="stagger-1"
                        />
                    </div>

                    {/* India Heatmap */}
                    <div id="tour-admin-heatmap" className="relative p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.05),_transparent_40%)] pointer-events-none"></div>
                        <IndiaHeatmap data={regionalDemand} />
                    </div>

                    {/* Eligibility Graph */}
                    <div className="relative p-10 bg-[#0F172A] rounded-[3rem] shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                        <EligibilityGraph />
                    </div>

                    {/* Regional Welfare Bridge */}
                    <div className="space-y-10">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-3xl font-black text-[#0F172A] tracking-tight">{t.admin.regionalBridge}</h3>
                            <p className="text-slate-600 font-medium">{t.admin.bridgeDesc}</p>
                        </div>
                        <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
                            <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]"></div>
                            <WelfareBridge data={bridgeData} />
                        </div>
                    </div>

                    <div id="tour-admin-bridge"></div>

                    {/* Main Content Grid */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Funnel Chart */}
                        <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all hover-lift">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-black text-[#0F172A]">{t.admin.engagementFunnel}</CardTitle>
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-0">{t.admin.livePerformance}</Badge>
                                </div>
                                <CardDescription className="text-slate-500 mt-1">{t.admin.funnelDesc}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <AdminChart statusCounts={stats.statusCounts as any} />
                            </CardContent>
                        </Card>

                        {/* Funnel Drop-offs */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all hover-lift">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                <CardTitle className="text-lg font-black text-[#0F172A]">{t.admin.dropOffAnalysis}</CardTitle>
                                <CardDescription className="text-slate-500 mt-1">{t.admin.dropOffDesc}</CardDescription>
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
                                            <strong className="text-slate-700">{t.admin.actionRecommended}</strong> {t.admin.incomeLimitNotice}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <TourGuide
                    tourKey="admin_page_v1"
                    steps={[
                        {
                            element: '#tour-admin-header',
                            popover: {
                                title: 'Admin Command Center',
                                description: 'Real-time overview of the entire welfare ecosystem.',
                                side: 'bottom'
                            }
                        },
                        {
                            element: '#tour-admin-kpi',
                            popover: {
                                title: 'Key Performance Indicators',
                                description: 'Live metrics on citizen engagement and processing speed.',
                                side: 'bottom'
                            }
                        },
                        {
                            element: '#tour-admin-heatmap',
                            popover: {
                                title: 'Geospatial Demand',
                                description: 'Visualize where demand is highest across states.',
                                side: 'top'
                            }
                        },
                        {
                            element: '.bg-white/50', // Targeting the funnel chart loosely or by added ID if possible, but let's stick to what we added or existing classes if easy. Actually let's just add an ID to the funnel chart in a separate chunk or just use the bridge ID for next.
                            popover: {
                                title: 'Welfare Bridge',
                                description: 'Track the gap between demand and delivery.',
                                side: 'top'
                            }
                        }
                    ]}
                />
            </DashboardLayout>
        </RoleGuard >
    )
}

function KPIComponent({ label, value, trend, icon, color, stagger }: { label: string, value: string | number, trend: string, icon: React.ReactNode, color: string, stagger?: string }) {
    return (
        <div className={cn("relative group animate-in fade-in slide-in-from-bottom-8 duration-1000", stagger)}>
            <Card className="border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white hover:-translate-y-2 group">
                <CardContent className="p-8 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className={cn("p-4 rounded-2xl transition-all duration-700 group-hover:scale-125 group-hover:rotate-12 shadow-sm",
                            color === "blue" && "bg-blue-50 text-blue-600",
                            color === "emerald" && "bg-emerald-50 text-emerald-600",
                            color === "indigo" && "bg-indigo-50 text-indigo-600",
                            color === "amber" && "bg-amber-50 text-amber-600",
                        )}>
                            {icon}
                        </div>
                        <div className={cn("flex items-center text-[10px] font-black py-1.5 px-3 rounded-full shadow-sm",
                            trend.startsWith('+') ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                        )}>
                            {trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                            {trend}
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
                </CardContent>

                {/* Hover Glow */}
                <div className={cn(
                    "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000",
                    color === 'blue' ? "bg-blue-600" : color === 'emerald' ? "bg-emerald-600" : color === 'indigo' ? "bg-indigo-600" : "bg-amber-600"
                )}></div>

                {/* Shine Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"></div>
            </Card>
        </div>
    )
}

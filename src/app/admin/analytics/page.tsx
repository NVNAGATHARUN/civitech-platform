"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts"
import {
    TrendingUp,
    Users,
    Map,
    Activity,
    PieChart as PieIcon,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Calendar,
    Download
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/LanguageContext"

const DEMO_DATA = {
    ageDistribution: [
        { age: "18-25", count: 450, color: "#3B82F6" },
        { age: "26-35", count: 820, color: "#60A5FA" },
        { age: "36-50", count: 610, color: "#93C5FD" },
        { age: "50+", count: 320, color: "#BFDBFE" },
    ],
    incomeTiers: [
        { tier: "< 1L", count: 1200 },
        { tier: "1L - 3L", count: 850 },
        { tier: "3L - 5L", count: 420 },
        { tier: "> 5L", count: 180 },
    ],
    trends: [
        { month: 'Sep', applications: 400, verified: 240 },
        { month: 'Oct', applications: 700, verified: 550 },
        { month: 'Nov', applications: 900, verified: 780 },
        { month: 'Dec', applications: 1200, verified: 1050 },
        { month: 'Jan', applications: 1560, verified: 1420 },
    ]
}

export default function AnalyticsPage() {
    const { t } = useLanguage()
    return (
        <RoleGuard allowedRoles={['admin']}>
            <DashboardLayout role="admin">
                <div className="space-y-10 pb-20">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">{t.admin.analytics.title}</h2>
                            <p className="text-slate-500 font-medium">{t.admin.analytics.desc}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-11 border-slate-200 font-bold">
                                <Calendar className="mr-2 h-4 w-4" /> {t.admin.analytics.last30Days}
                            </Button>
                            <Button className="h-11 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200">
                                <Download className="mr-2 h-4 w-4" /> {t.admin.analytics.exportReport}
                            </Button>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Application Trends */}
                        <Card className="border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all hover-lift">
                            <CardHeader className="p-8 pb-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-black text-[#0F172A]">{t.admin.analytics.volumeTrends}</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium">{t.admin.analytics.volumeDesc}</CardDescription>
                                    </div>
                                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={DEMO_DATA.trends}>
                                        <defs>
                                            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}
                                        />
                                        <Area type="monotone" dataKey="applications" name={t.admin.analytics.applications} stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                                        <Area type="monotone" dataKey="verified" name={t.admin.analytics.verifiedStat} stroke="#10B981" strokeWidth={3} fillOpacity={0} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Age Distribution */}
                        <Card className="border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all hover-lift">
                            <CardHeader className="p-8 pb-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-black text-[#0F172A]">{t.admin.analytics.ageDemographics}</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium">{t.admin.analytics.ageDesc}</CardDescription>
                                    </div>
                                    <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <Users className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={DEMO_DATA.ageDistribution}
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={8}
                                            dataKey="count"
                                            nameKey="age"
                                        >
                                            {DEMO_DATA.ageDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center gap-6 -mt-10">
                                    {DEMO_DATA.ageDistribution.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.age}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Income Tiers */}
                        <Card className="border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all hover-lift lg:col-span-2">
                            <CardHeader className="p-8 pb-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-black text-[#0F172A]">{t.admin.analytics.incomeBreakdown}</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium">{t.admin.analytics.incomeDesc}</CardDescription>
                                    </div>
                                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                        <Activity className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={DEMO_DATA.incomeTiers}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis dataKey="tier" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} />
                                        <Tooltip
                                            cursor={{ fill: '#F8FAFC' }}
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </RoleGuard>
    )
}

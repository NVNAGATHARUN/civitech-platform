"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    Filter,
    MoreVertical,
    User,
    Mail,
    Calendar,
    MapPin,
    FileText,
    ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/LanguageContext"

export default function CitizensPage() {
    const { t } = useLanguage()
    const [citizens, setCitizens] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchCitizens = async () => {
            try {
                const q = query(collection(db, "citizenProfiles"), limit(50));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCitizens(data);
            } catch (error) {
                console.error("Error fetching citizens:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCitizens();
    }, []);

    const filteredCitizens = citizens.filter(c =>
        c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id?.includes(searchTerm)
    );

    return (
        <RoleGuard allowedRoles={['admin']}>
            <DashboardLayout role="admin">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">{t.admin.directory.title}</h2>
                            <p className="text-slate-500 font-medium">{t.admin.directory.desc}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder={t.admin.directory.search}
                                    className="pl-10 h-11 border-slate-200 bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="h-11 border-slate-200">
                                <Filter className="mr-2 h-4 w-4" /> {t.admin.directory.filter}
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                            <div className="h-10 w-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.admin.directory.loading}</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-200">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.admin.directory.thCitizen}</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.admin.directory.thDemographics}</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.admin.directory.thStatus}</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.admin.directory.thActivity}</th>
                                        <th className="px-8 py-5 text-right font-black text-slate-400 uppercase tracking-widest"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCitizens.map((citizen) => (
                                        <tr key={citizen.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 leading-none">{citizen.fullName || t.admin.directory.anonymous}</p>
                                                        <p className="text-xs text-slate-500 mt-1 font-medium">{citizen.email || t.admin.directory.noEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                        <Calendar className="h-3 w-3 text-slate-400" /> {citizen.age || 'N/A'} yrs
                                                        <span className="text-slate-200">|</span>
                                                        <MapPin className="h-3 w-3 text-slate-400" /> {citizen.state || 'Unknown'}
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Income: ₹{Number(citizen.annualIncome).toLocaleString() || '0'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge className={cn(
                                                    "rounded-full font-black text-[10px] uppercase tracking-widest px-3 py-1 border-0",
                                                    citizen.isVerified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                                )}>
                                                    {citizen.isVerified ? t.admin.directory.verified : t.admin.directory.pending}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium italic">
                                                    <FileText className="h-3 w-4 text-slate-400" />
                                                    {citizen.lastChecked || t.admin.directory.noActivity}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all group-hover:scale-110">
                                                    <ArrowRight className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCitizens.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                                                    <User className="h-10 w-10 text-slate-400" />
                                                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest">{t.admin.directory.noResults}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </RoleGuard>
    )
}

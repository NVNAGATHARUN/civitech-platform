"use client"

import { ProfileForm } from "@/components/profile-form"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/LanguageContext"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { getUserSchemeStatuses } from "@/services/schemeStatus"
import { getAllSchemes } from "@/services/schemes"
import { CitizenSchemeStatus, Scheme, Beneficiary } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Send, CheckCircle2, LayoutDashboard, UserCircle, Settings2, Users, Trash2, FileText, Plus, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusTimeline } from "@/components/status-timeline"
import { getUserBeneficiaries, addBeneficiary, deleteBeneficiary } from "@/services/beneficiaries"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DocumentVault } from "@/components/document-vault"

export default function ProfilePage() {
    const { language, t } = useLanguage()
    const [user, setUser] = useState<any>(null)
    const [trackedSchemes, setTrackedSchemes] = useState<(CitizenSchemeStatus & { scheme?: Scheme })[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'profile' | 'schemes' | 'beneficiaries' | 'vault'>('profile')
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [newBen, setNewBen] = useState({ name: "", relation: "", age: "" })

    const handleAddBeneficiary = async () => {
        if (!user || !newBen.name || !newBen.relation || !newBen.age) return

        try {
            const benData: Partial<Beneficiary> = {
                name: newBen.name,
                relation: newBen.relation,
                age: parseInt(newBen.age),
                status: 'Processing'
            }
            await addBeneficiary(user.uid, benData)
            const updated = await getUserBeneficiaries(user.uid)
            setBeneficiaries(updated)
            setIsSuccess(true)
            setTimeout(() => {
                setIsAddModalOpen(false)
                setIsSuccess(false)
                setNewBen({ name: "", relation: "", age: "" })
            }, 1500)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteBeneficiary = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await deleteBeneficiary(id)
            setBeneficiaries(beneficiaries.filter(b => b.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    // ... rest of useEffect remains the same

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                const statuses = await getUserSchemeStatuses(currentUser.uid)
                const schemes = await getAllSchemes()

                const combined = statuses.map(status => ({
                    ...status,
                    scheme: schemes.find(s => s.id === status.schemeId)
                }))

                setTrackedSchemes(combined)

                const benList = await getUserBeneficiaries(currentUser.uid)
                setBeneficiaries(benList)
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Dashboard...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-48 animate-in fade-in duration-700">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="space-y-2">
                    <h1 className={cn(
                        "text-4xl font-black text-slate-900 tracking-tight",
                        language !== 'en' ? "leading-tight" : ""
                    )}>{t.dashboard.title}</h1>
                    <p className="text-slate-500 font-medium">{t.dashboard.subtitle}</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all hover-lift shrink-0",
                            activeTab === 'profile' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <UserCircle className="h-4 w-4" /> {t.dashboard.tabs.identity}
                    </button>
                    <button
                        onClick={() => setActiveTab('schemes')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all hover-lift shrink-0",
                            activeTab === 'schemes' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <LayoutDashboard className="h-4 w-4" /> {t.dashboard.tabs.tracker}
                        {trackedSchemes.length > 0 && <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{trackedSchemes.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('beneficiaries')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all hover-lift shrink-0",
                            activeTab === 'beneficiaries' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Users className="h-4 w-4" /> {t.dashboard.tabs.beneficiaries}
                    </button>
                    <button
                        onClick={() => setActiveTab('vault')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all hover-lift shrink-0",
                            activeTab === 'vault' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <ShieldCheck className="h-4 w-4" /> {t.dashboard.tabs.vault}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {activeTab === 'profile' && (
                    <div className="animate-in slide-in-from-left-4 duration-500">
                        <ProfileForm />
                    </div>
                )}

                {activeTab === 'schemes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
                        {trackedSchemes.length > 0 ? (
                            trackedSchemes.map((item) => (
                                <Card key={item.id} className="border-0 bg-white shadow-sm rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all group border border-slate-100 hover-lift">
                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge className={cn(
                                                "rounded-full font-black text-[10px] uppercase tracking-widest px-3 py-1",
                                                item.status === 'applied' ? "bg-blue-100 text-blue-600" :
                                                    item.status === 'benefit_received' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
                                            )}>
                                                {item.status.replace('_', ' ')}
                                            </Badge>
                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                Updated {new Date(item.updatedAt.toDate()).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{item.scheme?.name || 'Unknown Scheme'}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0">
                                        <div className="mt-6 border-t border-slate-50 pt-8">
                                            <StatusTimeline currentStatus={item.status} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl text-slate-300">
                                    <Bookmark className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-black text-slate-400">No schemes tracked yet</h3>
                                <p className="text-slate-400 font-medium">Head to the schemes explorer to shortlist programs.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'beneficiaries' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                            <DialogTrigger asChild>
                                <button
                                    className="aspect-[4/3] bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group hover:border-blue-500 hover:bg-blue-50/20 transition-all"
                                >
                                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Users className="h-7 w-7" />
                                    </div>
                                    <span className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-blue-600">{t.dashboard.addBeneficiary}</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black text-slate-900">{t.dashboard.addBeneficiary}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                        <Input
                                            placeholder="Rahul Kumar"
                                            value={newBen.name}
                                            onChange={e => setNewBen({ ...newBen, name: e.target.value })}
                                            className="h-12 border-slate-200"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Relation</Label>
                                            <Input
                                                placeholder="e.g. Son"
                                                value={newBen.relation}
                                                onChange={e => setNewBen({ ...newBen, relation: e.target.value })}
                                                className="h-12 border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Age</Label>
                                            <Input
                                                type="number"
                                                placeholder="24"
                                                value={newBen.age}
                                                onChange={e => setNewBen({ ...newBen, age: e.target.value })}
                                                className="h-12 border-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    {isSuccess ? (
                                        <div className="w-full h-14 bg-emerald-500 text-white font-black rounded-xl flex items-center justify-center gap-2 animate-in zoom-in">
                                            <CheckCircle2 className="h-5 w-5" /> SAVED SUCCESSFULLY
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleAddBeneficiary}
                                            className="w-full h-14 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all"
                                        >
                                            {t.dashboard.saveBeneficiary}
                                        </button>
                                    )}
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {beneficiaries.map(ben => (
                            <Card key={ben.id} className="group hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl border border-slate-100 p-8 space-y-6 relative">
                                <button
                                    onClick={() => handleDeleteBeneficiary(ben.id!)}
                                    className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                        <UserCircle className="h-6 w-6" />
                                    </div>
                                    <Badge className={cn(
                                        "border-0 rounded-full font-black text-[10px] uppercase tracking-widest px-3 py-1",
                                        ben.status === 'Verified' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                    )}>
                                        {ben.status}
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">{ben.name}</h3>
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">{ben.relation} • {ben.age} Years</p>
                                </div>
                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">0 Schemes</span>
                                    </div>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">View Eligibility</button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

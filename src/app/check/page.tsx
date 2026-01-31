"use client"

import { useState, useMemo } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getSchemesForProfile, SchemeWithReason } from "@/services/schemes"
import { CitizenProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { LocalDocVerifier } from "@/components/local-doc-verifier"
import Link from "next/link"
import {
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    FileText,
    ShieldCheck,
    Lock,
    Search,
    ChevronLeft,
    Sparkles,
    Fingerprint,
    MapPin,
    UserCheck,
    Wallet
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/LanguageContext"

export default function CitizenCheckPage() {
    const { t } = useLanguage()
    const [step, setStep] = useState<'form' | 'results'>('form')
    const [loading, setLoading] = useState(false)
    const [matches, setMatches] = useState<SchemeWithReason[]>([])

    // Form State - Matches CitizenProfile interface
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "Male" as "Male" | "Female" | "Other",
        occupation: "Student",
        incomeBand: "1–3L" as "<1L" | "1–3L" | ">3L",
        incomeValue: "",
        state: "Maharashtra",
        district: ""
    })

    // Doc Readiness (Local UI only)
    const [docs, setDocs] = useState({
        aadhaar: false,
        incomeCert: false,
        casteCert: false,
        rationCard: false
    })

    const progressScore = useMemo(() => {
        const total = Object.keys(docs).length
        const completed = Object.values(docs).filter(Boolean).length
        return Math.round((completed / total) * 100)
    }, [docs])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // STEP 3: Submit Builds CitizenProfile
            const profile: CitizenProfile = {
                userId: "temp-" + Math.random().toString(36).substr(2, 9),
                managedBy: 'self',
                profileData: {
                    name: formData.name || "Anonymous Citizen",
                    age: parseInt(formData.age) || 0,
                    education: "Unknown", // Added to match interface
                    income: parseInt(formData.incomeValue) || 0,
                    caste: "General", // Added to match interface
                    state: formData.state,
                    occupationTags: [formData.occupation]
                },
                documentStatus: {},
                createdAt: new Date() as any
            }

            // Optional: Store in Firestore for tracking (demo purpose)
            await addDoc(collection(db, "citizenAssessmentLog"), {
                ...profile,
                createdAt: new Date(),
                userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : "unknown"
            });

            // STEP 2: Call getSchemesForProfile
            const results = await getSchemesForProfile(profile)
            setMatches(results)
            setStep('results')

        } catch (err) {
            console.error("Submission Error:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-4 px-8 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <h1 className={cn(
                            "text-lg font-bold text-[#0F172A] uppercase tracking-wider",
                            t.check.title.match(/[\u0900-\u0C7F]/) ? "leading-tight" : ""
                        )}>
                            {t.check.title}
                        </h1>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1 font-bold">
                            <Lock className="h-3 w-3 mr-2" /> DATA PRIVACY ACTIVE
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-10 px-6 sm:px-8">
                {step === 'form' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div>
                                <h2 className={cn(
                                    "text-3xl font-black text-[#0F172A] mb-2 font-display",
                                    t.check.profile.match(/[\u0900-\u0C7F]/) ? "leading-tight py-2" : ""
                                )}>{t.check.profile}</h2>
                                <p className="text-slate-500 font-medium">Accurate details help us find the best matching welfare programs.</p>
                            </div>

                            <form onSubmit={handleSearch} className="space-y-6">
                                <Card className="border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                            <UserCheck className="h-4 w-4" />
                                            Demographics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-6 sm:grid-cols-2 p-6">
                                        <div className="space-y-2 sm:col-span-1">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</Label>
                                            <Input className="h-12 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Rahul Kumar" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</Label>
                                            <Input required type="number" className="h-12 border-slate-200 rounded-lg" placeholder="24" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</Label>
                                            <Select value={formData.gender} onValueChange={(v: any) => setFormData({ ...formData, gender: v })}>
                                                <SelectTrigger className="h-12 border-slate-200 rounded-lg"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupation</Label>
                                            <Select value={formData.occupation} onValueChange={(v: string) => setFormData({ ...formData, occupation: v })}>
                                                <SelectTrigger className="h-12 border-slate-200 rounded-lg"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Student">Student</SelectItem>
                                                    <SelectItem value="Farmer">Farmer</SelectItem>
                                                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                                                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                                                    <SelectItem value="Worker">Worker</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                            <Wallet className="h-4 w-4" />
                                            Financial & Regional
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-6 sm:grid-cols-2 p-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Income Band</Label>
                                            <Select value={formData.incomeBand} onValueChange={(v: any) => setFormData({ ...formData, incomeBand: v })}>
                                                <SelectTrigger className="h-12 border-slate-200 rounded-lg"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="<1L">Under ₹1 Lakh</SelectItem>
                                                    <SelectItem value="1–3L">₹1 – ₹3 Lakhs</SelectItem>
                                                    <SelectItem value=">3L">Above ₹3 Lakhs</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State</Label>
                                            <Select value={formData.state} onValueChange={(v: string) => setFormData({ ...formData, state: v })}>
                                                <SelectTrigger className="h-12 border-slate-200 rounded-lg"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                                    <SelectItem value="Delhi">Delhi</SelectItem>
                                                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                                                    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                                                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">District</Label>
                                            <Input className="h-12 border-slate-200 rounded-lg" placeholder="e.g. Pune" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Document Checklist
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-4 sm:grid-cols-2 p-6">
                                        <DocCheckbox id="aadhaar" label="Aadhaar Card" checked={docs.aadhaar} onChange={c => setDocs({ ...docs, aadhaar: c })} />
                                        <DocCheckbox id="income" label="Income Certificate" checked={docs.incomeCert} onChange={c => setDocs({ ...docs, incomeCert: c })} />
                                        <DocCheckbox id="caste" label="Caste Certificate" checked={docs.casteCert} onChange={c => setDocs({ ...docs, casteCert: c })} />
                                        <DocCheckbox id="ration" label="Ration Card" checked={docs.rationCard} onChange={c => setDocs({ ...docs, rationCard: c })} />
                                    </CardContent>
                                </Card>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-16 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all rounded-xl"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-3">
                                            <Sparkles className="h-5 w-5 animate-pulse" />
                                            ANALYZING ELIGIBILITY...
                                        </span>
                                    ) : (
                                        <>FIND MATCHING SCHEMES <ArrowRight className="ml-2 h-5 w-5" /></>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Right Sticky Column */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
                            <Card className="bg-[#0F172A] text-white border-0 rounded-2xl shadow-2xl overflow-hidden p-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Application Readiness</h3>
                                        <ShieldCheck className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-24 h-24 shrink-0">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                                                <circle
                                                    className="text-blue-500 transition-all duration-1000 ease-out"
                                                    strokeWidth="8"
                                                    strokeDasharray={2 * Math.PI * 40}
                                                    strokeDashoffset={2 * Math.PI * 40 * (1 - progressScore / 100)}
                                                    strokeLinecap="round"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="40" cx="48" cy="48"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center font-black text-2xl tracking-tighter">
                                                {progressScore}%
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-100">Verification Strength</p>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                                Based on your documents, you can instantly verify for 28% of schemes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                                <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-amber-900">Important Note</p>
                                    <p className="text-xs text-amber-700/80 leading-relaxed">
                                        This is a preliminary check. Final approval happens at the government office.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'results' && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                            <div>
                                <h2 className={cn(
                                    "text-4xl font-black text-[#0F172A] font-display",
                                    t.check.matches.match(/[\u0900-\u0C7F]/) ? "leading-tight py-2" : ""
                                )}>{t.check.matches}</h2>
                                <p className="text-slate-500 font-medium mt-1">
                                    We found {matches.length} program{matches.length !== 1 ? 's' : ''} for your profile.
                                </p>
                            </div>
                            <Button variant="outline" className="h-12 px-6 font-bold border-slate-200 rounded-xl" onClick={() => setStep('form')}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> MODIFY PROFILE
                            </Button>
                        </div>

                        {matches.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <div className="p-6 bg-slate-50 rounded-full">
                                    <Search className="h-12 w-12 text-slate-300" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-[#0F172A]">No schemes found</h3>
                                    <p className="text-slate-500 max-w-sm font-medium">Try broadening your criteria or checking for general schemes in the repository.</p>
                                </div>
                                <Button className="bg-[#0F172A] hover:bg-slate-800 h-12 px-8 font-bold rounded-xl" asChild>
                                    <Link href="/schemes">BROWSE ALL SCHEMES</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {matches.map(({ scheme, matchReason }) => (
                                    <Card key={scheme.id} className="flex flex-col border-slate-200 transition-all duration-300 hover:shadow-2xl hover:border-blue-300 rounded-2xl overflow-hidden bg-white">
                                        <div className="bg-blue-600 h-1.5 w-full" />
                                        <CardHeader className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge className="bg-emerald-100 text-emerald-800 border-0 font-bold px-3">
                                                    ELIGIBLE
                                                </Badge>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{scheme.category}</span>
                                            </div>
                                            <CardTitle className="text-xl font-black text-[#0F172A] leading-7">{scheme.name}</CardTitle>
                                        </CardHeader>

                                        <CardContent className="px-6 flex-1 space-y-6">
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed">{scheme.descriptionSimple}</p>

                                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                                <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 tracking-widest flex items-center gap-2">
                                                    <Sparkles className="h-3 w-3" /> Why it matches
                                                </p>
                                                <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                                                    {matchReason}
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Proof</p>
                                                <div className="space-y-2">
                                                    {scheme.documentsRequired.map(d => (
                                                        <div key={d} className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-slate-600">{d}</span>
                                                            <CheckCircle2 className={cn(
                                                                "h-4 w-4 transition-colors",
                                                                (docs as any)[d.toLowerCase().replace(" ", "")] || (docs as any)[d.toLowerCase().includes("aadhaar") ? "aadhaar" : ""] ? "text-emerald-500" : "text-slate-200"
                                                            )} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-6 pt-0">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full h-12 gap-3 bg-[#0F172A] hover:bg-slate-800 font-black tracking-tight rounded-xl shadow-lg">
                                                        <Fingerprint className="h-4 w-4" />
                                                        VERIFY ELIGIBILITY
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-2xl bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
                                                    <div className="p-10">
                                                        <div className="mb-8 flex items-center justify-between">
                                                            <div>
                                                                <DialogTitle className="text-2xl font-black text-[#0F172A]">Eligibility Attestation</DialogTitle>
                                                                <DialogDescription className="text-slate-500 font-medium">Verify your documents to generate a secure digital token.</DialogDescription>
                                                            </div>
                                                            <div className="p-2 bg-blue-50 rounded-full"><Lock className="h-5 w-5 text-blue-600" /></div>
                                                        </div>
                                                        <LocalDocVerifier
                                                            scheme={scheme}
                                                            onTokenCreated={(token) => alert(`Secure Attestation Success: ${token.tokenString}`)}
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function DocCheckbox({ id, label, checked, onChange }: { id: string, label: string, checked: boolean, onChange: (c: boolean) => void }) {
    return (
        <label
            htmlFor={id}
            className={cn(
                "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                checked ? "bg-blue-50 border-blue-600 shadow-sm" : "bg-white border-slate-100 hover:border-slate-200"
            )}
        >
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={onChange}
                className="h-5 w-5 rounded border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <span className={cn(
                "text-sm font-bold tracking-tight select-none",
                checked ? "text-blue-900" : "text-slate-600"
            )}>
                {label}
            </span>
        </label>
    )
}

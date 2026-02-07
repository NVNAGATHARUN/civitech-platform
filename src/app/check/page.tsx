"use client"

import { useState, useMemo } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getSchemesForProfile, getFuturePredictions, SchemeWithReason, FuturePrediction } from "@/services/schemes"
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
import { DraftService } from "@/services/drafts"
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
    Wallet,
    Printer,
    Share2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/LanguageContext"
import { TourGuide } from "@/components/tour-guide"
import { EligibilityReport } from "@/components/eligibility-report"
import { SchemeComparison } from "@/components/scheme-comparison"
import { SchemeExpiryTracker } from "@/components/scheme-expiry-tracker"
import { ServiceCenterLocator } from "@/components/service-center-locator"
import { Clock } from "lucide-react"
import { PredictiveTimeline } from "@/components/predictive-timeline"


export default function CitizenCheckPage() {
    const { language, t } = useLanguage()
    const [step, setStep] = useState<'form' | 'results'>('form')
    const [loading, setLoading] = useState(false)
    const [draftSaved, setDraftSaved] = useState(false)
    const [matches, setMatches] = useState<SchemeWithReason[]>([])
    const [futureMatches, setFutureMatches] = useState<FuturePrediction[]>([])
    const [printProfile, setPrintProfile] = useState<CitizenProfile | null>(null)
    const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
    const [isComparisonOpen, setIsComparisonOpen] = useState(false)
    const [isLocatorOpen, setIsLocatorOpen] = useState(false)


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
                    gender: formData.gender,
                    education: "Unknown", // Added to match interface
                    income: parseInt(formData.incomeValue) || 0,
                    caste: "General", // Added to match interface
                    state: formData.state,
                    district: formData.district,
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

            // STEP 2: Call getSchemesForProfile and getFuturePredictions
            const results = await getSchemesForProfile(profile)
            const predictions = await getFuturePredictions(profile)
            setMatches(results)
            setFutureMatches(predictions)
            setPrintProfile(profile)
            setStep('results')

        } finally {
            setLoading(false)
            setSelectedForComparison([])
        }
    }

    const handleWhatsAppShare = () => {
        if (matches.length === 0) return

        const docList = Array.from(new Set(matches.flatMap(m => m.scheme.documentsRequired || [])))
        const schemeList = matches.map(m => `• ${m.scheme.name}`).join('\n')
        const docsText = docList.map(d => `- ${d}`).join('\n')

        const message = `*CitizenDesk Eligibility Report*%0A%0A` +
            `Hi, I just checked my eligibility on CitizenDesk!%0A%0A` +
            `*Eligible Schemes:*%0A${schemeList}%0A%0A` +
            `*Documents I need to prepare:*%0A${docsText}%0A%0A` +
            `Check your own eligibility at: ${window.location.origin}/check`

        window.open(`https://wa.me/?text=${message}`, '_blank')
    }


    const handleSaveDraft = () => {
        DraftService.saveDraft({
            name: formData.name || "Draft Citizen",
            age: parseInt(formData.age) || 0,
            occupation: formData.occupation,
            income: parseInt(formData.incomeValue) || 0,
            state: formData.state,
            district: formData.district
        });
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 3000);
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header - Adjusted top for fixed navbar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-8 sticky top-0 md:top-[76px] z-40 transition-all duration-300 shadow-sm">
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
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                            <ShieldCheck className="h-3.5 w-3.5 mr-2" /> {language === 'en' ? "DATA PRIVACY ACTIVE" : language === 'hi' ? "डेटा गोपनीयता सक्रिय" : "డేటా గోప్యత యాక్టివ్"}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-10 pb-32 px-6 sm:px-8">
                {step === 'form' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div>
                                <h2 className={cn(
                                    "text-3xl font-black text-[#0F172A] mb-2 font-display",
                                    t.check.profile.match(/[\u0900-\u0C7F]/) ? "leading-tight py-2" : ""
                                )}>{t.check.profile}</h2>
                                <p className="text-slate-500 font-medium">{t.check.profileDesc}</p>
                            </div>

                            <form onSubmit={handleSearch} className="space-y-6">
                                <Card id="tour-check-demographics" className="border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                            <UserCheck className="h-4 w-4" />
                                            {t.check.form.demographics}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-6 sm:grid-cols-2 p-6">
                                        <div className="space-y-2 sm:col-span-1">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.check.form.name}</Label>
                                            <Input className="h-12 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Rahul Kumar" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.check.form.age}</Label>
                                            <Input required type="number" className="h-12 border-slate-200 rounded-lg" placeholder="24" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.check.form.gender}</Label>
                                            <Select value={formData.gender} onValueChange={(v: any) => setFormData({ ...formData, gender: v })}>
                                                <SelectTrigger className="h-12 border-slate-200 rounded-lg"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">{language === 'en' ? "Male" : language === 'hi' ? "पुरुष" : "పురుషుడు"}</SelectItem>
                                                    <SelectItem value="Female">{language === 'en' ? "Female" : language === 'hi' ? "महिला" : "స్త్రీ"}</SelectItem>
                                                    <SelectItem value="Other">{language === 'en' ? "Other" : language === 'hi' ? "अन्य" : "ఇతర"}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.check.form.occupation}</Label>
                                            <Select value={formData.occupation} onValueChange={(v: string) => setFormData({ ...formData, occupation: v })}>
                                                <SelectTrigger className="h-12 border-slate-200 rounded-lg"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Student">{language === 'en' ? "Student" : language === 'hi' ? "छात्र" : "విద్యార్థి"}</SelectItem>
                                                    <SelectItem value="Farmer">{language === 'en' ? "Farmer" : language === 'hi' ? "किसान" : "రైతు"}</SelectItem>
                                                    <SelectItem value="Self-Employed">{language === 'en' ? "Self-Employed" : language === 'hi' ? "स्वरोजगार" : "స్వయం ఉపాధి"}</SelectItem>
                                                    <SelectItem value="Unemployed">{language === 'en' ? "Unemployed" : language === 'hi' ? "बेरोजगार" : "నిరుద్యోగి"}</SelectItem>
                                                    <SelectItem value="Worker">{language === 'en' ? "Worker" : language === 'hi' ? "श्रमिक" : "కార్మికుడు"}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card id="tour-check-financial" className="border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                            <Wallet className="h-4 w-4" />
                                            {t.check.form.financial}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-6 sm:grid-cols-2 p-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.check.form.incomeBand}</Label>
                                            <Select value={formData.incomeBand} onValueChange={(v: any) => setFormData({ ...formData, incomeBand: v })}>
                                                <SelectTrigger className="h-12 border-slate-200 rounded-lg"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="<1L">{language === 'en' ? "Under ₹1 Lakh" : language === 'hi' ? "₹1 लाख से कम" : "₹1 లక్ష కంటే తక్కువ"}</SelectItem>
                                                    <SelectItem value="1–3L">{language === 'en' ? "₹1 – ₹3 Lakhs" : language === 'hi' ? "₹1 – ₹3 लाख" : "₹1 – ₹3 లక్షలు"}</SelectItem>
                                                    <SelectItem value=">3L">{language === 'en' ? "Above ₹3 Lakhs" : language === 'hi' ? "₹3 लाख से ऊपर" : "₹3 లక్షల కంటే ఎక్కువ"}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.check.form.state}</Label>
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
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.check.form.district}</Label>
                                            <Input className="h-12 border-slate-200 rounded-lg" placeholder="e.g. Pune" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card id="tour-check-docs" className="border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {t.check.form.docs}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-4 sm:grid-cols-2 p-6">
                                        <DocCheckbox id="aadhaar" label={language === 'en' ? "Aadhaar Card" : language === 'hi' ? "आधार कार्ड" : "आधार కార్డ్"} checked={docs.aadhaar} onChange={c => setDocs({ ...docs, aadhaar: c })} />
                                        <DocCheckbox id="income" label={language === 'en' ? "Income Certificate" : language === 'hi' ? "आय प्रमाण पत्र" : "ఆదాయ ధృవీకరణ పత్రం"} checked={docs.incomeCert} onChange={c => setDocs({ ...docs, incomeCert: c })} />
                                        <DocCheckbox id="caste" label={language === 'en' ? "Caste Certificate" : language === 'hi' ? "जाति प्रमाण पत्र" : "కులం ధృవీకరణ పత్రం"} checked={docs.casteCert} onChange={c => setDocs({ ...docs, casteCert: c })} />
                                        <DocCheckbox id="ration" label={language === 'en' ? "Ration Card" : language === 'hi' ? "राशन कार्ड" : "రేషన్ కార్డ్"} checked={docs.rationCard} onChange={c => setDocs({ ...docs, rationCard: c })} />
                                    </CardContent>
                                </Card>

                                <div className="space-y-4 mt-6">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full h-16 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all rounded-xl hover-lift"
                                        disabled={loading}
                                        id="tour-check-submit"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-3">
                                                <Sparkles className="h-5 w-5 animate-pulse" />
                                                {t.check.form.analyzing}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-3">
                                                {t.check.form.submit} <ArrowRight className="ml-2 h-5 w-5" />
                                            </span>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className={cn(
                                            "w-full h-14 font-black border-2 transition-all rounded-xl",
                                            draftSaved ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                                        )}
                                        onClick={handleSaveDraft}
                                    >
                                        {draftSaved ? (
                                            <span className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5" /> DRAFT SAVED LOCALLY
                                            </span>
                                        ) : (
                                            <span>SAVE AS DRAFT (OFFLINE)</span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Right Sticky Column */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
                            <Card id="tour-check-readiness" className="bg-[#0F172A] text-white border-0 rounded-2xl shadow-2xl overflow-hidden p-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">{t.check.readiness.title}</h3>
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
                                            <p className="text-sm font-bold text-slate-100">{t.check.readiness.strength}</p>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                                {t.check.readiness.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                                <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-amber-900">{t.common.importantNote}</p>
                                    <p className="text-xs text-amber-700/80 leading-relaxed">
                                        {t.common.preliminaryCheck}
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
                                    {t.check.matchesDesc.replace('{count}', matches.length.toString())}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Dialog open={isLocatorOpen} onOpenChange={setIsLocatorOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="h-12 px-6 font-bold border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50 rounded-xl gap-2">
                                            <MapPin className="h-4 w-4" /> {t.common.nearestCenter}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-2xl bg-white rounded-3xl p-8 border-0 shadow-2xl">
                                        <div className="space-y-6">
                                            <div>
                                                <DialogTitle className="text-2xl font-black text-[#0F172A]">{t.common.nearestCenter}</DialogTitle>
                                                <DialogDescription className="text-slate-500 font-medium">Find government offices in your district to apply in person.</DialogDescription>
                                            </div>
                                            <ServiceCenterLocator state={formData.state} district={formData.district} />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="outline" className="h-12 px-6 font-bold border-slate-200 rounded-xl" onClick={() => setStep('form')}>
                                    <ChevronLeft className="mr-2 h-4 w-4" /> {t.common.modifyProfile}
                                </Button>
                            </div>
                        </div>

                        {matches.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <SchemeExpiryTracker matches={matches} />
                            </div>
                        )}

                        {matches.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <div className="p-6 bg-slate-50 rounded-full">
                                    <Search className="h-12 w-12 text-slate-300" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-[#0F172A]">{t.common.noResults}</h3>
                                    <p className="text-slate-500 max-w-sm font-medium">{t.common.noResultsDesc}</p>
                                </div>
                                <Button className="bg-[#0F172A] hover:bg-slate-800 h-12 px-8 font-bold rounded-xl" asChild>
                                    <Link href="/schemes">{t.common.browseAll}</Link>
                                </Button>

                                {futureMatches.length > 0 && (
                                    <div className="w-full max-w-4xl mx-auto pt-10">
                                        <div className="text-center mb-8">
                                            <h3 className="text-xl font-black text-slate-800 tracking-tight">But wait, there's more!</h3>
                                            <p className="text-slate-500 font-medium">Predictive Intelligence has identified future opportunities for you.</p>
                                        </div>
                                        <PredictiveTimeline predictions={futureMatches} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-12">
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {matches.map(({ scheme, matchReason }) => (
                                        <Card key={scheme.id} className="flex flex-col border-slate-100 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/10 rounded-[2.5rem] overflow-hidden bg-white hover:-translate-y-4 group relative">
                                            {/* Premium Accent */}
                                            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 h-2 w-full animate-shine" />

                                            <CardHeader className="p-8 pb-4">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex flex-col gap-3">
                                                        <div className="flex flex-wrap gap-2 items-center">
                                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-sm shadow-emerald-100">
                                                                ELIGIBLE
                                                            </Badge>
                                                            {scheme.deadline && (new Date(scheme.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 30 && (
                                                                <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-widest shadow-sm shadow-amber-100 flex gap-2 items-center animate-pulse">
                                                                    <Clock className="h-3 w-3" /> HIGH PRIORITY
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <label className="flex items-center gap-2 cursor-pointer group/comp">
                                                            <div className="relative flex items-center justify-center">
                                                                <Checkbox
                                                                    checked={selectedForComparison.includes(scheme.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            if (selectedForComparison.length >= 3) {
                                                                                alert("You can compare up to 3 schemes at once.")
                                                                                return
                                                                            }
                                                                            setSelectedForComparison([...selectedForComparison, scheme.id])
                                                                        } else {
                                                                            setSelectedForComparison(selectedForComparison.filter(id => id !== scheme.id))
                                                                        }
                                                                    }}
                                                                    className="h-5 w-5 border-slate-200 data-[state=checked]:bg-blue-600 rounded-lg transition-all"
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/comp:text-blue-600 transition-colors">
                                                                {selectedForComparison.includes(scheme.id) ? 'Selected' : 'Compare'}
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <Badge variant="outline" className="text-[9px] font-black text-slate-400 border-slate-200 uppercase tracking-widest py-1 px-3 rounded-full">{scheme.category}</Badge>
                                                </div>
                                                <CardTitle className="text-2xl font-black text-slate-900 leading-[1.2] tracking-tight group-hover:text-blue-600 transition-colors">{scheme.name}</CardTitle>
                                            </CardHeader>

                                            <CardContent className="px-8 flex-1 space-y-8">
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{scheme.descriptionSimple}</p>

                                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50/30 transition-all">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                                                        <Sparkles className="h-3 w-3 text-blue-500 animate-pulse" /> Why it matches
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-700 leading-relaxed">
                                                        {matchReason}
                                                    </p>
                                                </div>

                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Required Proof</p>
                                                    <div className="grid gap-3">
                                                        {scheme.documentsRequired.map(d => (
                                                            <div key={d} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100/50 shadow-sm group/doc">
                                                                <span className="text-xs font-black text-slate-600 group-hover/doc:text-blue-600 transition-colors uppercase tracking-tight">{d}</span>
                                                                <div className={cn(
                                                                    "h-6 w-6 rounded-full flex items-center justify-center transition-all duration-500",
                                                                    (docs as any)[d.toLowerCase().replace(" ", "")] || (docs as any)[d.toLowerCase().includes("aadhaar") ? "aadhaar" : ""]
                                                                        ? "bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-200 rotate-[360deg]"
                                                                        : "bg-slate-100 text-slate-400"
                                                                )}>
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="p-8 pt-0 mt-4">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button className="w-full h-16 gap-3 bg-[#0F172A] hover:bg-blue-600 text-white font-black tracking-widest rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all uppercase text-xs group/btn relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shine_3s_infinite] pointer-events-none"></div>
                                                            <Fingerprint className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                                                            VERIFY ELIGIBILITY
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-2xl bg-white rounded-[3rem] p-0 overflow-hidden border-0 shadow-2xl">
                                                        <div className="p-10">
                                                            <div className="mb-10 flex items-center justify-between">
                                                                <div>
                                                                    <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">Eligibility Attestation</DialogTitle>
                                                                    <DialogDescription className="text-slate-500 font-medium mt-1">Verify your documents to generate a secure digital token.</DialogDescription>
                                                                </div>
                                                                <div className="p-4 bg-blue-50 rounded-2xl shadow-sm"><Lock className="h-6 w-6 text-blue-600" /></div>
                                                            </div>
                                                            <LocalDocVerifier
                                                                scheme={scheme}
                                                                onTokenCreated={(token) => alert(`Secure Attestation Success: ${token.tokenString}`)}
                                                            />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </CardFooter>

                                            {/* Hover Glow Background */}
                                            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                        </Card>
                                    ))}
                                </div>

                                {futureMatches.length > 0 && (
                                    <div className="space-y-6 pt-10">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">Upcoming Eligibility</h3>
                                            <p className="text-slate-500 font-medium">Schemes you're on the path to qualify for.</p>
                                        </div>
                                        <PredictiveTimeline predictions={futureMatches} />
                                    </div>
                                )}
                            </div>
                        )}

                        <TourGuide
                            tourKey="check_page_v1"
                            steps={[
                                {
                                    element: '#tour-check-demographics',
                                    popover: {
                                        title: 'Basic Details',
                                        description: 'Enter age, gender, and occupation. Logic varies by these factors.',
                                        side: 'right'
                                    }
                                },
                                {
                                    element: '#tour-check-financial',
                                    popover: {
                                        title: 'Financial Context',
                                        description: 'Income band helps us filter relevant welfare schemes.',
                                        side: 'right'
                                    }
                                },
                                {
                                    element: '#tour-check-readiness',
                                    popover: {
                                        title: 'Real-time Readiness',
                                        description: 'See your verification strength score update as you add documents.',
                                        side: 'left'
                                    }
                                },
                                {
                                    element: '#tour-check-submit',
                                    popover: {
                                        title: 'Find Schemes',
                                        description: 'Click here to run the eligibility engine against 500+ rules.',
                                        side: 'top'
                                    }
                                }
                            ]}
                        />

                        {/* Download Report Button - Fixed bottom right */}
                        <div className="fixed bottom-8 left-8 z-50 print:hidden animate-in slide-in-from-bottom-10 duration-700 delay-300 flex flex-col gap-4">
                            <Button
                                onClick={() => window.print()}
                                className="h-14 px-6 rounded-full bg-white text-[#0F172A] border-2 border-[#0F172A] shadow-xl hover:shadow-2xl hover:scale-105 transition-all font-black gap-3"
                            >
                                <Printer className="h-5 w-5" />
                                DOWNLOAD REPORT
                            </Button>
                            <Button
                                onClick={handleWhatsAppShare}
                                className="h-14 px-6 rounded-full bg-[#25D366] text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all font-black gap-3"
                            >
                                <Share2 className="h-5 w-5" />
                                SHARE TO WHATSAPP
                            </Button>
                        </div>

                        <EligibilityReport profile={printProfile} matches={matches} />

                        {/* Comparison Floating Bar */}
                        {selectedForComparison.length > 0 && (
                            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 print:hidden animate-in slide-in-from-bottom-10 duration-500">
                                <Card className="bg-[#0F172A] text-white border-0 rounded-2xl shadow-2xl overflow-hidden py-3 px-6 flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-500 text-white h-7 w-7 rounded-full flex items-center justify-center font-black text-xs">
                                            {selectedForComparison.length}
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-300">
                                            {selectedForComparison.length === 1 ? 'Scheme Selected' : 'Schemes Selected'}
                                        </p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-700" />
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs font-black uppercase text-slate-400 hover:text-white hover:bg-slate-800"
                                            onClick={() => setSelectedForComparison([])}
                                        >
                                            Clear
                                        </Button>
                                        <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    disabled={selectedForComparison.length < 2}
                                                    className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/40"
                                                >
                                                    {selectedForComparison.length < 2 ? 'Select 1 more' : 'Compare Now'}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-5xl bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
                                                <div className="p-10">
                                                    <div className="mb-8 flex items-center justify-between">
                                                        <div>
                                                            <DialogTitle className="text-2xl font-black text-[#0F172A]">Compare Welfare Schemes</DialogTitle>
                                                            <DialogDescription className="text-slate-500 font-medium">Side-by-side analysis of benefits and requirements.</DialogDescription>
                                                        </div>
                                                        <div className="p-2 bg-blue-50 rounded-full"><Search className="h-5 w-5 text-blue-600" /></div>
                                                    </div>
                                                    <SchemeComparison
                                                        schemes={matches
                                                            .filter(m => selectedForComparison.includes(m.scheme.id))
                                                            .map(m => m.scheme)
                                                        }
                                                    />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </Card>
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

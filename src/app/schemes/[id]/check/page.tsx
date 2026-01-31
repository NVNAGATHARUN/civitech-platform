"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    CheckCircle2,
    ShieldCheck,
    ChevronLeft,
    Download,
    Fingerprint,
    BadgeCheck,
    FileText,
    Activity
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { LocalDocVerifier } from "@/components/local-doc-verifier"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const CheckReadinessPage = () => {
    const params = useParams()
    const router = useRouter()
    const [token, setToken] = useState<any>(null)
    const [scheme, setScheme] = useState<any>(null)
    const [uploads, setUploads] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (!params?.id) return
        import("@/services/schemes").then(async mod => {
            const all = await mod.getAllSchemes()
            const s = all.find(x => x.id === params.id)
            setScheme(s)
        })
    }, [params?.id])

    const handleTokenCreated = (t: any) => {
        setToken(t)
        setUploads(prev => ({ ...prev, "Income Certificate": true }))
    }

    const handleMockUpload = (docName: string) => {
        setUploads(prev => ({ ...prev, [docName]: true }))
    }

    if (!scheme) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Identifying Scheme...</p>
        </div>
    )

    if (token) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-6 animate-in fade-in duration-700">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 mb-2">
                        <BadgeCheck className="h-12 w-12 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Eligibility Verified</h1>
                        <p className="text-slate-500 font-medium max-w-md mx-auto">
                            You have successfully met the verification criteria for the <span className="text-blue-600 font-bold">{scheme.name}</span>.
                        </p>
                    </div>

                    <Card className="w-full max-w-md border-2 border-emerald-500/20 shadow-2xl rounded-3xl overflow-hidden mt-10">
                        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Fingerprint className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">CiviTech Trust Network</span>
                        </div>
                        <CardContent className="p-10 bg-white space-y-8">
                            <div className="space-y-2 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eligibility Token ID</p>
                                <div className="text-xs font-mono font-bold text-slate-800 bg-slate-50 py-2 px-4 rounded-lg border border-slate-100 break-all select-all">
                                    {token.tokenString}
                                </div>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-dashed border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-3">
                                        <ShieldCheck className="h-6 w-6 text-emerald-600" />
                                    </span>
                                </div>
                            </div>

                            <div className="text-center space-y-1">
                                <div className="text-5xl font-black text-[#0F172A] tracking-tighter">VERIFIED</div>
                                <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Digital Attestation Active</p>
                            </div>

                            <p className="text-[10px] text-slate-400 font-medium text-center">
                                This token is valid for 24 hours. Present this to your local volunteer for instant processing.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <Button className="flex-1 bg-[#0F172A] hover:bg-slate-800 h-12 font-bold rounded-xl shadow-lg" onClick={() => window.print()}>
                            <Download className="mr-2 h-4 w-4" /> DOWNLOAD TOKEN
                        </Button>
                        <Button variant="outline" className="flex-1 h-12 border-slate-200 font-bold rounded-xl" asChild>
                            <Link href="/schemes">BACK TO REPOSITORY</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <Button variant="ghost" className="mb-8 p-0 hover:bg-transparent text-slate-400 hover:text-blue-600 flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]" asChild>
                <Link href="/schemes">
                    <ChevronLeft className="h-4 w-4" /> RETURN TO REPOSITORY
                </Link>
            </Button>

            <div className="space-y-6 mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full mb-2">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Official Verification Flow</span>
                </div>
                <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Scheme Readiness Check</h1>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                    Personalized document verification for <strong className="text-[#0F172A]">{scheme.name}</strong>. Your data remains local and encrypted during this process.
                </p>
            </div>

            <div className="space-y-10">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Required Attestations</h2>
                </div>

                <div className="space-y-8">
                    {scheme.documentsRequired?.map((docName: string, index: number) => (
                        <div key={index} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">{index + 1}</span>
                                    {docName}
                                </h3>
                                {uploads[docName] && (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-0 flex items-center gap-1 font-bold">
                                        <CheckCircle2 className="h-3 w-3" /> VERIFIED
                                    </Badge>
                                )}
                            </div>

                            {docName.toLowerCase().includes("income") ? (
                                <div className="pl-11">
                                    <LocalDocVerifier scheme={scheme} onTokenCreated={handleTokenCreated} />
                                </div>
                            ) : (
                                <Card className={cn(
                                    "ml-11 border-2 transition-all duration-300",
                                    uploads[docName] ? "border-emerald-500/30 bg-emerald-50/20" : "border-slate-100 hover:border-slate-200"
                                )}>
                                    <CardContent className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-bold text-slate-700">Standard Attestation</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Manual Review Required</p>
                                            </div>
                                        </div>
                                        <Button
                                            className={cn(
                                                "h-10 font-bold px-6 rounded-lg transition-all",
                                                uploads[docName] ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                            )}
                                            onClick={() => handleMockUpload(docName)}
                                        >
                                            {uploads[docName] ? <CheckCircle2 className="h-4 w-4" /> : "UPLOAD FILE"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CheckReadinessPage

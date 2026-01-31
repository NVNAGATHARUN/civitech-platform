"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, BookOpen, HelpCircle, ArrowRight } from "lucide-react"
import { getSchemesForProfile, SchemeWithReason } from "@/services/schemes"
import { useLanguage } from "@/lib/LanguageContext"
import { CitizenProfile } from "@/lib/types"

export default function ResourcesPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700 pt-10">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight py-4 leading-tight">Citizen Resources</h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Everything you need to navigate the world of government welfare with confidence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Official Portals */}
                <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden border border-slate-100 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                    <CardHeader className="p-10">
                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <ExternalLink className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl font-black">Official Portals</CardTitle>
                        <CardDescription className="text-slate-500 font-medium mt-2">Quick links to secondary verification and application sites.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 pb-10 space-y-4">
                        <PortalLink name="Mera Ration Portal" desc="National food security database." href="https://nfsa.gov.in/" />
                        <PortalLink name="PM-Kisan Official" desc="Farmer benefit verification." href="https://pmkisan.gov.in/" />
                        <PortalLink name="National Scholarship Portal" desc="Educational grant applications." href="https://scholarships.gov.in/" />
                    </CardContent>
                </Card>

                {/* Document Guide */}
                <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden border border-slate-100 group hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                    <CardHeader className="p-10">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl font-black">Document Checklist</CardTitle>
                        <CardDescription className="text-slate-500 font-medium mt-2">Common requirements for most government applications.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 pb-10 space-y-4">
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Aadhaar Card (Linked to Mobile)
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Income Certificate (Latest Year)
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Caste Certificate (if applicable)
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Bank Passbook copy
                        </li>
                    </CardContent>
                </Card>
            </div>

            {/* Help Section */}
            <div className="bg-[#0F172A] rounded-[3rem] p-12 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-8 max-w-2xl">
                    <h2 className="text-3xl font-black">Need manual assistance?</h2>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">
                        If you're struggling with a specific application, our verified volunteers are here to help. Head over to the Volunteer section to find a bridge-maker in your district.
                    </p>
                    <div className="flex gap-4">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                            <a href="/volunteer">
                                Find a Volunteer <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                        <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-300 hover:text-white">
                            View FAQ
                        </Button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
                <BookOpen className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 opacity-10 rotate-12" />
            </div>
        </div>
    )
}

function PortalLink({ name, desc, href }: { name: string, desc: string, href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-slate-50 rounded-2xl flex items-center justify-between group/link hover:bg-blue-50 transition-all cursor-pointer border border-transparent hover:border-blue-100"
        >
            <div>
                <h4 className="font-black text-slate-900 leading-tight">{name}</h4>
                <p className="text-xs font-medium text-slate-400 mt-1">{desc}</p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-300 group-hover/link:text-blue-600 shadow-sm transition-all">
                <ExternalLink className="h-4 w-4" />
            </div>
        </a>
    )
}

"use client"

import { CitizenProfile } from "@/lib/types"
import { SchemeWithReason } from "@/services/schemes"
import { CheckCircle2, FileText, Lock, ShieldCheck } from "lucide-react"

interface EligibilityReportProps {
    profile: CitizenProfile | null
    matches: SchemeWithReason[]
}

export function EligibilityReport({ profile, matches }: EligibilityReportProps) {
    if (!profile) return null

    const date = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="hidden print:block font-sans p-8 max-w-[210mm] mx-auto bg-white text-black">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-black pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">CitizenDesk</h1>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Official Scheme Eligibility Report</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{date}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Ref: {profile.userId?.slice(0, 8).toUpperCase()}</p>
                </div>
            </div>

            {/* Profile Summary */}
            <div className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Beneficiary Profile
                </h2>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Name</p>
                        <p className="font-bold text-lg">{profile.profileData.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Age / Gender</p>
                        <p className="font-bold text-lg">{profile.profileData.age} Years / {profile.profileData.gender || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Occupation</p>
                        <p className="font-bold text-lg">{profile.profileData.occupationTags.join(", ")}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Location</p>
                        <p className="font-bold text-lg">{profile.profileData.district}, {profile.profileData.state}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Declared Income</p>
                        <p className="font-bold text-lg">₹{profile.profileData.income.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            {/* Schemes */}
            <div className="mb-8">
                <h2 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-black" />
                    Eligible Programs ({matches.length})
                </h2>

                <div className="space-y-6">
                    {matches.map((match, i) => (
                        <div key={i} className="border-b border-gray-200 pb-6 last:border-0 page-break-inside-avoid">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-black">{match.scheme.name}</h3>
                                <span className="px-3 py-1 bg-gray-100 text-xs font-bold uppercase border border-gray-200 rounded">
                                    {match.scheme.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">{match.scheme.descriptionSimple}</p>

                            <div className="flex gap-4 mt-3">
                                <div className="flex-1 p-3 bg-gray-50 rounded border border-gray-200">
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Required Documents</p>
                                    <ul className="text-xs font-bold text-gray-800 list-disc list-inside">
                                        {match.scheme.documentsRequired.map(d => (
                                            <li key={d}>{d}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex-1 p-3 bg-gray-50 rounded border border-gray-200">
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Benefits</p>
                                    <p className="text-xs font-bold text-gray-800">{match.scheme.benefitsSimple}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full bg-gray-50 mb-4">
                    <Lock className="h-3 w-3 text-gray-400" />
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Digitally Generated • Valid for 30 Days</span>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                    This document is for information purposes only. Final eligibility is subject to government verification.
                </p>
            </div>
        </div>
    )
}

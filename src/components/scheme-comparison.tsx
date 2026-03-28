"use client"

import { Scheme } from "@/lib/types"
import { CheckCircle2, XCircle, Info, FileText, IndianRupee, User, MapPin } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface SchemeComparisonProps {
    schemes: Scheme[]
}

export function SchemeComparison({ schemes }: SchemeComparisonProps) {
    if (schemes.length === 0) return null

    const allDocs = Array.from(new Set(schemes.flatMap(s => s.documentsRequired || [])))

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-200">
                        <TableHead className="w-[200px] text-[10px] font-black uppercase tracking-widest text-slate-400">Feature</TableHead>
                        {schemes.map(scheme => (
                            <TableHead key={scheme.id} className="min-w-[250px] p-6">
                                <div className="space-y-2">
                                    <Badge className="bg-blue-50 text-blue-600 border-0 text-[10px] font-black uppercase">
                                        {scheme.category}
                                    </Badge>
                                    <h3 className="text-sm font-black text-slate-900 leading-tight">
                                        {scheme.name}
                                    </h3>
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className="border-slate-100">
                        <TableCell className="font-bold text-xs text-slate-500 flex items-center gap-2">
                            <IndianRupee className="h-3 w-3" /> Monthly Benefits
                        </TableCell>
                        {schemes.map(scheme => (
                            <TableCell key={scheme.id} className="p-6">
                                <p className="text-sm font-black text-emerald-600">
                                    {scheme.benefitsSimple}
                                </p>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className="border-slate-100 bg-slate-50/30">
                        <TableCell className="font-bold text-xs text-slate-500 flex items-center gap-2">
                            <User className="h-3 w-3" /> Eligibility criteria
                        </TableCell>
                        {schemes.map(scheme => (
                            <TableCell key={scheme.id} className="p-6 space-y-2">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Age Range</p>
                                    <p className="text-xs font-bold text-slate-700">
                                        {scheme.minAge}+ {scheme.maxAge > 0 ? `up to ${scheme.maxAge}` : 'years'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Income Limit</p>
                                    <p className="text-xs font-bold text-slate-700">
                                        {scheme.incomeLimit > 0 ? `Below ₹${scheme.incomeLimit.toLocaleString()}` : 'No Limit'}
                                    </p>
                                </div>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className="border-slate-100">
                        <TableCell className="font-bold text-xs text-slate-500 flex items-center gap-2">
                            <MapPin className="h-3 w-3" /> Regional Scope
                        </TableCell>
                        {schemes.map(scheme => (
                            <TableCell key={scheme.id} className="p-6">
                                <p className="text-xs font-bold text-slate-700">
                                    {scheme.states?.includes('ALL') ? 'Universal (Pan India)' : (scheme.states?.join(', ') || 'Global')}
                                </p>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow className="border-slate-100 bg-slate-50/30">
                        <TableCell className="font-bold text-xs text-slate-500 flex items-center gap-2">
                            <FileText className="h-3 w-3" /> Required Documents
                        </TableCell>
                        {schemes.map(scheme => (
                            <TableCell key={scheme.id} className="p-6">
                                <div className="flex flex-wrap gap-2">
                                    {(scheme.documentsRequired || []).map(doc => (
                                        <Badge key={doc} variant="outline" className="text-[9px] font-bold py-0 h-5 border-slate-200 text-slate-500">
                                            {doc}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                        ))}
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-bold text-xs text-slate-500 flex items-center gap-2">
                            <Info className="h-3 w-3" /> Quick Summary
                        </TableCell>
                        {schemes.map(scheme => (
                            <TableCell key={scheme.id} className="p-6">
                                <p className="text-xs text-slate-500 leading-relaxed italic">
                                    "{scheme.descriptionSimple}"
                                </p>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

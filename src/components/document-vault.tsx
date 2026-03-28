"use client"

import { useEffect, useState } from "react"
import { getUserTokens } from "@/services/tokens"
import { EligibilityToken, Scheme } from "@/lib/types"
import { getAllSchemes } from "@/services/schemes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Calendar, ExternalLink, Lock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function DocumentVault({ userId }: { userId: string }) {
    const [tokens, setTokens] = useState<(EligibilityToken & { scheme?: Scheme })[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [userTokens, allSchemes] = await Promise.all([
                getUserTokens(userId),
                getAllSchemes()
            ])

            const combined = userTokens.map(token => ({
                ...token,
                scheme: allSchemes.find(s => s.id === token.schemeId)
            }))

            setTokens(combined)
            setLoading(false)
        }
        if (userId) loadData()
    }, [userId])

    if (loading) return (
        <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-100 rounded-2xl"></div>
            <div className="h-20 bg-slate-100 rounded-2xl"></div>
        </div>
    )

    if (tokens.length === 0) return (
        <Card className="border-dashed border-2 bg-slate-50/50">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-300">
                    <Lock className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900">Vault Empty</h3>
                    <p className="text-sm text-slate-500 max-w-[200px] mx-auto">Verify your documents to generate secure eligibility tokens here.</p>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="grid grid-cols-1 gap-6">
            {tokens.map((token) => (
                <Card key={token.id} className="group hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                    <CardHeader className="p-6 pb-2">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-600 border-0 rounded-full font-black text-[10px] uppercase tracking-widest px-3 py-1">
                                Verified Token
                            </Badge>
                        </div>
                        <CardTitle className="text-lg font-black text-slate-900 mt-4">
                            {token.scheme?.name || 'General Verification'}
                        </CardTitle>
                        <CardDescription className="text-xs font-medium text-slate-500">
                            Token: {token.tokenString}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 pt-4 space-y-4">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" /> Issued: {token.issuedAt?.toDate ? token.issuedAt.toDate().toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="flex items-center gap-1.5 text-amber-500">
                                <Lock className="h-3 w-3" /> Expires: {token.expiresAt?.toDate ? token.expiresAt.toDate().toLocaleDateString() : 'N/A'}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase">
                                <CheckCircle className="h-3.5 w-3.5" /> Identity Redacted
                            </span>
                            <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:gap-2 transition-all flex items-center">
                                View Proof <ExternalLink className="ml-1 h-3 w-3" />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

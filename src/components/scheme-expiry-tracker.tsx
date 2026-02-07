"use client"

import { Scheme } from "@/lib/types"
import { Calendar, Clock, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SchemeExpiryTrackerProps {
    matches: { scheme: Scheme; matchReason: string }[]
}

export function SchemeExpiryTracker({ matches }: SchemeExpiryTrackerProps) {
    const today = new Date()

    const deadlineSchemes = matches
        .filter(m => m.scheme.deadline)
        .map(m => {
            const deadline = new Date(m.scheme.deadline!)
            const diffTime = deadline.getTime() - today.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            return {
                ...m,
                daysRemaining: diffDays,
                isUrgent: diffDays >= 0 && diffDays <= 30
            }
        })
        .sort((a, b) => a.daysRemaining - b.daysRemaining)

    if (deadlineSchemes.length === 0) return null

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-4 w-4" /> Upcoming Deadlines
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {deadlineSchemes.map(({ scheme, daysRemaining, isUrgent }) => (
                    <Card key={scheme.id} className={cn(
                        "relative overflow-hidden border-slate-200 transition-all hover:shadow-md",
                        isUrgent ? "border-amber-200 bg-amber-50/30" : ""
                    )}>
                        {isUrgent && (
                            <div className="absolute top-0 right-0 p-2">
                                <ShieldAlert className="h-4 w-4 text-amber-500 animate-pulse" />
                            </div>
                        )}
                        <CardContent className="p-4 space-y-3">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-400 leading-none">
                                    {scheme.category}
                                </p>
                                <h4 className="text-xs font-black text-[#0F172A] line-clamp-1">
                                    {scheme.name}
                                </h4>
                            </div>

                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className={cn(
                                    "text-[9px] font-black uppercase px-2 py-0 h-5 border-slate-200",
                                    daysRemaining < 0 ? "bg-red-50 text-red-600 border-red-100" :
                                        daysRemaining <= 15 ? "bg-red-50 text-red-600 border-red-100" :
                                            daysRemaining <= 30 ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                "bg-emerald-50 text-emerald-600 border-emerald-100"
                                )}>
                                    {daysRemaining < 0 ? "Ended" :
                                        daysRemaining === 0 ? "Ends Today" :
                                            daysRemaining === 1 ? "Ends Tomorrow" :
                                                `Ends in ${daysRemaining} Days`}
                                </Badge>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {new Date(scheme.deadline!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

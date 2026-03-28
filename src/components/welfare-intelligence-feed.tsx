"use client"

import { useEffect, useState } from "react"
import { WelfareUpdate, CitizenProfile } from "@/lib/types"
import { getPersonalizedUpdates } from "@/services/welfare-updates"
import { Bell, Calendar, Zap, AlertTriangle, Info, ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useLanguage } from "@/lib/LanguageContext"

interface WelfareIntelligenceFeedProps {
    profileData?: CitizenProfile['profileData']
}

export function WelfareIntelligenceFeed({ profileData }: WelfareIntelligenceFeedProps) {
    const { t } = useLanguage()
    const [updates, setUpdates] = useState<WelfareUpdate[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUpdates = async () => {
            const data = await getPersonalizedUpdates(profileData)
            setUpdates(data)
            setLoading(false)
        }
        fetchUpdates()
    }, [profileData])

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-slate-100 rounded-[2rem]"></div>
                ))}
            </div>
        )
    }

    const getTypeIcon = (type: WelfareUpdate['type']) => {
        switch (type) {
            case 'deadline': return <Calendar className="h-5 w-5" />
            case 'new_scheme': return <Sparkles className="h-5 w-5" />
            case 'policy_change': return <Zap className="h-5 w-5" />
            case 'benefit_boost': return <Zap className="h-5 w-5" />
            default: return <Bell className="h-5 w-5" />
        }
    }

    const getTypeStyles = (type: WelfareUpdate['type'], severity: WelfareUpdate['severity']) => {
        if (severity === 'high') return "bg-red-50 border-red-100 text-red-600"
        if (type === 'new_scheme') return "bg-emerald-50 border-emerald-100 text-emerald-600"
        if (type === 'deadline') return "bg-amber-50 border-amber-100 text-amber-600"
        return "bg-blue-50 border-blue-100 text-blue-600"
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-[0.1em]">{t.dashboard.intelligence.title}</h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-400">
                    {t.dashboard.intelligence.liveUpdates}
                </Badge>
            </div>

            <div className="space-y-4">
                {updates.length > 0 ? (
                    updates.map((update) => (
                        <div
                            key={update.id}
                            className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 border-l-4 overflow-hidden"
                            style={{ borderLeftColor: update.severity === 'high' ? '#ef4444' : update.type === 'new_scheme' ? '#10b981' : '#3b82f6' }}
                        >
                            <div className="flex gap-6">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3",
                                    getTypeStyles(update.type, update.severity)
                                )}>
                                    {getTypeIcon(update.type)}
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className={cn(
                                                "rounded-full font-black text-[9px] uppercase tracking-widest px-2",
                                                update.severity === 'high' ? "bg-red-600" : "bg-slate-900"
                                            )}>
                                                {update.type.replace('_', ' ')}
                                            </Badge>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">
                                                {new Date(update.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {update.title}
                                    </h4>

                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {update.description}
                                    </p>

                                    {update.actionLabel && (
                                        <div className="pt-2">
                                            <Button variant="ghost" className="h-8 px-0 text-xs font-black text-indigo-600 hover:text-indigo-700 hover:bg-transparent group/btn" asChild>
                                                <Link href={update.actionLink || '#'}>
                                                    {update.actionLabel} <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-2" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-300">
                            <Info className="h-8 w-8" />
                        </div>
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">{t.dashboard.intelligence.noUpdates}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

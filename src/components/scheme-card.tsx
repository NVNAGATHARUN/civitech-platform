import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scheme, SchemeStatus } from "@/lib/types"
import Link from "next/link"
import {
    CheckCircle2,
    Bookmark,
    Send,
    Loader2,
    Info,
    ArrowRight,
    ShieldCheck,
    FileText
} from "lucide-react"
import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { updateSchemeStatus } from "@/services/schemeStatus"
import { cn } from "@/lib/utils"

export function SchemeCard({ scheme, isRecommended = false }: { scheme: Scheme, isRecommended?: boolean }) {
    const [loading, setLoading] = useState<'planned' | 'applied' | null>(null)
    const [status, setStatus] = useState<SchemeStatus | null>(null)
    const [isSpeaking, setIsSpeaking] = useState(false)

    const toggleSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
            return
        }

        const text = `${scheme.name}. ${scheme.descriptionSimple}. Benefits include ${scheme.benefitsSimple}`
        const utterance = new SpeechSynthesisUtterance(text)

        // Match language if possible (simple detection)
        utterance.lang = 'en-IN'
        if (text.match(/[\u0900-\u097F]/)) utterance.lang = 'hi-IN'
        if (text.match(/[\u0C00-\u0C7F]/)) utterance.lang = 'te-IN'

        utterance.onend = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
    }

    useEffect(() => {
        return () => window.speechSynthesis.cancel() // Cleanup on unmount
    }, [])

    const handleAction = async (action: 'planned' | 'applied') => {
        const user = auth.currentUser
        if (!user) {
            alert("Please login to shortlist or apply for schemes.")
            return
        }

        setLoading(action)
        try {
            await updateSchemeStatus(user.uid, scheme.id, action)
            setStatus(action)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(null)
        }
    }

    return (
        <Card className={cn(
            "group relative overflow-hidden border-0 rounded-[2rem] transition-all duration-500 h-full flex flex-col",
            isRecommended
                ? "bg-white shadow-[0_20px_50px_rgba(16,185,129,0.1)] border-emerald-100/50 border hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)]"
                : "bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] border-slate-100 border hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)]"
        )}>
            {isRecommended && (
                <div className="absolute top-0 right-0 z-10">
                    <div className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-[0.2em] animate-pulse">
                        Best Match
                    </div>
                </div>
            )}

            <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                        "p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                        isRecommended ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                        <FileText className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="rounded-full font-bold text-[10px] uppercase tracking-widest border-slate-200">
                        {scheme.category}
                    </Badge>
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {scheme.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-4 text-slate-500 font-medium leading-relaxed">
                    {scheme.descriptionSimple}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-0 flex-1 space-y-6">
                <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group-hover:bg-white transition-colors duration-500">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Benefit</span>
                    </div>
                    <p className="text-sm font-black text-slate-900 leading-snug">
                        {scheme.benefitsSimple}
                    </p>
                </div>

                <div className="space-y-3 px-1">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Proofs</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold">
                        {scheme.documentsRequired?.slice(0, 3).join(", ")}
                        {scheme.documentsRequired?.length > 3 && ` +${scheme.documentsRequired.length - 3} others`}
                    </p>
                </div>
            </CardContent>

            <CardFooter className="p-8 pt-0 grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    className={cn(
                        "h-12 rounded-xl font-bold gap-2 border-slate-100 transition-all",
                        status === 'planned' ? "bg-blue-50 text-blue-600 border-blue-100" : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    )}
                    disabled={loading !== null || status === 'planned'}
                    onClick={() => handleAction('planned')}
                >
                    {loading === 'planned' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className="h-4 w-4" />}
                    {status === 'planned' ? 'SAVED' : 'SAVE'}
                </Button>

                <Button
                    className="h-12 rounded-xl font-black text-white premium-gradient shadow-lg shadow-blue-500/20 border-0 flex items-center justify-center gap-2 group/btn"
                    disabled={loading !== null || status === 'applied'}
                    onClick={() => handleAction('applied')}
                >
                    {loading === 'applied' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            {status === 'applied' ? 'APPLIED' : 'APPLY JOIN'}
                            <ArrowRight className="h-4 w-4 transition-all group-hover/btn:translate-x-1" />
                        </>
                    )}
                </Button>
            </CardFooter>

            {/* Subtle interactive background element */}
            <div className={cn(
                "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-700",
                isRecommended ? "bg-emerald-500" : "bg-blue-500"
            )}></div>
        </Card>
    )
}

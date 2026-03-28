"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FuturePrediction } from "@/services/schemes"
import {
    BrainCircuit,
    Calendar,
    ChevronRight,
    ClipboardCheck,
    Clock,
    Info,
    Target,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PredictiveTimelineProps {
    predictions: FuturePrediction[]
}

export function PredictiveTimeline({ predictions }: PredictiveTimelineProps) {
    if (!predictions || predictions.length === 0) return null

    return (
        <Card className="border-2 border-indigo-500/20 bg-gradient-to-br from-slate-50 to-indigo-50/30 overflow-hidden shadow-xl shadow-indigo-100/50">
            <CardHeader className="border-b border-indigo-100/50 pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                            <BrainCircuit className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Predictive Intelligence</CardTitle>
                            <CardDescription className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-0.5">Eligibility Forecast</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200 font-bold animate-pulse">
                        LIVE AI DATA
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-indigo-100/50">
                    {predictions.map((prediction, idx) => (
                        <div key={idx} className="p-6 hover:bg-white/60 transition-colors group">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                                {prediction.scheme.name}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                {prediction.type === 'age' && (
                                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" /> Age Milestones
                                                    </Badge>
                                                )}
                                                {prediction.type === 'income' && (
                                                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0 flex items-center gap-1">
                                                        <Target className="h-3 w-3" /> Income Alignment
                                                    </Badge>
                                                )}
                                                {prediction.type === 'document' && (
                                                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0 flex items-center gap-1">
                                                        <ClipboardCheck className="h-3 w-3" /> Document Readiness
                                                    </Badge>
                                                )}
                                                <span className="text-xs font-bold text-slate-400">•</span>
                                                <span className="text-xs font-black text-slate-500 tracking-wider">
                                                    {prediction.scheme.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-white/40 rounded-2xl border border-white/60 shadow-sm">
                                        <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                            {prediction.reason}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Path</p>
                                            <div className="space-y-2">
                                                {prediction.actionSteps.map((step, sIdx) => (
                                                    <div key={sIdx} className="flex items-center gap-2">
                                                        <Zap className="h-3.5 w-3.5 text-indigo-500" />
                                                        <span className="text-xs font-bold text-slate-700">{step}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-end items-end">
                                            <div className="bg-indigo-600/5 p-4 rounded-2xl border border-indigo-600/10 text-right w-full md:w-auto">
                                                <div className="flex items-center justify-end gap-2 text-indigo-600 mb-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Time to Target</span>
                                                </div>
                                                <p className="text-2xl font-black text-indigo-700">{prediction.timeToEligibility}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

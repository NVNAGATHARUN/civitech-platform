"use client"

import { RegionalWelfareBridge } from "@/services/analytics"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface WelfareBridgeProps {
    data: RegionalWelfareBridge[]
}

export function WelfareBridge({ data }: WelfareBridgeProps) {
    if (data.length === 0) {
        return (
            <div className="py-10 text-center text-slate-400 font-medium italic">
                Awaiting regional assessment data...
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
                {data.map((item, i) => {
                    const supplyRate = item.demand > 0 ? (item.supply / item.demand) * 100 : 0;
                    const isHighGap = item.gap > item.supply && item.demand > 5;

                    return (
                        <div key={i} className="group p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover-lift">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xl font-black text-[#0F172A]">{item.state}</h4>
                                        {isHighGap && (
                                            <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-100 uppercase text-[10px] font-black tracking-widest px-2 py-0.5">
                                                <AlertTriangle className="h-3 w-3 mr-1" /> High Gap
                                            </Badge>
                                        )}
                                        {supplyRate > 70 && (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 uppercase text-[10px] font-black tracking-widest px-2 py-0.5">
                                                <CheckCircle2 className="h-3 w-3 mr-1" /> High Efficiency
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium lowercase">Gap: {item.gap} people eligible but unserved</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-center px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Demand</p>
                                        <p className="text-lg font-black text-blue-600">{item.demand}</p>
                                    </div>
                                    <div className="text-center px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Supply</p>
                                        <p className="text-lg font-black text-emerald-600">{item.supply}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Enrollment Efficiency</span>
                                    <span className="text-sm font-black text-[#0F172A]">{supplyRate.toFixed(1)}%</span>
                                </div>
                                <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-1000 ease-out rounded-full",
                                            supplyRate < 30 ? "bg-red-500" : supplyRate < 60 ? "bg-amber-500" : "bg-emerald-500"
                                        )}
                                        style={{ width: `${supplyRate}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <span>Identified Needs</span>
                                    <span>Benefits Delivered</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-4 animate-in slide-in-from-bottom-2 duration-500">
                <div className="p-2 bg-blue-600 text-white rounded-lg h-fit">
                    <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-blue-900 mb-1">Bridge Optimization Strategy</h5>
                    <p className="text-xs text-blue-800/70 font-medium leading-relaxed">
                        Areas with high gap (red) require tactical Sahayak deployment to assist document verification at the village level.
                    </p>
                </div>
            </div>
        </div>
    )
}

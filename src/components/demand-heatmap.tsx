"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { RegionalDemand } from "@/services/analytics"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Simplified High-Quality India SVG Paths (Representative coordinates for a premium feel)
// In a production app, we would use a full GeoJSON or a detailed SVG file.
// For the hackfest, we use 10-12 major state markers/regions for "wow" factor.
const STATES_PATH = [
    { id: "MH", name: "Maharashtra", d: "M 150 350 L 180 340 L 210 360 L 220 400 L 190 430 L 140 420 L 130 380 Z" },
    { id: "DL", name: "Delhi", d: "M 165 240 L 175 240 L 175 250 L 165 250 Z" },
    { id: "KA", name: "Karnataka", d: "M 140 420 L 190 430 L 180 480 L 160 510 L 130 500 L 120 460 Z" },
    { id: "TN", name: "Tamil Nadu", d: "M 180 480 L 220 500 L 210 560 L 170 560 L 160 510 Z" },
    { id: "UP", name: "Uttar Pradesh", d: "M 180 230 L 240 240 L 260 280 L 220 310 L 170 280 Z" },
    { id: "WB", name: "West Bengal", d: "M 320 300 L 350 290 L 360 350 L 330 360 L 310 340 Z" },
    { id: "GJ", name: "Gujarat", d: "M 80 300 L 130 290 L 150 350 L 130 380 L 90 370 L 70 340 Z" },
    { id: "RJ", name: "Rajasthan", d: "M 100 220 L 160 210 L 180 230 L 170 280 L 130 290 L 80 270 Z" },
    { id: "TS", name: "Telangana", d: "M 190 400 L 240 380 L 260 430 L 230 460 L 190 430 Z" },
    { id: "KL", name: "Kerala", d: "M 130 500 L 160 510 L 170 560 L 150 580 L 140 560 Z" }
]

interface HeatmapProps {
    data: RegionalDemand[]
}

export function DemandHeatmap({ data }: HeatmapProps) {
    const [hoveredState, setHoveredState] = useState<{ name: string; count: number } | null>(null)

    const maxCount = useMemo(() => {
        if (data.length === 0) return 1
        return Math.max(...data.map(d => d.count))
    }, [data])

    const getIntensity = (stateName: string) => {
        const found = data.find(d => d.state === stateName)
        if (!found) return 0
        return found.count / maxCount
    }

    const getFillColor = (intensity: number) => {
        // Gradient from Slate-100 (0) to Blue-600 (1)
        if (intensity === 0) return "#F8FAFC"
        if (intensity < 0.2) return "#DBEAFE"
        if (intensity < 0.4) return "#93C5FD"
        if (intensity < 0.6) return "#3B82F6"
        if (intensity < 0.8) return "#2563EB"
        return "#1E40AF"
    }

    return (
        <div className="relative group">
            <div className="flex flex-col md:flex-row gap-10 items-center">
                {/* Map Container */}
                <div className="w-full md:w-2/3 aspect-[4/5] relative">
                    <svg
                        viewBox="0 0 500 600"
                        className="w-full h-full drop-shadow-2xl filter"
                        style={{
                            // @ts-ignore
                            "--tw-drop-shadow": "drop-shadow(0 20px 50px rgba(59, 130, 246, 0.15))"
                        }}
                    >
                        {/* Outline of India (Simplified) */}
                        <path
                            d="M 120 100 L 180 60 L 240 100 L 280 180 L 400 240 L 420 320 L 360 400 L 250 580 L 150 580 L 80 400 L 60 280 L 100 180 Z"
                            fill="white"
                            stroke="#E2E8F0"
                            strokeWidth="2"
                            className="transition-all"
                        />

                        {/* Individal States */}
                        {STATES_PATH.map((state) => {
                            const intensity = getIntensity(state.name)
                            const fillColor = getFillColor(intensity)
                            const count = data.find(d => d.state === state.name)?.count || 0

                            return (
                                <path
                                    key={state.id}
                                    d={state.d}
                                    fill={fillColor}
                                    stroke="white"
                                    strokeWidth="1.5"
                                    className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:filter hover:brightness-110"
                                    onMouseEnter={() => setHoveredState({ name: state.name, count })}
                                    onMouseLeave={() => setHoveredState(null)}
                                />
                            )
                        })}
                    </svg>

                    {/* Hover Tooltip - Floating on Map */}
                    {hoveredState && (
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F172A] text-white p-4 rounded-2xl shadow-2xl z-20 border border-blue-500/30 animate-in fade-in zoom-in-95 duration-200 pointer-events-none"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">{hoveredState.name}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black">{hoveredState.count}</span>
                                <span className="text-xs text-slate-400 font-medium lowercase">Assessments</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Legend / Stats Side */}
                <div className="w-full md:w-1/3 space-y-8">
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">State Rankings</h4>
                        <div className="space-y-4">
                            {data.slice(0, 5).map((d, i) => (
                                <div key={i} className="flex items-center justify-between group/item">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400">0{i + 1}</span>
                                        <span className="text-xs font-bold text-slate-700">{d.state}</span>
                                    </div>
                                    <Badge className="bg-blue-50 text-blue-600 border-0 font-black">{d.count}</Badge>
                                </div>
                            ))}
                            {data.length === 0 && (
                                <p className="text-xs text-slate-400 font-medium italic">No regional data available yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <h5 className="text-[10px] font-black text-emerald-600 mb-2 uppercase tracking-widest">Efficiency Insight</h5>
                        <p className="text-[11px] font-medium text-emerald-800 leading-relaxed">
                            {data.length > 0 ? (
                                <>High demand in <strong className="font-bold">{data[0].state}</strong> suggests focusing grassroots volunteer deployment in this region.</>
                            ) : (
                                "Regional patterns will appear here once citizens complete eligibility checks."
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

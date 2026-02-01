"use client"

import { useState, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    X,
    ArrowRight,
    MapPin,
    Sparkles,
    ChevronRight,
    ExternalLink,
    Search,
    Info,
    TrendingUp,
    Loader2
} from "lucide-react"
import { getSchemesByState } from "@/lib/schemes"
import Link from "next/link"
import * as d3 from "d3-geo"

// Normalization mapping for GeoJSON state names to schemes.json names
const STATE_MAPPING: Record<string, string> = {
    "Orissa": "Odisha",
    "Uttaranchal": "Uttarakhand",
    "Andaman and Nicobar Islands": "Andaman and Nicobar",
    // Mapping Telangana to AP for unified demo if not separate in GeoJSON
    "Andhra Pradesh": "Andhra Pradesh"
}

export function StateSchemeExplorer() {
    const [selectedState, setSelectedState] = useState<string | null>(null)
    const [hoveredState, setHoveredState] = useState<string | null>(null)
    const [geoData, setGeoData] = useState<any>(null) // GeoJSON structure is complex
    const [isLoading, setIsLoading] = useState(true)

    // Load GeoJSON data
    useEffect(() => {
        fetch("/india.json")
            .then(res => res.json())
            .then(data => {
                setGeoData(data)
                setIsLoading(false)
            })
            .catch(err => {
                console.error("Failed to load map data:", err)
                setIsLoading(false)
            })
    }, [])

    // Normalize state name for data lookup
    const getNormalizedStateName = (name: string) => {
        return STATE_MAPPING[name] || name
    }

    const stateSchemes = useMemo(() => {
        if (!selectedState) return []
        // Try both raw and normalized names
        const schemes = getSchemesByState(selectedState)
        if (schemes.length === 0) {
            return getSchemesByState(getNormalizedStateName(selectedState))
        }
        return schemes
    }, [selectedState])

    // D3 Projection and Path Generator
    const { paths, bounds } = useMemo(() => {
        if (!geoData) return { paths: [], bounds: null }

        // Increase size for better impact
        const width = 500
        const height = 600

        const projection = d3.geoMercator()
            .fitSize([width, height], geoData)

        const pathGenerator = d3.geoPath().projection(projection)

        const generatedPaths = geoData.features.map((feature: any) => ({
            id: feature.properties.ID_1 || feature.properties.NAME_1,
            name: feature.properties.NAME_1,
            d: pathGenerator(feature) as string,
            feature: feature
        }))

        return { paths: generatedPaths, bounds: { width, height } }
    }, [geoData])

    return (
        <div className="relative w-full min-h-[600px] bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden group/explorer">
            <div className="flex flex-col lg:flex-row h-full">

                {/* Visual Map Side */}
                <div className="relative flex-1 p-10 flex flex-col items-center justify-center bg-slate-50/50 min-h-[600px]">
                    <div className="absolute top-10 left-10 z-10 space-y-2 text-left">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Regional Discovery Engine</h3>
                        </div>
                        <h2 className="text-2xl font-black text-[#0F172A]">Welfare Geography</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optimizing Map Experience...</p>
                        </div>
                    ) : (
                        <div className="relative w-full max-w-[550px] aspect-[4/5] animate-in fade-in zoom-in-95 duration-1000">
                            <svg
                                viewBox={`0 0 500 600`}
                                className="w-full h-full drop-shadow-[0_20px_50px_rgba(59,130,246,0.1)] filter"
                            >
                                {/* Background Outline for depth */}
                                {geoData && (
                                    <path
                                        d={d3.geoPath().projection(
                                            d3.geoMercator().fitSize([500, 600], geoData)
                                        )(geoData) || ""}
                                        fill="white"
                                        stroke="#E2E8F0"
                                        strokeWidth="8"
                                        className="opacity-20"
                                    />
                                )}

                                {/* Individual State Layers */}
                                {paths.map((path: any) => {
                                    const isSelected = selectedState === path.name
                                    const isHovered = hoveredState === path.name

                                    return (
                                        <path
                                            key={path.id}
                                            d={path.d}
                                            onClick={() => setSelectedState(path.name)}
                                            onMouseEnter={() => setHoveredState(path.name)}
                                            onMouseLeave={() => setHoveredState(null)}
                                            className={cn(
                                                "cursor-pointer transition-all duration-500 outline-none",
                                                isSelected
                                                    ? "fill-blue-600 stroke-blue-200 stroke-[2px] filter drop-shadow-[0_0_15px_rgba(37,99,235,0.4)] z-10"
                                                    : isHovered
                                                        ? "fill-blue-400 stroke-white stroke-[1.5px] z-20"
                                                        : "fill-white stroke-slate-200 stroke-[0.5px] hover:fill-blue-50 hover:stroke-blue-200"
                                            )}
                                        />
                                    )
                                })}
                            </svg>

                            {/* Interactive Tooltip - Positioned near center or cursor */}
                            {hoveredState && !selectedState && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
                                    <div className="bg-[#0F172A] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 scale-110 animate-in fade-in zoom-in-95 duration-200">
                                        <MapPin className="h-4 w-4 text-blue-400" />
                                        <span className="text-xs font-black tracking-widest uppercase">{hoveredState}</span>
                                        <ChevronRight className="h-3 w-3 opacity-50" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-auto pt-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {selectedState ? "Click outside or state again to reset" : "Click a state to explore local welfare programs"}
                        </p>
                    </div>
                </div>

                {/* Info Panel Side */}
                <div className={cn(
                    "lg:w-[400px] border-l border-slate-100 bg-white transition-all duration-700 overflow-hidden flex flex-col",
                    selectedState ? "translate-x-0 opacity-100" : "lg:translate-x-full lg:opacity-0 w-0 border-0"
                )}>
                    {selectedState && (
                        <>
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <div className="space-y-1 text-left">
                                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> {selectedState}
                                    </h4>
                                    <p className="text-lg font-black text-slate-900 tracking-tight">Regional Schemes</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedState(null)}
                                    className="h-10 w-10 rounded-full hover:bg-white hover:shadow-md transition-all"
                                >
                                    <X className="h-5 w-5 text-slate-400" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                                {stateSchemes.length > 0 ? (
                                    stateSchemes.map((scheme) => (
                                        <Card key={scheme.id} className="group border-slate-100 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 rounded-2xl overflow-hidden text-left">
                                            <CardContent className="p-5 space-y-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <h5 className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                                            {scheme.name}
                                                        </h5>
                                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-400">
                                                            {scheme.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2 italic">
                                                    &quot;{scheme.descriptionSimple}&quot;
                                                </p>
                                                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                                        <Sparkles className="h-3 w-3" /> Ready to Apply
                                                    </span>
                                                    <Button asChild variant="ghost" className="h-8 px-3 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-lg">
                                                        <Link href={`/schemes?id=${scheme.id}`}>
                                                            DETAILS <ArrowRight className="ml-1 h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="py-20 text-center space-y-4 px-6">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                            <Info className="h-8 w-8 text-slate-200" />
                                        </div>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-relaxed"> No state-specific schemes matching our current repository.</p>
                                        <p className="text-xs text-slate-300 font-medium italic">We&apos;re constantly expanding our database. Check back soon!</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-slate-900 text-white rounded-t-3xl text-left">
                                <div className="flex items-center gap-3 mb-3">
                                    <TrendingUp className="h-4 w-4 text-blue-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Regional Impact</span>
                                </div>
                                <h5 className="text-2xl font-black mb-1">12.5k+</h5>
                                <p className="text-[10px] font-medium text-slate-400">Citizens assisted in {selectedState} this month.</p>
                                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-12 font-black text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-500/20">
                                    VIEW FULL REPORT <ExternalLink className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

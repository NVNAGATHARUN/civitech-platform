"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import * as d3 from "d3"
import { RegionalDemand } from "@/services/analytics"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Layers, Activity, Thermometer, Filter, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeatmapProps {
    data: RegionalDemand[]
}

export function IndiaHeatmap({ data }: HeatmapProps) {
    const [filter, setFilter] = useState<'demand' | 'load' | 'delay'>('demand')
    const [geoData, setGeoData] = useState<any>(null)
    const [heatmapData, setHeatmapData] = useState<RegionalDemand[]>([])
    const [loading, setLoading] = useState(true)
    const [hoveredState, setHoveredState] = useState<any>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [geoRes, dataRes] = await Promise.all([
                    fetch("/india.json"),
                    fetch("/api/admin/heatmap-data")
                ])

                const geoJson = await geoRes.json()
                if (geoJson.features) setGeoData(geoJson)
                else throw new Error("Invalid GeoJSON")

                const dataJson = await dataRes.json()
                if (Array.isArray(dataJson)) setHeatmapData(dataJson)
                else setHeatmapData(data) // Fallback to props
            } catch (e) {
                console.error("Failed to load Heatmap data, using fallbacks:", e)
                // Minimal Fallback for major states to prevent blank dashboard
                setGeoData({
                    type: "FeatureCollection",
                    features: [
                        { type: "Feature", properties: { NAME_1: "Maharashtra" }, geometry: { type: "Polygon", coordinates: [[[73, 19], [76, 21], [80, 20], [80, 16], [74, 15], [73, 19]]] } },
                        { type: "Feature", properties: { NAME_1: "Telangana" }, geometry: { type: "Polygon", coordinates: [[[78, 18], [80, 19], [81, 17], [79, 16], [77, 17], [78, 18]]] } },
                        { type: "Feature", properties: { NAME_1: "Karnataka" }, geometry: { type: "Polygon", coordinates: [[[74, 15], [77, 18], [78, 15], [77, 12], [74, 13], [74, 15]]] } },
                        { type: "Feature", properties: { NAME_1: "Uttar Pradesh" }, geometry: { type: "Polygon", coordinates: [[[78, 28], [82, 28], [84, 25], [81, 24], [78, 26], [78, 28]]] } }
                    ]
                })
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [data])

    const maxCount = useMemo(() => {
        const sourceData = heatmapData.length > 0 ? heatmapData : data
        if (sourceData.length === 0) return 1
        return Math.max(...sourceData.map(d => d.count))
    }, [heatmapData, data])

    useEffect(() => {
        if (geoData && svgRef.current) {
            renderMap()
        }
    }, [geoData, filter, data])

    const renderMap = () => {
        if (!geoData || !svgRef.current) return

        const width = svgRef.current.clientWidth
        const height = svgRef.current.clientHeight

        d3.select(svgRef.current).selectAll("*").remove()

        const svg = d3.select(svgRef.current)
            .attr("viewBox", [0, 0, width, height])

        // India projection
        const projection = d3.geoMercator()
            .center([82, 22])
            .scale(width * 1.5)
            .translate([width / 2, height / 2])

        const path = d3.geoPath().projection(projection)

        // Color Scale: Yellow -> Orange -> Deep Red
        const colorScale = d3.scaleThreshold<number, string>()
            .domain([0.1, 0.3, 0.6, 0.8, 1.0])
            .range(["#fef9c3", "#fef08a", "#fdba74", "#f97316", "#ef4444", "#991b1b"])

        const g = svg.append("g")

        // Draw States
        g.selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("d", path as any)
            .attr("fill", (d: any) => {
                const stateName = d.properties.NAME_1 || d.properties.st_nm || d.properties.name
                const match = (heatmapData.length > 0 ? heatmapData : data).find(rd => rd.state.toLowerCase() === stateName?.toLowerCase())
                const intensity = match ? match.count / maxCount : 0
                return colorScale(intensity)
            })
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 0.5)
            .attr("class", "transition-colors duration-500 cursor-pointer hover:brightness-90")
            .on("mouseenter", (event, d: any) => {
                const stateName = d.properties.NAME_1 || d.properties.st_nm || d.properties.name
                const match = (heatmapData.length > 0 ? heatmapData : data).find(rd => rd.state.toLowerCase() === stateName?.toLowerCase())
                setHoveredState({
                    name: stateName,
                    count: match?.count || 0,
                    x: event.pageX,
                    y: event.pageY
                })
            })
            .on("mouseleave", () => setHoveredState(null))

        // Add organic glow/blur effect via SVG filters
        const filterDef = svg.append("defs")
            .append("filter")
            .attr("id", "organic-glow")
            .append("feGaussianBlur")
            .attr("stdDeviation", "2")
            .attr("result", "coloredBlur")

        // In a real "thermal" app, we'd overlay a Canvas here for smooth point-to-point interpolation.
        // For this hackfest version, we use the highly responsive D3 Map with organic transition.
    }

    if (loading) {
        return (
            <div className="h-[500px] flex items-center justify-center bg-slate-50 rounded-3xl">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    const currentData = heatmapData.length > 0 ? heatmapData : data

    return (
        <div className="relative group p-0 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Visual Section */}
                <div className="lg:w-2/3 relative aspect-[4/5] bg-white rounded-[2.5rem] border border-slate-100 shadow-inner overflow-hidden">
                    <div className="absolute top-8 left-8 z-10 space-y-2">
                        <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-red-500" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">System Stress Monitoring</span>
                        </div>
                    </div>

                    <div className="absolute top-8 right-8 z-10">
                        <div className="flex bg-slate-100/80 backdrop-blur-md p-1 rounded-2xl border border-white shadow-sm">
                            {(['demand', 'load', 'delay'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        filter === t ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <svg ref={svgRef} className="w-full h-full p-10 filter" />

                    {/* Scale Legend */}
                    <div className="absolute bottom-10 left-10 space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intensity Scale</p>
                        <div className="flex gap-1">
                            {["#fef9c3", "#fef08a", "#fdba74", "#f97316", "#ef4444", "#991b1b"].map(c => (
                                <div key={c} className="h-2 w-8 rounded-full" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Insight Section */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    <Card className="border-0 bg-slate-50/50 rounded-[2.5rem] flex-1">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black text-[#0F172A]">State Insights</CardTitle>
                            <CardDescription className="font-medium">Real-time regional pressure points.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            {currentData.slice(0, 4).map((d, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                                    <div className="flex gap-4 items-center">
                                        <div className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs",
                                            i === 0 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
                                        )}>
                                            0{i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{d.state}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{d.count} Assessments</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-12 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-900" style={{ width: `${(d.count / maxCount) * 100}%` }} />
                                    </div>
                                </div>
                            ))}

                            <div className="p-6 bg-[#0F172A] text-white rounded-[2rem] space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <Activity className="h-4 w-4 text-white" />
                                    </div>
                                    <h5 className="text-sm font-black">Optimization Alert</h5>
                                </div>
                                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                                    Detected <strong>{currentData[0]?.count || 0}</strong> peak requests in <strong>{currentData[0]?.state || "N/A"}</strong>.
                                    Recommend moving 15% of Sahayak processing capacity to this region.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Hover Tooltip */}
            {hoveredState && (
                <div
                    className="fixed pointer-events-none z-50 bg-[#0F172A] text-white px-5 py-4 rounded-3xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200"
                    style={{ left: hoveredState.x + 20, top: hoveredState.y - 20 }}
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">{hoveredState.name}</p>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-black">{hoveredState.count}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-600" />
                        <span className="text-xs font-bold text-slate-400">Total Demand</span>
                    </div>
                </div>
            )}
        </div>
    )
}

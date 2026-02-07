"use client"

import { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, BarChart3, PieChart as PieChartIcon, Loader2, Info } from "lucide-react"
import { getEligibilityGraphData, EligibilityGraphData, GraphNode, GraphEdge } from "@/services/data-service"
import { cn } from "@/lib/utils"

interface SimulationNode extends d3.SimulationNodeDatum, GraphNode { }
interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
    value: number;
}

export function EligibilityGraph() {
    const [view, setView] = useState<'network' | 'bar' | 'pie'>('network')
    const [data, setData] = useState<EligibilityGraphData | null>(null)
    const [loading, setLoading] = useState(true)
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const graphData = await getEligibilityGraphData()
            setData(graphData)
            setLoading(false)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (view === 'network' && data && svgRef.current) {
            renderNetworkGraph()
        }
    }, [view, data])

    const renderNetworkGraph = () => {
        if (!data || !svgRef.current) return

        const width = svgRef.current.clientWidth
        const height = svgRef.current.clientHeight

        // Clear previous SVG content
        d3.select(svgRef.current).selectAll("*").remove()

        const svg = d3.select(svgRef.current)
            .attr("viewBox", [0, 0, width, height])

        const simulation = d3.forceSimulation<SimulationNode>(data.nodes as SimulationNode[])
            .force("link", d3.forceLink<SimulationNode, SimulationLink>(data.links as SimulationLink[]).id((d) => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))

        const link = svg.append("g")
            .attr("stroke", "#94a3b8")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(data.links as SimulationLink[])
            .join("line")
            .attr("stroke-width", (d) => Math.sqrt(d.value) * 2)

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("g")
            .data(data.nodes as SimulationNode[])
            .join("g")
            .call(d3.drag<any, SimulationNode>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        node.append("circle")
            .attr("r", (d) => d.type === 'scheme' ? 12 : 8)
            .attr("fill", (d) => d.type === 'scheme' ? "#3b82f6" : "#f59e0b")

        node.append("text")
            .text((d) => d.label)
            .attr("x", 15)
            .attr("y", 5)
            .attr("stroke", "none")
            .attr("fill", "#1e293b")
            .attr("font-size", "10px")
            .attr("font-weight", (d) => d.type === 'scheme' ? "bold" : "normal")

        node.append("title")
            .text((d) => `${d.label}\nReach: ${d.value} citizens`)

        simulation.on("tick", () => {
            link
                .attr("x1", (d) => (d.source as SimulationNode).x!)
                .attr("y1", (d) => (d.source as SimulationNode).y!)
                .attr("x2", (d) => (d.target as SimulationNode).x!)
                .attr("y2", (d) => (d.target as SimulationNode).y!)

            node
                .attr("transform", (d) => `translate(${d.x},${d.y})`)
        })

        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            event.subject.fx = event.subject.x
            event.subject.fy = event.subject.y
        }

        function dragged(event: any) {
            event.subject.fx = event.x
            event.subject.fy = event.y
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0)
            event.subject.fx = null
            event.subject.fy = null
        }
    }

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Aggregating Life Relationships...</p>
                </div>
            </div>
        )
    }

    const schemeData = data?.nodes.filter(n => n.type === 'scheme').sort((a, b) => b.value - a.value).slice(0, 10) || []

    return (
        <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 text-[10px] font-black uppercase tracking-widest">Knowledge Graph</Badge>
                            <span className="text-[10px] font-bold text-slate-400">v2.0 Beta</span>
                        </div>
                        <CardTitle className="text-2xl font-black text-[#0F172A]">Eligibility Relationships</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Visualizing how demographics segments bridge with welfare schemes.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                        <Button
                            variant={view === 'network' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setView('network')}
                            className={cn("rounded-xl h-9", view === 'network' ? "bg-white text-slate-900 hover:bg-white shadow-sm" : "text-slate-500")}
                        >
                            <Share2 className="h-4 w-4 mr-2" /> Graph
                        </Button>
                        <Button
                            variant={view === 'bar' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setView('bar')}
                            className={cn("rounded-xl h-9", view === 'bar' ? "bg-white text-slate-900 hover:bg-white shadow-sm" : "text-slate-500")}
                        >
                            <BarChart3 className="h-4 w-4 mr-2" /> Demand
                        </Button>
                        <Button
                            variant={view === 'pie' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setView('pie')}
                            className={cn("rounded-xl h-9", view === 'pie' ? "bg-white text-slate-900 hover:bg-white shadow-sm" : "text-slate-500")}
                        >
                            <PieChartIcon className="h-4 w-4 mr-2" /> Reach
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="bg-slate-50/30">
                    {view === 'network' && (
                        <div className="relative h-[500px] w-full p-8 overflow-hidden">
                            <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                            <div className="absolute bottom-10 left-10 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl max-w-[200px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-500 shadow-lg shadow-blue-200" />
                                    <span className="text-[10px] font-black text-slate-700">Scheme Node</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-amber-500 shadow-lg shadow-amber-200" />
                                    <span className="text-[10px] font-black text-slate-700">User Segment</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-[9px] font-medium text-slate-400 italic">Drag nodes to reorganize your governance view.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {(view === 'bar' || view === 'pie') && (
                        <div className="h-[500px] w-full p-10 animate-in fade-in duration-700">
                            {view === 'bar' ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={schemeData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="label"
                                            type="category"
                                            width={150}
                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '20px',
                                                border: 'none',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                                padding: '12px 16px'
                                            }}
                                            labelStyle={{ fontWeight: 'black', marginBottom: '4px' }}
                                        />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={32}>
                                            {schemeData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index < 3 ? '#1e293b' : '#3b82f6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={schemeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={100}
                                            outerRadius={160}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {schemeData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#1e293b', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][index % 5]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Info className="h-4 w-4 text-slate-500" />
                        </div>
                        <p className="text-xs font-medium text-slate-500">Links represent eligibility bridges discovered via AI assessment logs.</p>
                    </div>
                    <Button variant="outline" className="rounded-2xl h-11 px-6 font-bold border-slate-200">
                        GENERATE INSIGHT REPORT
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

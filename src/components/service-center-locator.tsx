"use client"

import { MapPin, Phone, Clock, ArrowRight, ExternalLink, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Center {
    name: string
    address: string
    type: string
    distance: string
    phone: string
    hours: string
}

interface ServiceCenterLocatorProps {
    state: string
    district: string
}

export function ServiceCenterLocator({ state, district }: ServiceCenterLocatorProps) {
    // Semi-mock data logic based on state/district
    const centers: Center[] = [
        {
            name: `${district} Digital Seva Kendra`,
            address: `Main Market Road, near District Collectorate, ${district}, ${state}`,
            type: "Common Service Center (CSC)",
            distance: "1.2 km",
            phone: "+91 98765 43210",
            hours: "09:00 AM - 06:00 PM"
        },
        {
            name: `${state} Jan Seva Office`,
            address: `Civil Lines, Opp. Government Hospital, ${district}, ${state}`,
            type: "Government Office",
            distance: "2.5 km",
            phone: "+91 91234 56789",
            hours: "10:00 AM - 05:00 PM"
        },
        {
            name: "MeeSeva / Aaple Sarkar Center",
            address: `Block-B, Panchayat Bhavan, Rural ${district}, ${state}`,
            type: "MeeSeva / Digital Kendra",
            distance: "4.8 km",
            phone: "+91 99887 76655",
            hours: "08:30 AM - 07:00 PM"
        }
    ]

    const handleGetDirections = (address: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        window.open(url, '_blank')
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                <Globe className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 font-medium">
                    Showing authorized government centers in <span className="font-bold underline">{district}, {state}</span>. These centers can help you with biometric verification and document uploads.
                </p>
            </div>

            <div className="grid gap-4">
                {centers.map((center, i) => (
                    <Card key={i} className="border-slate-100 hover:border-blue-200 hover:shadow-md transition-all rounded-2xl overflow-hidden group">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="flex-1 p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-black text-[#0F172A] group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {center.name}
                                        </h4>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-slate-200">
                                            {center.distance}
                                        </Badge>
                                    </div>
                                    <Badge className="bg-emerald-100 text-emerald-800 border-0 font-bold px-2 py-0 text-[10px] uppercase mb-4">
                                        {center.type}
                                    </Badge>

                                    <div className="space-y-3">
                                        <div className="flex gap-3 text-slate-500">
                                            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                                            <p className="text-xs font-medium leading-relaxed">{center.address}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Phone className="h-3 w-3 text-slate-400" />
                                                <span className="text-xs font-bold">{center.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Clock className="h-3 w-3 text-slate-400" />
                                                <span className="text-xs font-bold">{center.hours}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50/50 md:border-l border-slate-100 flex items-center justify-center">
                                    <Button
                                        onClick={() => handleGetDirections(center.address)}
                                        className="w-full md:w-auto bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest px-6 rounded-xl h-11 shadow-lg shadow-slate-200"
                                    >
                                        Get Directions <ExternalLink className="ml-2 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-medium italic">
                    Note: Carry your Original Aadhaar, PAN, and Income Certificate to these centers.
                </p>
            </div>
        </div>
    )
}

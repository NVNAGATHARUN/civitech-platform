"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    User,
    Bell,
    Shield,
    Lock,
    CheckCircle2,
    Calendar,
    MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function VolunteerSettingsPage() {
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }, 800)
    }

    return (
        <RoleGuard allowedRoles={['volunteer']}>
            <DashboardLayout role="volunteer">
                <div className="max-w-4xl space-y-10 pb-20">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Volunteer Settings</h2>
                        <p className="text-slate-500 font-medium">Manage your field-worker profile, regional assignments, and notification preferences.</p>
                    </div>

                    <div className="grid gap-10">
                        {/* Profile Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-wider">Field Profile</h3>
                            </div>

                            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                            <Input defaultValue="Volunteer Lead" className="h-12 border-slate-200 bg-slate-50/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</Label>
                                            <Input defaultValue="+91 98765 43210" className="h-12 border-slate-200 bg-slate-50/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Village</Label>
                                            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                                                <MapPin className="h-4 w-4 text-emerald-500" /> Rampur Rural
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Synced</Label>
                                            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                                                <Calendar className="h-4 w-4 text-blue-500" /> Today, 09:15 AM
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Security Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                                    <Shield className="h-4 w-4" />
                                </div>
                                <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-wider">Security</h3>
                            </div>

                            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Update Password</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input type="password" placeholder="Current Password" className="h-12 border-slate-200" />
                                            <Input type="password" placeholder="New Password" className="h-12 border-slate-200" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Notifications Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                    <Bell className="h-4 w-4" />
                                </div>
                                <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-wider">Notifications</h3>
                            </div>

                            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                                <CardContent className="p-10 space-y-6">
                                    <ToggleItem title="New Applicant Alerts" description="Be notified when a citizen in your region starts an eligibility check." defaultChecked />
                                    <ToggleItem title="Status Updates" description="Receive updates when an application in your region is approved or rejected." defaultChecked />
                                </CardContent>
                            </Card>
                        </section>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <Button variant="outline" className="h-14 px-8 border-slate-200 font-bold">CANCEL</Button>
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className={cn(
                                    "h-14 px-12 font-black transition-all",
                                    saved ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"
                                )}
                            >
                                {loading ? "SAVING..." : saved ? <><CheckCircle2 className="mr-2 h-5 w-5" /> CHANGES SAVED</> : "SAVE PREFERENCES"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </RoleGuard>
    )
}

function ToggleItem({ title, description, defaultChecked = false }: { title: string, description: string, defaultChecked?: boolean }) {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
                <p className="font-black text-slate-900 leading-none">{title}</p>
                <p className="text-xs text-slate-400 font-medium">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    )
}

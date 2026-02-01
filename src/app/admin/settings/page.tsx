"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    User,
    Bell,
    Shield,
    Smartphone,
    Globe,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
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
        <RoleGuard allowedRoles={['admin']}>
            <DashboardLayout role="admin">
                <div className="max-w-4xl space-y-10 pb-20">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">System Settings</h2>
                        <p className="text-slate-500 font-medium">Manage your administrative profile, security protocols, and notification preferences.</p>
                    </div>

                    <div className="grid gap-10">
                        {/* Profile Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-wider">Administrative Profile</h3>
                            </div>

                            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                            <Input defaultValue="Admin User" className="h-12 border-slate-200 bg-slate-50/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                                            <Input defaultValue="admin@democivitech.com" className="h-12 border-slate-200 bg-slate-50/50" readOnly />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</Label>
                                            <Input defaultValue="Ministry of Social Justice" className="h-12 border-slate-200 bg-slate-50/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Region</Label>
                                            <Input defaultValue="National Headquarters" className="h-12 border-slate-200 bg-slate-50/50" />
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
                                <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-wider">Privacy & Security</h3>
                            </div>

                            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 italic font-medium text-slate-500 text-sm">
                                        <div className="flex items-center gap-4">
                                            <Lock className="h-5 w-5 text-slate-300" />
                                            Two-Factor Authentication is currently ACTIVE.
                                        </div>
                                        <Button variant="link" className="text-blue-600 font-bold p-0">DISABLE</Button>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Change Password</Label>
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
                                    <ToggleItem title="System Updates" description="Be notified when new government schemes are added to the repository." defaultChecked />
                                    <ToggleItem title="High Demand Alerts" description="Receive alerts when specific regions show abnormal scheme demand." defaultChecked />
                                    <ToggleItem title="Security Audit Logs" description="Weekly summary of administrative access and changes." />
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

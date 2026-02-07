"use client"

import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    User,
    Bell,
    Shield,
    Globe,
    Moon,
    Sun,
    Languages,
    CheckCircle2,
    Trash2,
    Lock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/LanguageContext"

export default function UserSettingsPage() {
    const { language, setLanguage } = useLanguage()
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        if (!auth || !auth.app || !auth.app.options || !auth.app.options.apiKey) {
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) setUser(u)
        })
        return () => unsubscribe()
    }, [])

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }, 800)
    }

    return (
        <DashboardLayout role="citizen">
            <div className="max-w-4xl mx-auto space-y-10 pb-20">
                {/* Header */}
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h2>
                    <p className="text-slate-500 font-medium">Customize your experience and manage your personal data preferences.</p>
                </div>

                <div className="grid gap-10">
                    {/* Visual Preferences */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <Languages className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Preferences</h3>
                        </div>

                        <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden bg-white">
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portal Language</Label>
                                    <div className="flex gap-4">
                                        {['en', 'hi', 'te'].map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => setLanguage(lang as any)}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl text-sm font-black transition-all border",
                                                    language === lang
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                                                        : "bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-200"
                                                )}
                                            >
                                                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'తెలుగు'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Apperance Mode</Label>
                                    <div className="flex gap-4">
                                        <button className="flex-1 flex items-center justify-center gap-2 h-14 bg-white border-2 border-blue-600 rounded-2xl text-sm font-black text-blue-600">
                                            <Sun className="h-4 w-4" /> Light Mode
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 h-14 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-400 hover:border-slate-300">
                                            <Moon className="h-4 w-4" /> Dark Mode
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Notification Controls */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                <Bell className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Communication</h3>
                        </div>

                        <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden bg-white">
                            <CardContent className="p-8 space-y-2">
                                <ToggleItem title="Scheme Matching Alerts" description="Get notified immediately when you become eligible for a new government scheme." defaultChecked />
                                <div className="h-px bg-slate-50 my-4" />
                                <ToggleItem title="Application Status Updates" description="Receive push notifications about changes in your benefit delivery timeline." defaultChecked />
                                <div className="h-px bg-slate-50 my-4" />
                                <ToggleItem title="Welfare Newsletters" description="Monthly digest of local community services and resources." />
                            </CardContent>
                        </Card>
                    </section>

                    {/* Privacy & Data */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                <Shield className="h-4 w-4" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Privacy & Data</h3>
                        </div>

                        <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden bg-white">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center justify-between p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                    <div className="flex gap-4">
                                        <Shield className="h-6 w-6 text-emerald-600 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-emerald-900">Local-First OCR is Enabled</p>
                                            <p className="text-xs text-emerald-700 font-medium">Your documents are processed 100% on your device. We never store copies of your identity files.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900">Purge Local Data</p>
                                            <p className="text-xs text-slate-400 font-medium">Clear all cached scheme drafts and verification tokens from this browser.</p>
                                        </div>
                                        <Button variant="outline" className="text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200">
                                            <Trash2 className="h-4 w-4 mr-2" /> PURGE
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between p-8 bg-white border border-slate-200 rounded-3xl">
                        <div className="flex items-center gap-4 text-slate-400">
                            <Lock className="h-5 w-5" />
                            <p className="text-xs font-medium italic">All settings are stored in your encrypted cloud profile.</p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className={cn(
                                    "h-14 px-12 font-black transition-all rounded-2xl",
                                    saved ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                                )}
                            >
                                {loading ? "SAVING..." : saved ? <><CheckCircle2 className="mr-2 h-5 w-5" /> PREFERENCES SAVED</> : "SAVE ALL CHANGES"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

function ToggleItem({ title, description, defaultChecked = false }: { title: string, description: string, defaultChecked?: boolean }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="space-y-1">
                <p className="font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{title}</p>
                <p className="text-xs text-slate-400 font-medium">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    )
}

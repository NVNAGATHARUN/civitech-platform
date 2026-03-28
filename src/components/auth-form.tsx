"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, signUp, resetPassword } from "@/services/auth"
import { auth, db } from "@/lib/firebase"
import { toast } from "sonner"
import { Lock, AlertCircle, CheckCircle2, Sparkles } from "lucide-react"

export function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const isFirebaseReady = db && db.app && db.app.options && db.app.options.apiKey;

        if (!isFirebaseReady) {
            toast.info("Firebase uninitialized. Entering Demo Mode.", {
                description: "Experience the platform with localized data storage.",
                duration: 5000
            })
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
                router.push("/profile")
            }, 1000)
            return;
        }

        setError("")
        setSuccess("")
        setLoading(true)

        try {
            if (isForgotPassword) {
                const result = await resetPassword(email)
                if (result.success) {
                    setSuccess("Check your inbox for reset instructions.")
                    setIsForgotPassword(false)
                } else {
                    setError(result.error || "Failed to send reset email")
                }
            } else if (isLogin) {
                const result = await signIn(email, password)
                if (result.success) {
                    router.push("/profile")
                } else {
                    setError(result.error || "Invalid credentials")
                }
            } else {
                const result = await signUp(email, password)
                if (result.success) {
                    toast.success("Welcome! A digital verification email has been sent to your primary address.")
                    router.push("/profile")
                } else {
                    setError(result.error || "Signup failed")
                }
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md border-0 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-500">
            <CardHeader className="space-y-4 p-8 pb-4">
                <div className="flex justify-center mb-2">
                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                        <Lock className="h-8 w-8" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
                        {isForgotPassword ? "Reset Gate" : isLogin ? "Welcome Back" : "Join CitizenDesk"}
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium">
                        {isForgotPassword
                            ? "Recover access via your secure email."
                            : isLogin
                                ? "Access your digital welfare dashboard."
                                : "The privacy-first way to access social welfare."}
                    </CardDescription>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 p-8 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Identifier</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {!isForgotPassword && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <Label htmlFor="password" title="Access Password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</Label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                                        onClick={() => setIsForgotPassword(true)}
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                className="h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-xs font-bold leading-tight uppercase tracking-wide">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 text-emerald-600 animate-in slide-in-from-top-2">
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <p className="text-xs font-bold leading-tight uppercase tracking-wide">{success}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-6 p-8 pt-0">
                    <Button type="submit" className="w-full h-14 rounded-2xl premium-gradient text-white font-black text-lg shadow-xl shadow-blue-500/20 border-0 transition-transform active:scale-95" disabled={loading}>
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                SECURING...
                            </div>
                        ) : isForgotPassword ? (
                            "SEND RESET LINK"
                        ) : isLogin ? (
                            "ENTER DASHBOARD"
                        ) : (
                            "CREATE ACCOUNT"
                        )}
                    </Button>

                    {!(db && db.app && db.app.options && db.app.options.apiKey) && (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-14 rounded-2xl border-2 border-emerald-100 text-emerald-600 font-black hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-50"
                            onClick={() => {
                                toast.info("Entering Mock Demo Mode", {
                                    description: "Credentials are not required. Data will be saved locally.",
                                    duration: 3000
                                })
                                setLoading(true)
                                setTimeout(() => {
                                    setLoading(false)
                                    router.push("/profile")
                                }, 800)
                            }}
                        >
                            <Sparkles className="h-5 w-5" />
                            CONTINUE IN DEMO MODE
                        </Button>
                    )}

                    <div className="w-full h-px bg-slate-100 relative">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:text-blue-600 transition-all"
                        onClick={() => {
                            if (isForgotPassword) {
                                setIsForgotPassword(false)
                            } else {
                                setIsLogin(!isLogin)
                            }
                        }}
                    >
                        {isForgotPassword ? "RETURN TO LOGIN" : isLogin ? "CREATE NEW IDENTITY" : "ALREADY HAVE ACCOUNT"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "@/services/auth";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { Globe, Building2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const { language, setLanguage, t } = useLanguage();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] px-4 py-6 pointer-events-none">
            <header className="mx-auto max-w-5xl h-14 bg-white/70 backdrop-blur-2xl rounded-full border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] px-6 flex items-center justify-between pointer-events-auto transition-all duration-500 hover:shadow-[0_12px_48px_rgba(59,130,246,0.12)]">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                            <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">CitizenDesk</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink href="/schemes" label={t.nav.schemes} />
                        <NavLink href="/resources" label={t.nav.resources} />
                        <NavLink href="/volunteer" label={t.nav.volunteer} />
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* Language Switcher - Premium Compact */}
                    <div className="flex bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
                        {(['en', 'hi', 'te'] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-black rounded-full transition-all duration-300",
                                    language === lang
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href="/profile">
                                <Button variant="ghost" size="sm" className="h-9 px-4 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                    {t.nav.profile}
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="h-9 w-9 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" size="sm" className="h-9 px-4 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-600">
                                    {t.nav.login}
                                </Button>
                            </Link>
                            <Link href="/check">
                                <Button size="sm" className="h-9 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 border-0">
                                    {t.nav.getStarted}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
}

function NavLink({ href, label }: { href: string, label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <div className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
            )}>
                {label}
            </div>
        </Link>
    );
}

"use client"

import Link from "next/link"
import { Building2, Github, Twitter, Linkedin, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"
import { usePathname } from "next/navigation"

export default function Footer() {
    const { t } = useLanguage()
    const pathname = usePathname()

    // Hide footer on dashboard and auth pages
    const isDashboard = pathname?.startsWith("/admin") || pathname?.startsWith("/volunteer") || pathname?.startsWith("/login");
    if (isDashboard) return null;

    return (
        <footer className="bg-[#0F172A] text-slate-400 py-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tight">CitizenDesk</span>
                        </Link>
                        <p className="text-sm leading-relaxed font-medium">
                            Empowering citizens through transparent, privacy-first access to government welfare schemes. Built for the next billion users.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
                            <SocialLink href="#" icon={<Github className="h-5 w-5" />} />
                            <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Platform</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/schemes" label="Welfare Explorer" />
                            <FooterLink href="/check" label="Eligibility Check" />
                            <FooterLink href="/volunteer" label="Volunteer Portal" />
                            <FooterLink href="/admin" label="Admin Dashboard" />
                        </ul>
                    </div>

                    {/* Important Resources */}
                    <div className="space-y-6">
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Resources</h4>
                        <ul className="space-y-4">
                            <FooterLink href="#" label="Privacy Policy" />
                            <FooterLink href="#" label="Terms of Service" />
                            <FooterLink href="#" label="Help Center" />
                            <FooterLink href="#" label="Official Sources" isExternal />
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors cursor-pointer">
                                <MapPin className="h-4 w-4 text-blue-500" />
                                New Delhi, India
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors cursor-pointer">
                                <Mail className="h-4 w-4 text-emerald-500" />
                                support@citizendesk.gov.in
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors cursor-pointer">
                                <Phone className="h-4 w-4 text-orange-500" />
                                +91 1800-123-4567
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        © {new Date().getFullYear()} CitizenDesk Portal. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                            System Status: All Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function FooterLink({ href, label, isExternal }: { href: string; label: string; isExternal?: boolean }) {
    return (
        <li>
            <Link
                href={href}
                className="text-sm font-medium hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all"
            >
                {label}
                {isExternal && <ExternalLink className="h-3 w-3 opacity-50" />}
            </Link>
        </li>
    )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
        >
            {icon}
        </a>
    )
}

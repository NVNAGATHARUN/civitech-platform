"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  BarChart3,
  FileSearch,
  Fingerprint,
  Scale
} from "lucide-react";

export default function Home() {
  const { language, t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section - Premium Flow */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

        <div className="container relative z-10 mx-auto px-4 text-center mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-12 border-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Scale className="h-4 w-4" />
            Official Digital Welfare Portal
          </div>

          <h1 className={cn(
            "text-6xl sm:text-8xl font-black tracking-tight mb-8 text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100",
            language === 'en' ? "leading-[0.9]" : "leading-tight py-4"
          )}>
            {t.hero.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{t.hero.subtitle}</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-16 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Button
              size="lg"
              className="h-16 px-12 text-lg font-black bg-white text-blue-600 hover:bg-slate-50 shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all transform hover:scale-105 hover-lift"
              asChild
            >
              <Link href="/check">
                <FileSearch className="mr-3 h-6 w-6" />
                CHECK MY ELIGIBILITY
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-16 px-12 text-lg font-black border-2 border-white/20 text-white hover:bg-white/10 glass-card transition-all hover-lift"
              asChild
            >
              <Link href="/schemes">
                EXPLORE ALL SCHEMES
              </Link>
            </Button>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </section>

      {/* Role Switcher Section */}
      <section className="py-32 pb-48 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <RoleCard
              icon={<Fingerprint className="h-8 w-8 text-blue-500" />}
              title="State Citizens"
              description="Verify eligibility local-first. We scan your documents without storing a single byte of your identity."
              cta="Start Verification"
              href="/check"
              color="blue"
            />
            <RoleCard
              icon={<Users className="h-8 w-8 text-emerald-500" />}
              title="Field Volunteers"
              description="Enable last-mile delivery of government services. Support families in remote regions with local processing."
              cta="Open Portal"
              href="/volunteer"
              color="emerald"
            />
            <RoleCard
              icon={<BarChart3 className="h-8 w-8 text-indigo-500" />}
              title="System Admins"
              description="Monitor scheme performance and demand patterns through anonymized, real-time analytics dashboards."
              cta="Go to Dashboard"
              href="/admin"
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Modern Trust Section */}
      <section className="py-32 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">Security by Architecture.</h2>
            <p className="text-lg text-slate-500 font-medium">We built CitizenDesk to ensure that the most sensitive data in the world — your documents — never leave your hands.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            <TrustItem
              icon={<ShieldCheck className="h-12 w-12 text-blue-600 mx-auto" />}
              title="Local-Only OCR"
              description="Document scanning happens 100% on your device using WebWorkers."
            />
            <TrustItem
              icon={<FileSearch className="h-12 w-12 text-emerald-600 mx-auto" />}
              title="Zero Session Log"
              description="We don't log your files, your face, or your ID numbers. Not even for a second."
            />
            <TrustItem
              icon={<ArrowRight className="h-12 w-12 text-orange-500 mx-auto" />}
              title="Instant Tokens"
              description="Once verified, you get an encrypted token to prove eligibility to agencies."
            />
            <TrustItem
              icon={<Scale className="h-12 w-12 text-indigo-600 mx-auto" />}
              title="Public Trust"
              description="Built to bridge the gap between complex policies and the people they serve."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function RoleCard({ icon, title, description, cta, href, color }: { icon: React.ReactNode, title: string, description: string, cta: string, href: string, color: string }) {
  const glowClasses: Record<string, string> = {
    blue: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] group-hover:border-blue-500/20",
    emerald: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] group-hover:border-emerald-500/20",
    indigo: "group-hover:shadow-[0_0_40px_rgba(79,70,229,0.1)] group-hover:border-indigo-500/20"
  }

  return (
    <div className={cn(
      "p-10 bg-white border border-slate-100 rounded-[2rem] transition-all duration-500 group relative overflow-hidden hover-lift",
      glowClasses[color]
    )}>
      <div className="mb-8 p-4 bg-slate-50 w-fit rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center text-xs font-black tracking-widest text-slate-900 uppercase transition-all hover:gap-4"
      >
        {cta} <ArrowRight className="ml-2 h-5 w-5" />
      </Link>

      {/* Subtle background glow on hover */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700",
        color === 'blue' ? "bg-blue-500/20" : color === 'emerald' ? "bg-emerald-500/20" : "bg-indigo-500/20"
      )}></div>
    </div>
  )
}

function TrustItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-6 text-center group">
      <div className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
        {icon}
      </div>
      <h4 className="text-xl font-black text-slate-900 tracking-tight">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed max-w-[220px] mx-auto font-medium">{description}</p>
    </div>
  )
}

import { cn } from "@/lib/utils";

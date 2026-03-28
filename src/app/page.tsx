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
  Scale,
  Sparkles
} from "lucide-react";
import { TourGuide } from "@/components/tour-guide";
import { cn } from "@/lib/utils";

export default function Home() {
  const { language, t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section - Premium Flow */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden mesh-gradient-animated">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

        {/* Spotlight Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--glow-blue)_0%,_transparent_50%)] opacity-20 pointer-events-none animate-pulse-soft"></div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div id="tour-welcome-badge" className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-card text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-12 border-blue-500/30 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Scale className="h-4 w-4 animate-tilt" />
            {t.hero.badge}
          </div>

          <h1 className={cn(
            "text-6xl sm:text-[10rem] font-black tracking-tighter mb-10 text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 mix-blend-plus-lighter",
            language === 'en' ? "leading-[0.8]" : "leading-tight py-4"
          )}>
            {t.hero.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">{t.hero.subtitle}</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-16 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 opacity-80">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Button
              size="lg"
              className="h-20 px-14 text-xl font-black bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-all transform hover:scale-105 active:scale-95 rounded-2xl group border-0"
              asChild
              id="tour-check-btn"
            >
              <Link href="/check">
                <FileSearch className="mr-3 h-7 w-7 group-hover:rotate-12 transition-transform" />
                {t.hero.cta}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-20 px-14 text-xl font-black border-2 border-white/10 text-white hover:bg-white/10 glass-card transition-all hover:scale-105 active:scale-95 rounded-2xl shadow-xl"
              asChild
            >
              <Link href="/schemes">
                {t.hero.explore}
              </Link>
            </Button>
          </div>
        </div>

        {/* Dynamic Background Glows */}
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[150px] animate-float opacity-50"></div>
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-emerald-600/30 rounded-full blur-[150px] animate-float delay-1000 opacity-50"></div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-soft"></div>
      </section>

      {/* Role Switcher Section */}
      <section className="py-32 pb-48 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <RoleCard
              icon={<Fingerprint className="h-8 w-8 text-blue-500" />}
              title={t.roles.citizen.title}
              description={t.roles.citizen.desc}
              cta={t.roles.citizen.cta}
              href="/check"
              color="blue"
            />
            <RoleCard
              icon={<Users className="h-8 w-8 text-emerald-500" />}
              title={t.roles.volunteer.title}
              description={t.roles.volunteer.desc}
              cta={t.roles.volunteer.cta}
              href="/volunteer"
              color="emerald"
            />
            <RoleCard
              icon={<BarChart3 className="h-8 w-8 text-indigo-500" />}
              title={t.roles.admin.title}
              description={t.roles.admin.desc}
              cta={t.roles.admin.cta}
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
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">{t.trust.title}</h2>
            <p className="text-lg text-slate-500 font-medium">{t.trust.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <TrustItem
              icon={<ShieldCheck className="h-14 w-14 text-blue-600" />}
              title={t.trust.items.ocr.title}
              description={t.trust.items.ocr.desc}
              stagger="stagger-1"
            />
            <TrustItem
              icon={<FileSearch className="h-14 w-14 text-emerald-600" />}
              title={t.trust.items.logs.title}
              description={t.trust.items.logs.desc}
              stagger="stagger-2"
            />
            <TrustItem
              icon={<ArrowRight className="h-14 w-14 text-orange-500" />}
              title={t.trust.items.tokens.title}
              description={t.trust.items.tokens.desc}
              stagger="stagger-3"
            />
            <TrustItem
              icon={<Scale className="h-14 w-14 text-indigo-600" />}
              title={t.trust.items.public.title}
              description={t.trust.items.public.desc}
              stagger="stagger-1"
            />
          </div>
        </div>
      </section>

      <TourGuide
        tourKey="home_page_v1"
        steps={[
          {
            element: '#tour-welcome-badge',
            popover: {
              title: 'Welcome to CiviTech',
              description: 'Your official gateway to government welfare schemes. We simplify access for everyone.',
              side: 'bottom'
            }
          },
          {
            element: '#tour-check-btn',
            popover: {
              title: 'Instant Eligibility Check',
              description: 'The core feature: Find out what you qualify for in seconds without logging in.',
              side: 'bottom'
            }
          },
          {
            element: '[href="/volunteer"]',
            popover: {
              title: 'For Volunteers',
              description: 'Field agents can use this mode to assist citizens in rural areas with local processing.',
              side: 'top'
            }
          }
        ]}
      />
    </div>
  );
}

function RoleCard({ icon, title, description, cta, href, color }: { icon: React.ReactNode, title: string, description: string, cta: string, href: string, color: string }) {
  const glowClasses: Record<string, string> = {
    blue: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] group-hover:border-blue-500/30",
    emerald: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/30",
    indigo: "group-hover:shadow-[0_0_40px_rgba(79,70,229,0.15)] group-hover:border-indigo-500/30"
  }

  return (
    <div className={cn(
      "p-12 bg-white border border-slate-100 rounded-[2.5rem] transition-all duration-700 group relative overflow-hidden hover:-translate-y-4 hover:shadow-2xl",
      glowClasses[color]
    )}>
      <div className="relative z-10">
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
      </div>

      <div className={cn(
        "absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-40 transition-all duration-1000",
        color === 'blue' ? "bg-blue-500" : color === 'emerald' ? "bg-emerald-500" : "bg-indigo-500"
      )}></div>

      {/* Gloss Effect */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
    </div>
  )
}

function TrustItem({ icon, title, description, stagger }: { icon: React.ReactNode, title: string, description: string, stagger?: string }) {
  return (
    <div className={cn("space-y-6 text-center group animate-in fade-in slide-in-from-bottom-8 duration-1000", stagger)}>
      <div className="transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 bg-slate-50 w-24 h-24 flex items-center justify-center rounded-3xl mx-auto group-hover:bg-white group-hover:shadow-xl group-hover:shadow-indigo-500/10">
        <div className="animate-float">
          {icon}
        </div>
      </div>
      <h4 className="text-xl font-black text-slate-900 tracking-tight">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed max-w-[220px] mx-auto font-medium group-hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]">{description}</p>
    </div>
  )
}

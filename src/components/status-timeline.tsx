"use client"

import { SchemeStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Clock, Send, Gift } from "lucide-react"

interface StatusStep {
    id: SchemeStatus
    label: string
    description: string
    icon: any
}

const STEPS: StatusStep[] = [
    { id: 'planned', label: 'Shortlisted', description: 'Scheme saved to your profile for review.', icon: Clock },
    { id: 'applied', label: 'Application Sent', description: 'Your application has been submitted to the department.', icon: Send },
    { id: 'benefit_received', label: 'Benefit Received', description: 'Welfare benefit has been successfully disbursed.', icon: Gift }
]

export function StatusTimeline({ currentStatus }: { currentStatus: SchemeStatus }) {
    const currentIndex = STEPS.findIndex(s => s.id === currentStatus)

    return (
        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-100">
            {STEPS.map((step, index) => {
                const isCompleted = index <= currentIndex
                const isActive = index === currentIndex
                const Icon = step.icon

                return (
                    <div key={step.id} className="relative flex items-start gap-6 group">
                        <div className={cn(
                            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 shadow-sm",
                            isCompleted ? "bg-blue-600 text-white shadow-blue-200" : "bg-white border-2 border-slate-100 text-slate-300"
                        )}>
                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                        </div>

                        <div className="space-y-1 pt-1">
                            <h4 className={cn(
                                "text-sm font-black uppercase tracking-wider transition-colors",
                                isCompleted ? "text-slate-900" : "text-slate-400"
                            )}>
                                {step.label}
                            </h4>
                            <p className={cn(
                                "text-xs font-medium leading-relaxed transition-colors",
                                isCompleted ? "text-slate-500" : "text-slate-300"
                            )}>
                                {step.description}
                            </p>
                        </div>

                        {isActive && (
                            <div className="absolute -left-2 top-0 h-10 w-1 bg-blue-600 rounded-full blur-[2px] opacity-20"></div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

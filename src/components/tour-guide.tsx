"use client"

import { useEffect, useRef } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'

interface TourStep {
    element: string
    popover: {
        title: string
        description: string
        side?: "left" | "top" | "right" | "bottom"
        align?: "start" | "center" | "end"
    }
}

interface TourGuideProps {
    steps: TourStep[]
    tourKey: string // Unique key to track if tour has been seen
    startAutomatically?: boolean
}

export function TourGuide({ steps, tourKey, startAutomatically = true }: TourGuideProps) {
    const driverObj = useRef<any>(null)

    useEffect(() => {
        driverObj.current = driver({
            showProgress: true,
            animate: true,
            steps: steps,
            onDestroyStarted: () => {
                if (!driverObj.current.hasNextStep() || confirm("Are you sure you want to stop the tour?")) {
                    driverObj.current.destroy();
                    localStorage.setItem(`tour_seen_${tourKey}`, 'true');
                }
            },
        });

        const hasSeenTour = localStorage.getItem(`tour_seen_${tourKey}`)

        if (startAutomatically && !hasSeenTour) {
            // Small delay to ensure elements are rendered
            setTimeout(() => {
                driverObj.current.drive()
            }, 1000)
        }
    }, [steps, tourKey, startAutomatically])

    const startTour = () => {
        driverObj.current.drive()
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={startTour}
            className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
        >
            <HelpCircle className="w-4 h-4 mr-2" />
            Tour
        </Button>
    )
}

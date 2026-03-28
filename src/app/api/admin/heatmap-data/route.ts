import { NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, "citizenAssessmentLog"))
        const stateCounts: Record<string, number> = {}
        let maxCount = 0

        snapshot.forEach((doc) => {
            const data = doc.data()
            const state = data.profileData?.state || "Unknown"
            stateCounts[state] = (stateCounts[state] || 0) + 1
            if (stateCounts[state] > maxCount) maxCount = stateCounts[state]
        })

        const heatmapData = Object.entries(stateCounts).map(([state, count]) => ({
            state,
            count,
            intensity: maxCount > 0 ? count / maxCount : 0
        }))

        return NextResponse.json(heatmapData)
    } catch (error: any) {
        console.error("Heatmap API Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

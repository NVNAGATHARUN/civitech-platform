import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export interface RegionalDemand {
    state: string;
    count: number;
}

export interface GlobalImpactStats {
    citizensAssisted: number;
    benefitsEnabled: number;
    estimatedValue: string;
    trustScore: string;
}

export interface RegionalWelfareBridge {
    state: string;
    demand: number; // Assessment count
    supply: number; // Benefit received count
    gap: number;    // Demand - Supply
}

export async function getGlobalImpactStats(): Promise<GlobalImpactStats> {
    try {
        const profilesSnap = await getDocs(collection(db, "citizenProfiles"));
        const profilesCount = profilesSnap.size;

        const statusSnap = await getDocs(collection(db, "schemeStatus"));
        let benefitsCount = 0;
        statusSnap.forEach(doc => {
            if (doc.data().status === 'benefit_received') {
                benefitsCount++;
            }
        });

        // Mock logic for value and trust for now (can be expanded later)
        const estimatedValue = `₹${(benefitsCount * 0.5).toFixed(1)}L`;
        const trustScore = `${Math.min(95 + (benefitsCount / 10), 99).toFixed(0)}%`;

        return {
            citizensAssisted: profilesCount || 0,
            benefitsEnabled: benefitsCount || 0,
            estimatedValue,
            trustScore
        };
    } catch (error) {
        console.error("Error fetching global impact stats:", error);
        return {
            citizensAssisted: 0,
            benefitsEnabled: 0,
            estimatedValue: "₹0L",
            trustScore: "0%"
        };
    }
}

export async function getRegionalDemand(): Promise<RegionalDemand[]> {
    try {
        const logsRef = collection(db, "citizenAssessmentLog");
        const querySnapshot = await getDocs(logsRef);

        const stateCounts: Record<string, number> = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const state = data.profileData?.state || "Unknown";
            stateCounts[state] = (stateCounts[state] || 0) + 1;
        });

        const results = Object.entries(stateCounts).map(([state, count]) => ({
            state,
            count
        }));

        // Sort by count descending
        return results.sort((a, b) => b.count - a.count);
    } catch (error) {
        console.error("Error fetching regional demand:", error);
        return [];
    }
}

export async function getRegionalWelfareBridge(): Promise<RegionalWelfareBridge[]> {
    try {
        // 1. Get Demand from Assessment Logs
        const logsRef = collection(db, "citizenAssessmentLog");
        const logsSnap = await getDocs(logsRef);

        const stateDemand: Record<string, number> = {};
        logsSnap.forEach(doc => {
            const state = doc.data().profileData?.state || "Unknown";
            stateDemand[state] = (stateDemand[state] || 0) + 1;
        });

        // 2. Get Supply from Scheme Status Joined with Profiles
        const profilesSnap = await getDocs(collection(db, "citizenProfiles"));
        const userToState: Record<string, string> = {};
        profilesSnap.forEach(doc => {
            userToState[doc.id] = doc.data().profileData?.state || "Unknown";
        });

        const statusSnap = await getDocs(collection(db, "schemeStatus"));
        const stateSupply: Record<string, number> = {};

        statusSnap.forEach(doc => {
            const data = doc.data();
            if (data.status === 'benefit_received') {
                const state = userToState[data.userId] || "Unknown";
                stateSupply[state] = (stateSupply[state] || 0) + 1;
            }
        });

        // 3. Combine into Bridge
        const allStates = Array.from(new Set([...Object.keys(stateDemand), ...Object.keys(stateSupply)]));

        const bridge = allStates.map(state => {
            const demand = stateDemand[state] || 0;
            const supply = stateSupply[state] || 0;
            return {
                state,
                demand,
                supply,
                gap: Math.max(0, demand - supply)
            };
        });

        return bridge.sort((a, b) => b.demand - a.demand);
    } catch (error) {
        console.error("Error fetching welfare bridge data:", error);
        return [];
    }
}

export interface GraphNode {
    id: string;
    label: string;
    type: 'scheme' | 'segment';
    value: number;
}

export interface GraphEdge {
    source: string;
    target: string;
    value: number;
}

export interface EligibilityGraphData {
    nodes: GraphNode[];
    links: GraphEdge[];
}

export async function getEligibilityGraphData(): Promise<EligibilityGraphData> {
    try {
        const snapshot = await getDocs(collection(db, "citizenAssessmentLog"));
        const schemesSnap = await getDocs(collection(db, "schemes"));
        const schemes: Record<string, string> = {};
        schemesSnap.forEach(doc => {
            schemes[doc.id] = doc.data().name;
        });

        const nodes: Map<string, GraphNode> = new Map();
        const links: Map<string, GraphEdge> = new Map();

        snapshot.forEach((doc) => {
            const data = doc.data();
            const recommendedSchemes = data.recommendedSchemes || [];
            const profile = data.profileData;

            if (!profile) return;

            // Define segments
            const segments = [
                { id: `age_${profile.age < 35 ? 'young' : 'senior'}`, label: profile.age < 35 ? "Young (<35)" : "Senior (35+)" },
                { id: `income_${profile.income < 1 ? 'low' : 'mid'}`, label: profile.income < 1 ? "Low Income (<1L)" : "Mid/High Income" },
                { id: `state_${profile.state}`, label: profile.state }
            ];

            recommendedSchemes.forEach((rs: any) => {
                const schemeId = rs.schemeId;
                const schemeName = schemes[schemeId] || schemeId;

                // Ensure scheme node exists
                if (!nodes.has(schemeId)) {
                    nodes.set(schemeId, { id: schemeId, label: schemeName, type: 'scheme', value: 0 });
                }
                nodes.get(schemeId)!.value += 1;

                segments.forEach(seg => {
                    // Ensure segment node exists
                    if (!nodes.has(seg.id)) {
                        nodes.set(seg.id, { id: seg.id, label: seg.label, type: 'segment', value: 0 });
                    }
                    nodes.get(seg.id)!.value += 1;

                    // Ensure link exists
                    const linkId = `${seg.id}_${schemeId}`;
                    if (!links.has(linkId)) {
                        links.set(linkId, { source: seg.id, target: schemeId, value: 0 });
                    }
                    links.get(linkId)!.value += 1;
                });
            });
        });

        return {
            nodes: Array.from(nodes.values()),
            links: Array.from(links.values())
        };
    } catch (error) {
        console.error("Error fetching graph data:", error);
        return { nodes: [], links: [] };
    }
}

export interface AgeDistribution {
    age: string;
    count: number;
    color: string;
}

export interface IncomeTier {
    tier: string;
    count: number;
}

export interface MonthlyTrend {
    month: string;
    applications: number;
    verified: number;
}

export interface DemographicAnalytics {
    ageDistribution: AgeDistribution[];
    incomeTiers: IncomeTier[];
}

export async function getDemographicAnalytics(): Promise<DemographicAnalytics> {
    try {
        const snapshot = await getDocs(collection(db, "citizenProfiles"));
        const profiles = snapshot.docs.map(doc => doc.data().profileData);

        // Age buckets
        const ageBuckets = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };
        // Income buckets (assuming income is in Lakhs per annum stored as number, e.g., 1.5)
        // If income is not present or 0, we can categorize as Unknown or < 1L
        const incomeBuckets = { "< 1L": 0, "1L - 3L": 0, "3L - 5L": 0, "> 5L": 0 };

        profiles.forEach(p => {
            if (!p) return;
            const age = p.age || 0;
            const income = p.annualIncome || p.income || 0; // Handle schema variations

            // Age Logic
            if (age >= 18 && age <= 25) ageBuckets["18-25"]++;
            else if (age >= 26 && age <= 35) ageBuckets["26-35"]++;
            else if (age >= 36 && age <= 50) ageBuckets["36-50"]++;
            else if (age > 50) ageBuckets["50+"]++;

            // Income Logic
            if (income < 100000) incomeBuckets["< 1L"]++;
            else if (income >= 100000 && income < 300000) incomeBuckets["1L - 3L"]++;
            else if (income >= 300000 && income < 500000) incomeBuckets["3L - 5L"]++;
            else if (income >= 500000) incomeBuckets["> 5L"]++;
        });

        const ageColors: Record<string, string> = {
            "18-25": "#3B82F6",
            "26-35": "#60A5FA",
            "36-50": "#93C5FD",
            "50+": "#BFDBFE"
        };

        return {
            ageDistribution: Object.entries(ageBuckets).map(([age, count]) => ({
                age,
                count,
                color: ageColors[age]
            })),
            incomeTiers: Object.entries(incomeBuckets).map(([tier, count]) => ({
                tier,
                count
            }))
        };
    } catch (error) {
        console.error("Error fetching demographic analytics:", error);
        return {
            ageDistribution: [],
            incomeTiers: []
        };
    }
}

export async function getApplicationTrends(): Promise<MonthlyTrend[]> {
    try {
        // In a real app, we would query by timestamp range.
        // For hackathon, we fetch all logs and aggregate in memory.
        const logsSnap = await getDocs(collection(db, "citizenAssessmentLog"));
        const statusSnap = await getDocs(collection(db, "schemeStatus"));

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trendsMap: Record<string, { applications: number, verified: number }> = {};

        // Process Applications (Assessments)
        logsSnap.forEach(doc => {
            const data = doc.data();
            // Fallback to current date if createdAt missing
            const date = data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date();
            const monthKey = months[date.getMonth()];

            if (!trendsMap[monthKey]) trendsMap[monthKey] = { applications: 0, verified: 0 };
            trendsMap[monthKey].applications++;
        });

        // Process Verified (Benefits Received)
        statusSnap.forEach(doc => {
            const data = doc.data();
            if (data.status === 'benefit_received') {
                const date = data.updatedAt ? new Date(data.updatedAt.seconds * 1000) : new Date();
                const monthKey = months[date.getMonth()];

                if (!trendsMap[monthKey]) trendsMap[monthKey] = { applications: 0, verified: 0 };
                trendsMap[monthKey].verified++;
            }
        });

        // Convert to array and handle sorting (simplified for now: just return what we have or valid months)
        // For a proper chart, we might want to return the last 6 months specifically.
        // Let's just return the months that have data.

        const trends = Object.entries(trendsMap).map(([month, counts]) => ({
            month,
            applications: counts.applications,
            verified: counts.verified
        }));

        // Sort by month index to ensure chronological order
        trends.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));

        return trends;
    } catch (error) {
        console.error("Error fetching application trends:", error);
        return [];
    }
}

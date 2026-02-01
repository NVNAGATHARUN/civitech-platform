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

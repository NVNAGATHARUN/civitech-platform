import { Scheme, CitizenProfile } from "./types"
import schemesData from "./schemes.json"

// Type assertion for the imported JSON to match the Scheme interface partially
// We might need to map it if exact types don't match, but simple casting usually works for JSON
export const schemes: Scheme[] = schemesData as unknown as Scheme[];

export function getMatchedSchemes(profile: CitizenProfile['profileData']): Scheme[] {
    if (!profile) return schemes;

    return schemes.filter(scheme => {
        // Income Check
        if (scheme.incomeLimit > 0 && profile.income) {
            if (Number(profile.income) > scheme.incomeLimit) return false;
        }

        // Age check
        if (scheme.minAge && profile.age) {
            if (Number(profile.age) < scheme.minAge) return false;
        }
        if (scheme.maxAge && profile.age) {
            if (Number(profile.age) > scheme.maxAge) return false;
        }

        // Occupation/Tag Match (Optimized for overlap)
        // If scheme has tags, user must have at least one matching tag OR be generic
        if (scheme.occupationTags && scheme.occupationTags.length > 0) {
            if (profile.occupationTags && profile.occupationTags.length > 0) {
                const hasTag = scheme.occupationTags.some(tag =>
                    profile.occupationTags.includes(tag)
                );
                // If no tag matches, strictly exclude? Or allow if generic? 
                // For hackathon, let's say if scheme demands 'Student', user must have 'Student'.
                if (!hasTag) return false;
            }
        }

        return true;
    })
}

export function getSchemeById(id: string): Scheme | undefined {
    return schemes.find(s => s.id === id);
}

export function getSchemesByState(state: string): Scheme[] {
    const normalizedState = state.toLowerCase();
    return schemes.filter(scheme => {
        if (!scheme.states) return false;
        return scheme.states.some(s =>
            s.toLowerCase() === "all" || s.toLowerCase() === normalizedState
        );
    });
}

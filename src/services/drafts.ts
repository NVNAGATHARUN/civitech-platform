export interface CitizenDraft {
    id: string;
    name: string;
    age: number;
    occupation: string;
    income: number;
    state: string;
    district: string;
    createdAt: number;
}

const STORAGE_KEY = "citizen_desk_drafts";

export const DraftService = {
    saveDraft(draft: Omit<CitizenDraft, "id" | "createdAt">) {
        const drafts = this.getAllDrafts();
        const newDraft: CitizenDraft = {
            ...draft,
            id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            createdAt: Date.now()
        };
        drafts.push(newDraft);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
        return newDraft;
    },

    getAllDrafts(): CitizenDraft[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error parsing drafts:", e);
            return [];
        }
    },

    deleteDraft(id: string) {
        const drafts = this.getAllDrafts().filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    },

    clearDrafts() {
        localStorage.removeItem(STORAGE_KEY);
    }
};

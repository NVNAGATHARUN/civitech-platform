import { WelfareUpdate, CitizenProfile } from '@/lib/types';

const MOCK_UPDATES: WelfareUpdate[] = [
    {
        id: 'upd-1',
        title: 'Scholarship Extension: Maharashtra',
        description: 'The deadline for MahaDBT post-matric scholarships for Minority students has been extended by 15 days due to server issues.',
        type: 'deadline',
        severity: 'high',
        date: '2026-02-15',
        occupationTags: ['student'],
        states: ['Maharashtra'],
        actionLabel: 'Check Deadline',
        actionLink: '/check'
    },
    {
        id: 'upd-2',
        title: 'New Scheme: PM Kisan Samman 2.0',
        description: 'Updated eligibility criteria for marginal farmers. Income limit slightly increased, making more residents eligible.',
        type: 'new_scheme',
        severity: 'medium',
        date: '2026-02-10',
        occupationTags: ['farmer'],
        states: ['ALL'],
        actionLabel: 'Check Eligibility',
        actionLink: '/check'
    },
    {
        id: 'upd-3',
        title: 'Self-Employment Grant Alert',
        description: 'New government grant for minority entrepreneurs in Hyderabad district. Apply before the end of the month.',
        type: 'benefit_boost',
        severity: 'high',
        date: '2026-02-28',
        occupationTags: ['business', 'entrepreneur'],
        states: ['Telangana'],
        actionLabel: 'View Grant',
        actionLink: '/check'
    },
    {
        id: 'upd-4',
        title: 'Ration Card KYC Update',
        description: 'Mandatory e-KYC for all BPL ration card holders in rural areas. Visit your nearest CSC to avoid suspension.',
        type: 'policy_change',
        severity: 'medium',
        date: '2026-03-01',
        occupationTags: ['laborer', 'unemployed'],
        states: ['ALL'],
        actionLabel: 'Find Center',
        actionLink: '/check'
    },
    {
        id: 'upd-5',
        title: 'Aadhaar-PAN Linking Phase 3',
        description: 'Final phase for linking identification documents. Ensure your mobile number is updated to receive direct benefits sync.',
        type: 'policy_change',
        severity: 'info',
        date: '2026-03-15',
        occupationTags: [],
        states: ['ALL'],
        actionLabel: 'Update Docs',
        actionLink: '/profile'
    }
];

export async function getPersonalizedUpdates(profile?: CitizenProfile['profileData']): Promise<WelfareUpdate[]> {
    if (!profile) return MOCK_UPDATES.filter(u => u.severity === 'info' || u.states.includes('ALL'));

    return MOCK_UPDATES.filter(update => {
        const stateMatch = update.states.includes('ALL') || update.states.includes(profile.state);
        const tagMatch = update.occupationTags.length === 0 ||
            update.occupationTags.some(tag => profile.occupationTags.includes(tag));

        return stateMatch && tagMatch;
    });
}

interface AdminChartProps {
    statusCounts: {
        shortlisted: number;
        planned: number;
        applied: number;
        received: number;
    }
}

export function AdminChart({ statusCounts }: AdminChartProps) {
    const total = (statusCounts.shortlisted || 0) + (statusCounts.planned || 0) + (statusCounts.applied || 0) + (statusCounts.received || 0);
    const getPercent = (val: number) => total > 0 ? (val / total) * 100 : 0;

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span>Shortlisted / Planned</span>
                    <span className="font-bold">{statusCounts.shortlisted + statusCounts.planned}</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${getPercent(statusCounts.shortlisted + statusCounts.planned)}%` }}></div>
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span>Applications Submitted</span>
                    <span className="font-bold">{statusCounts.applied}</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${getPercent(statusCounts.applied)}%` }}></div>
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span>Benefits Received</span>
                    <span className="font-bold">{statusCounts.received}</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${getPercent(statusCounts.received)}%` }}></div>
                </div>
            </div>
        </div>
    )
}

import { StatsTable } from "@/components/StatsTable";
import { getAugmentStats } from "@/lib/api";

type AugmentStat = {
    augment: string;
    set_id: string;
    games_played: number;
    avg_placement: number;
    top4_rate: number;
};

export default async function AugmentsPage() {
    const stats: AugmentStat[] = await getAugmentStats();

    return (
        <div>
            <h1>Augment Stats</h1>
            <StatsTable
                columns={[
                    { label: "Augment", key: "augment" },
                    { label: "Set", key: "set_id" },
                    { label: "Games", key: "games_played" },
                    { label: "Avg Place", key: "avg_placement" },
                    { label: "Top 4 %", key: "top4_rate" },
                ]}
                rows={stats}
                rowKey={(row) => `${row.augment}-${row.set_id}`}
                renderCell={(row, key) => {
                    if (key === "top4_rate") {
                        return `${(row.top4_rate * 100).toFixed(1)}%`;
                    }
                    if (key === "avg_placement") {
                        return Number(row.avg_placement).toFixed(2);
                    }
                    return (row as any)[key];
                }}
            />
        </div>
    );
}
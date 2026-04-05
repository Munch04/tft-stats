import { StatsTable } from "@/components/StatsTable";
import { getItemStats } from "@/lib/api";

type ItemStat = {
    item: string;
    set_id: string;
    games_played: number;
    avg_placement: number;
    top4_rate: number;
};

export default async function ItemsPage() {
    const stats: ItemStat[] = await getItemStats();

    return (
        <div>
            <h1>Item Stats</h1>
            <StatsTable
                columns={[
                    { label: "Item", key: "item" },
                    { label: "Set", key: "set_id" },
                    { label: "Games", key: "games_played" },
                    { label: "Avg Place", key: "avg_placement" },
                    { label: "Top 4 %", key: "top4_rate" },
                ]}
                rows={stats}
                rowKey={(row) => `${row.item}-${row.set_id}`}
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
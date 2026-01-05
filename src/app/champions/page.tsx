import { StatsTable } from "@/components/StatsTable";
import { getChampionStats } from "@/lib/api";

type ChampionStat = {
	champion: string;
	set_id: string;
	games_played: number;
	avg_placement: number;
	top4_rate: number;
};

export default async function ChampionsPage() {
	const stats: ChampionStat[] = await getChampionStats();

	return (
		<div>
			<h1>Champion Stats</h1>

			<StatsTable
				columns={[
					{ label: "Champion", key: "champion" },
					{ label: "Set", key: "set_id" },
					{ label: "Games", key: "games_played" },
					{ label: "Avg Place", key: "avg_placement" },
					{ label: "Top 4 Percentage", key: "top4_rate" },
				]}
				rows={stats}
				rowKey={(row) => `${row.champion}-${row.set_id}`}
				renderCell={(row, key) => {
					if (key === "top4_rate") {
						return `${(row.top4_rate * 100).toFixed(1)}%`;
					}

					return (row as any)[key];
				}}
			/>
		</div>
	);
}
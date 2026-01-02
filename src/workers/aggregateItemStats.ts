import { pool } from "@/lib/db";

export async function aggregateItemStats() {
	try {
		await pool.query(`
			INSERT INTO item_stats (item, set_id, games_played, avg_placement, top4_rate, last_updated)
			SELECT
				mi.item,
				m.set_id,
				COUNT(*) AS games_played,
				AVG(m.placement)::NUMERIC(4,2) AS avg_placement,
				AVG(CASE WHEN m.placement <= 4 THEN 1 ELSE 0 END)::NUMERIC(3,2) AS top4_rate,
				NOW() AS last_updated
			FROM match_items mi
			JOIN matches m ON mi.match_id = m.match_id
			GROUP BY mi.item, m.set_id
			ON CONFLICT (item, set_id) DO UPDATE
				SET games_played = EXCLUDED.games_played,
					avg_placement = EXCLUDED.avg_placement,
					top4_rate = EXCLUDED.top4_rate,
					last_updated = EXCLUDED.last_updated;
		`);
		console.log("Item stats aggregation complete.");
	} catch (err) {
		console.error("Error aggregating item stats:", err);
		throw err;
	}
}
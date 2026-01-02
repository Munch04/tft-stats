import { pool } from "@/lib/db";

export async function aggregateAugmentStats() {
	await pool.query(`
        INSERT INTO augment_stats (
            augment,
            set_id,
            games_played,
            avg_placement
        )
        SELECT
            ma.augment,
            m.set_id,
            COUNT(*) AS games_played,
            ROUND(AVG(m.placement)::numeric, 2) AS avg_placement
        FROM match_augments ma
        JOIN matches m
            ON ma.match_id = m.match_id
        GROUP BY ma.augment, m.set_id
        ON CONFLICT (augment, set_id)
        DO UPDATE SET
            games_played = EXCLUDED.games_played,
            avg_placement = EXCLUDED.avg_placement;
    `);
}

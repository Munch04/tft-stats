import { pool } from "@/lib/db";
 
export async function aggregateChampionStats() {
    await pool.query(`
        INSERT INTO champion_stats (champion, set_id, games_played, avg_placement, top4_rate)
        SELECT
            mu.unit_name AS champion,
            m.set_id,
            COUNT(*) AS games_played,
            AVG(m.placement) AS avg_placement,
            AVG(CASE WHEN m.placement <= 4 THEN 1 ELSE 0 END) AS top4_rate
        FROM match_units mu
        JOIN matches m ON mu.match_id = m.match_id
        GROUP BY mu.unit_name, m.set_id
        ON CONFLICT (champion, set_id)
        DO UPDATE SET
            games_played = EXCLUDED.games_played,
            avg_placement = EXCLUDED.avg_placement,
            top4_rate = EXCLUDED.top4_rate,
            last_updated = NOW();
    `);
}
 
export async function aggregateChampionItemStats() {
    await pool.query(`
        INSERT INTO champion_item_stats (
            champion,
            item,
            set_id,
            games_played,
            avg_placement
        )
        SELECT
            mu.unit_name AS champion,
            mi.item,
            m.set_id,
            COUNT(*) AS games_played,
            AVG(m.placement) AS avg_placement
        FROM match_items mi
        JOIN match_units mu
            ON mi.match_id = mu.match_id
            AND mi.unit_name = mu.unit_name
        JOIN matches m
            ON mu.match_id = m.match_id
        GROUP BY mu.unit_name, mi.item, m.set_id
        ON CONFLICT (champion, item, set_id)
        DO UPDATE SET
            games_played = EXCLUDED.games_played,
            avg_placement = EXCLUDED.avg_placement;
    `);
}
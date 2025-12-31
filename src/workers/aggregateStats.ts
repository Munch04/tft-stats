import { pool } from "@lib/db";

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
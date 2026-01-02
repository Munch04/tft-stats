import { pool } from "@/lib/db";

export async function GET() {
	try {
		const result = await pool.query(`
			SELECT champion, set_id, games_played, avg_placement, top4_rate
			FROM champion_stats
			ORDER BY games_played DESC
			LIMIT 100
		`);

		return new Response(JSON.stringify(result.rows), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("Error fetching champion stats:", err);
		return new Response(JSON.stringify({ error: "Failed to fetch champion stats" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
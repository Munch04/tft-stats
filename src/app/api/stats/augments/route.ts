import { pool } from "@/lib/db";

export async function GET() {
	const { rows } = await pool.query(`
		SELECT augment, set_id, games_played, avg_placement, top4_rate
		FROM augment_stats
		ORDER BY games_played DESC
		LIMIT 100;
	`);
	return new Response(
		JSON.stringify({
			status: "success",
			data: rows,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		}
	);
}
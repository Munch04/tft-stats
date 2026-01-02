import { aggregateItemStats } from "@/workers/aggregateItemStats";

export async function POST() {
	try {
		await aggregateItemStats();
		return new Response(JSON.stringify({ message: "Item stats aggregated." }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch {
		return new Response(JSON.stringify({ error: "Aggregation failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
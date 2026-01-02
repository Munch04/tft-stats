import { aggregateItemStats } from "@/workers/aggregateItemStats";

export async function POST() {
	await aggregateItemStats();
	return new Response(
		JSON.stringify({
			status: "success",
			message: "Item stats aggregated",
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		}
	);
}
import { aggregateChampionStats, aggregateChampionItemStats } from "@/workers/aggregateStats";

export async function POST() {
    await aggregateChampionStats();
    await aggregateChampionItemStats();
    return Response.json({ ok: true });
}
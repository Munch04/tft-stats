import { aggregateChampionStats } from "@/workers/aggregateStats";

export async function POST() {
    await aggregateChampionStats();
    return Response.json({ ok: true });
}
import { aggregateAugmentStats } from "@/workers/aggregateAugmentStats";

export async function POST() {
    await aggregateAugmentStats();
    return Response.json({ status: "ok" });
}
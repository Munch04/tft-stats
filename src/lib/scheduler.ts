import { matchQueue } from "./redis";
import { getTopPlayers } from "./riot";
 
export async function enqueueTopPlayers(puuids: string[]): Promise<void> {
    for (const puuid of puuids) {
        await matchQueue.add(
            "fetchPlayer",
            { playerId: puuid },
            { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
        );
    }
}
 
async function runScheduler(): Promise<void> {
    try {
        console.log("[scheduler] Fetching top players...");
        const puuids = await getTopPlayers(50);
        await enqueueTopPlayers(puuids);
        console.log(`[scheduler] Enqueued ${puuids.length} players`);
    } catch (err) {
        console.error("[scheduler] Failed to enqueue top players:", err);
    }
}
 
// Runs on startup then every hour
runScheduler();
setInterval(runScheduler, 1000 * 60 * 60);
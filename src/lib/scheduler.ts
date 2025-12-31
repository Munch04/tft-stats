import { matchQueue } from "./redis";

export async function enqueueTopPlayers(topPlayers: string[]) {
    for (const playerId of topPlayers) {
        await matchQueue.add(
            "fetchPlayer",
            { playerId },
            { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
        );
    }
}

setInterval(async () => {
    const topPlayers = await getTopPlayersFromRiot();
    await enqueueTopPlayers(topPlayers);
    console.log("Endqueued top players:", topPlayers);
}, 1000 * 60 * 60);
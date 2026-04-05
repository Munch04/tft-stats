import { Queue, Worker } from "bullmq";
import { pool } from "./db";
import { getMatchIds, getMatch, ParsedMatch } from "./riot";
 
export const connection = {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
};
 
export const matchQueue = new Queue("matches", { connection });
 
async function saveMatch(match: ParsedMatch): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
 
        for (const participant of match.participants) {
            await client.query(
                `INSERT INTO matches (match_id, set_id, game_datetime, player_puuid, placement)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (match_id) DO NOTHING`,
                [
                    `${match.matchId}_${participant.puuid}`,
                    match.setId,
                    match.gameDatetime,
                    participant.puuid,
                    participant.placement,
                ]
            );
 
            const rowMatchId = `${match.matchId}_${participant.puuid}`;
 
            for (const unit of participant.units) {
                await client.query(
                    `INSERT INTO match_units (match_id, unit_name, tier)
                     VALUES ($1, $2, $3)
                     ON CONFLICT (match_id, unit_name) DO NOTHING`,
                    [rowMatchId, unit.unitName, unit.tier]
                );
 
                for (const item of unit.items) {
                    await client.query(
                        `INSERT INTO match_items (match_id, unit_name, item)
                         VALUES ($1, $2, $3)
                         ON CONFLICT (match_id, unit_name, item) DO NOTHING`,
                        [rowMatchId, unit.unitName, item]
                    );
                }
            }
 
            for (const augment of participant.augments) {
                await client.query(
                    `INSERT INTO match_augments (match_id, augment)
                     VALUES ($1, $2)
                     ON CONFLICT (match_id, augment) DO NOTHING`,
                    [rowMatchId, augment]
                );
            }
        }
 
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}
 
export const matchWorker = new Worker(
    "matches",
    async (job) => {
        const { playerId } = job.data as { playerId: string };
        console.log(`[worker] Processing player: ${playerId}`);

        const matchIds = await getMatchIds(playerId, 20);
        console.log(`[worker] Found ${matchIds.length} matches for ${playerId}`);
 
        for (const matchId of matchIds) {
            try {
                const match = await getMatch(matchId);
                await saveMatch(match);
                console.log(`[worker] Saved match ${matchId}`);
            } catch (err) {
                console.error(`[worker] Failed to save match ${matchId}:`, err);
            }
        }
 
        console.log(`[worker] Done with player: ${playerId}`);
    },
    {
        connection,
        concurrency: 3,
    }
);
 
matchWorker.on("failed", (job, err) => {
    console.error(`[worker] Job ${job?.id} failed:`, err.message);
});
 
matchWorker.on("completed", (job) => {
    console.log(`[worker] Job ${job.id} completed`);
});
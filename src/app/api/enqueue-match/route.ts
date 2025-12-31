import { matchQueue } from "@/lib/redis";

export async function POST(req: Request) {
    const { playerId } = await req.json();

    if (!playerId) {
        return new Response(JSON.stringify({ ok: false, error: "Missing playerId" }), { status: 400 });
    }

    await matchQueue.add(
        "fetchPlayer",
        { playerId },
        { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
    );

    return new Response(JSON.stringify({ ok: true, message: "Job enqueued" }));
}
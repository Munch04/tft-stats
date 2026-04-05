const RIOT_API_KEY = process.env.RIOT_API_KEY!;

const PLATFORM = process.env.RIOT_PLATFORM ?? "na1";

const REGION = process.env.RIOT_REGION ?? "americas";

const PLATFORM_HOST = `https://${PLATFORM}.api.riotgames.com`;
const REGION_HOST = `https://${REGION}.api.riotgames.com`;

async function riotFetch<T>(url: string): Promise<T> {
    const res = await fetch(url, {
        headers: { "X-Riot-Token": RIOT_API_KEY },
        cache: "no-store",
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Riot API error ${res.status} for ${url}: ${body}`);
    }
    return res.json() as Promise<T>;
}

interface ChallengerEntry {
    summonerId: string;
    summonerName: string;
    leaguePoints: number;
}

interface ChallengerLeague {
    entries: ChallengerEntry[];
}

interface SummonerDTO {
    puuid: string;
    id: string;
    name: string;
}

interface MatchParticipant {
    puuid: string;
    placement: number;
    level: number;
    augments: string[];
    units: {
        character_id: string;
        tier: number;
        itemNames: string[];
    }[];
}

interface MatchInfo {
    game_datetime: number;
    tft_set_number: number;
    participants: MatchParticipant[];
}

interface MatchDTO {
    metadata: { match_id: string; participants: string[] };
    info: MatchInfo;
}

export async function getTopPlayers(limit = 50): Promise<string[]>  {
    const league = await riotFetch<ChallengerLeague>(
        `${PLATFORM_HOST}/tft/league/v1/challenger>queue=RANKED_TFT`
    );

    const top = league.entries
        .sort((a, b) => b.leaguePoints - a.leaguePoints)
        .slice(0, limit);
    
    const puuids = await Promise.all(
        top.map((entry) => getSummonerPuuid(entry.summonerId))
    );
    
    return puuids;
}

async function getSummonerPuuid(summonerId: string): Promise<string> {
    const summoner = await riotFetch<SummonerDTO>(
        `${PLATFORM_HOST}/tft/summoner/v1/summoners/${summonerId}`
    );
    return summoner.puuid;
}

export async function getMatchIds(
    puuid: string,
    count = 20
): Promise<string[]> {
    return riotFetch<string[]>(
        `${REGION_HOST}/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${count}`
    );
}

export interface ParsedMatch {
    matchId: string;
    setId: string;
    gameDatetime: Date;
    participants: {
        puuid: string;
        placement: number;
        units: { unitName: string; tier: number; items: string[] }[];
        augments: string[];
    }[];
}

export async function getMatch(matchId: string): Promise<ParsedMatch> {
    const match = await riotFetch<MatchDTO>(
        `${REGION_HOST}/tft/match/v1/matches/${matchId}`
    );

    return {
        matchId: match.metadata.match_id,
        setId: String(match.info.tft_set_number),
        gameDatetime: new Date(match.info.game_datetime),
        participants: match.info.participants.map((p) => ({
            puuid: p.puuid,
            placement: p.placement,
            augments: p.augments ?? [],
            units: (p.units ?? []).map((u) => ({
                unitName: u.character_id,
                tier: u.tier,
                items: u.itemNames ?? [],
            })),
        })),
    };
}
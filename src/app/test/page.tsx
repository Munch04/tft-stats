import { getChampionStats } from "@/lib/api";

export default async function TestPage() {
    const data = await getChampionStats();

    return (
        <pre>{JSON.stringify(data.slice(0,5), null, 2)}</pre>
    );
}
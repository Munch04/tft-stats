export async function getChampionStats() {
    const res = await fetch("http://localhost:3000/api/stats/champions", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch champion stats");
    }

    return res.json();
}

export async function getItemStats() {
    const res = await fetch("http://localhost:3000/api/stats/items", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch item stats");
    }

    return res.json();
}

export async function getAugmentStats() {
    const res = await fetch("http://localhost:3000/api/stats/augments", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch augment stats");
    }

    return res.json();
}
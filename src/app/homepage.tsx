import Link from "next/link";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-8">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">TFT Stats</h1>
            <p className="text-zinc-400 mb-12 text-lg">
                Challenger-level insights for Teamfight Tactics
            </p>

            <nav className="flex flex-col gap-4 w-full max-w-xs">
                <Link
                    href="/champions"
                    className="flex items-center justify-between rounded-xl bg-zinc-800 px-6 py-4 hover:bg-zinc-700 transition-colors"
                >
                    <span className="font-medium">Champions</span>
                    <span className="text-zinc-400">→</span>
                </Link>
                <Link
                    href="/items"
                    className="flex items-center justify-between rounded-xl bg-zinc-800 px-6 py-4 hover:bg-zinc-700 transition-colors"
                >
                    <span className="font-medium">Items</span>
                    <span className="text-zinc-400">→</span>
                </Link>
                <Link
                    href="/augments"
                    className="flex items-center justify-between rounded-xl bg-zinc-800 px-6 py-4 hover:bg-zinc-700 transition-colors"
                >
                    <span className="font-medium">Augments</span>
                    <span className="text-zinc-400">→</span>
                </Link>
            </nav>
        </div>
    );
}
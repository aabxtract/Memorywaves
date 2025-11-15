import { MemoryMapClient } from "@/components/MemoryMapClient";
import { getClusters, getFragments } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function MapPage() {
    const clusters = await getClusters();
    const fragments = await getFragments();

    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Collective Memory Map</h1>
            <p className="text-muted-foreground mb-8">Explore the clusters of shared memories. Each bubble is a memory chain, sized by its number of fragments.</p>
            <div className="relative w-full h-[65vh] rounded-lg border bg-card/30 overflow-hidden">
                <MemoryMapClient clusters={clusters} fragments={fragments} />
            </div>
        </>
    );
}

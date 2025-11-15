import { notFound } from 'next/navigation';
import { getCluster, getFragments } from "@/lib/data";
import { ChainClient } from '@/components/ChainClient';
import type { Metadata } from 'next';
 
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cluster = await getCluster(params.id);
  const title = `Memory Chain ${cluster?.id || 'Not Found'} | Memory Weavers`;
  return { title };
}

export default async function ChainPage({ params }: { params: { id: string } }) {
    const cluster = await getCluster(params.id);
    if (!cluster) {
        notFound();
    }

    const allFragments = await getFragments();
    const clusterFragments = cluster.fragmentIds.map(id => allFragments.find(f => f.id === id)).filter((f): f is NonNullable<typeof f> => f !== undefined);

    return (
        <ChainClient cluster={cluster} fragments={clusterFragments} />
    );
}

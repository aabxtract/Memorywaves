import type { Fragment, Cluster } from '@/lib/types';

// This is a server-side in-memory store.
// In a real app, this would be a database or smart contract.
let fragments: Fragment[] = [
  { id: '1', text: 'A dream about flying over a city of light.', timestamp: Date.now() - 100000, author: '0x1234567890123456789012345678901234567890', clusterId: 'A' },
  { id: '2', text: 'Felt a moment of pure joy watching the sunrise.', timestamp: Date.now() - 50000, author: '0x456...def', clusterId: 'B' },
  { id: '3', text: 'Remembered a forgotten childhood melody.', timestamp: Date.now() - 80000, author: '0x789...ghi', clusterId: 'C' },
  { id: '4', text: 'I had a nightmare about being lost in a dark forest.', timestamp: Date.now() - 20000, author: '0xabc...123', clusterId: 'D' },
  { id: '5', text: 'A fleeting thought about the meaning of time.', timestamp: Date.now() - 60000, author: '0xdef...456', clusterId: 'C' },
  { id: '6', text: 'The city at night looked like a circuit board from my window.', timestamp: Date.now() - 110000, author: '0xghi...789', clusterId: 'A' },
];

let clusters: Cluster[] = [
    { id: 'A', fragmentIds: ['1', '6'], minted: false },
    { id: 'B', fragmentIds: ['2'], minted: false },
    { id: 'C', fragmentIds: ['3', '5'], minted: false },
    { id: 'D', fragmentIds: ['4'], minted: false },
];

// Functions to interact with the data store
export async function getFragments(): Promise<Fragment[]> {
  return Promise.resolve(JSON.parse(JSON.stringify(fragments)));
}

export async function getClusters(): Promise<Cluster[]> {
  return Promise.resolve(JSON.parse(JSON.stringify(clusters)));
}

export async function addFragment(fragment: Omit<Fragment, 'id' | 'timestamp' | 'clusterId'>): Promise<Fragment> {
  const newFragment: Fragment = {
    ...fragment,
    id: (fragments.length + 1).toString(),
    timestamp: Date.now(),
    clusterId: null,
  };
  fragments.push(newFragment);
  return Promise.resolve(newFragment);
}

export async function updateClustering(newClusters: { clusterId: string, fragmentIds: string[] }[]) {
    const updatedFragments = [...fragments];
    const updatedClusters: Cluster[] = [];

    newClusters.forEach((c) => {
        const clusterId = c.clusterId;
        const existingCluster = clusters.find(ec => ec.id === clusterId);

        updatedClusters.push({
            id: clusterId,
            fragmentIds: c.fragmentIds,
            minted: existingCluster ? existingCluster.minted : false,
        });

        c.fragmentIds.forEach(fragmentId => {
            const fragment = updatedFragments.find(f => f.id === fragmentId);
            if (fragment) {
                fragment.clusterId = clusterId;
            }
        });
    });

    fragments = updatedFragments;
    clusters = updatedClusters;

    return Promise.resolve({ fragments, clusters });
}

export async function getFragment(id: string): Promise<Fragment | undefined> {
  return Promise.resolve(fragments.find(f => f.id === id));
}

export async function getCluster(id: string): Promise<Cluster | undefined> {
  return Promise.resolve(clusters.find(c => c.id === id));
}

export async function setClusterMinted(id: string): Promise<Cluster | undefined> {
    const cluster = clusters.find(c => c.id === id);
    if(cluster) {
        cluster.minted = true;
    }
    return Promise.resolve(cluster);
}

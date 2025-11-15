export interface Fragment {
  id: string;
  text: string;
  timestamp: number;
  author: string; // wallet address
  clusterId: string | null;
}

export interface Cluster {
  id:string;
  fragmentIds: string[];
  minted: boolean;
}

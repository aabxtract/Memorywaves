'use client';

import { useState } from 'react';
import type { Cluster, Fragment } from '@/lib/types';
import { GenerativeArt } from './GenerativeArt';
import { Button } from './ui/button';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { formatDistanceToNow } from 'date-fns';
import { shortenAddress } from '@/lib/utils';
import { mintClusterAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';

interface ChainClientProps {
  cluster: Cluster;
  fragments: Fragment[];
}

export function ChainClient({ cluster: initialCluster, fragments }: ChainClientProps) {
  const [cluster, setCluster] = useState(initialCluster);
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const { isConnected, connectWallet } = useWeb3();

  const handleMint = async () => {
    if (!isConnected) {
        toast({ title: 'Wallet not connected', description: 'Please connect your wallet to mint.', variant: 'destructive' });
        connectWallet();
        return;
    }

    setIsMinting(true);
    const result = await mintClusterAction(cluster.id);
    toast({
        title: result.success ? 'Mint Successful' : 'Mint Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive'
    });
    if (result.success) {
        setCluster(prev => ({ ...prev, minted: true }));
    }
    setIsMinting(false);
  };
  
  return (
    <div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Memory Chain {cluster.id}</h1>
                <p className="text-muted-foreground">{fragments.length} fragments woven together.</p>
            </div>
            {cluster.minted ? (
                <Button disabled variant="outline" className="bg-accent/20 border-accent text-accent-foreground">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Minted as NFT
                </Button>
            ) : (
                <Button onClick={handleMint} disabled={isMinting}>
                    {isMinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Mint Memory Chain
                </Button>
            )}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 order-2 lg:order-1 space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Fragments in this Chain</h2>
                {fragments.map(fragment => (
                    <Card key={fragment.id} className="bg-card/50">
                        <CardContent className="p-4">
                            <p className="mb-3 italic">"{fragment.text}"</p>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>by {shortenAddress(fragment.author)}</span>
                                <span>{formatDistanceToNow(new Date(fragment.timestamp), { addSuffix: true })}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
                <h2 className="text-2xl font-bold tracking-tight mb-4">Generative Artwork</h2>
                <div className="aspect-square w-full rounded-lg border bg-card/30 overflow-hidden sticky top-24">
                   <GenerativeArt fragments={fragments} isMinted={cluster.minted} />
                </div>
            </div>
        </div>
    </div>
  );
}

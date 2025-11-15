'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Cluster, Fragment } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MemoryMapClientProps {
  clusters: Cluster[];
  fragments: Fragment[];
}

interface Bubble {
  id: string;
  size: number;
  x: number;
  y: number;
  fragmentCount: number;
  sampleFragments: string[];
  isMinted: boolean;
  animationDelay: string;
}

export function MemoryMapClient({ clusters, fragments }: MemoryMapClientProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      return clusters.map((cluster, index) => {
        const clusterFragments = cluster.fragmentIds.map(id => fragments.find(f => f.id === id)).filter(Boolean) as Fragment[];
        return {
          id: cluster.id,
          size: Math.max(60, Math.min(250, cluster.fragmentIds.length * 25)),
          x: Math.random() * 80 + 10, // % from left
          y: Math.random() * 80 + 10, // % from top
          fragmentCount: cluster.fragmentIds.length,
          sampleFragments: clusterFragments.slice(0, 2).map(f => f.text),
          isMinted: cluster.minted,
          animationDelay: `${index * 100}ms`,
        };
      });
    };
    setBubbles(generateBubbles());
  }, [clusters, fragments]);
  
  if (bubbles.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No memory clusters yet...</div>
  }

  return (
    <TooltipProvider>
      <div className="w-full h-full relative">
        {bubbles.map((bubble) => (
          <Tooltip key={bubble.id} delayDuration={100}>
            <TooltipTrigger asChild>
              <Link href={`/chain/${bubble.id}`} passHref>
                <div
                  className="absolute rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:!opacity-100 animate-in fade-in zoom-in-50"
                  style={{
                    width: bubble.size,
                    height: bubble.size,
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: bubble.isMinted ? 'hsl(var(--accent) / 0.3)' : 'hsl(var(--primary) / 0.5)',
                    borderColor: bubble.isMinted ? 'hsl(var(--accent))' : 'hsl(var(--primary))',
                    borderWidth: bubble.isMinted ? '2px' : '1px',
                    borderStyle: bubble.isMinted ? 'dashed' : 'solid',
                    animationDelay: bubble.animationDelay,
                    opacity: 0.8
                  }}
                >
                  <span className="font-bold text-lg text-primary-foreground select-none">
                    {bubble.fragmentCount}
                  </span>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs text-center p-2">
                <p className="font-bold mb-2">Memory Chain {bubble.id}</p>
                {bubble.sampleFragments.map((text, i) => (
                  <p key={i} className="italic text-sm text-muted-foreground truncate">"{text}"</p>
                ))}
                {bubble.isMinted && <p className="text-accent mt-2 font-semibold">Minted</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

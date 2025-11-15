'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PenSquare, LayoutGrid, Settings } from 'lucide-react';
import { Icons } from '@/components/icons';

const navItems = [
  { href: '/', label: 'Submit Memory' },
  { href: '/map', label: 'Memory Map' },
  { href: '/settings', label: 'Settings' },
];

const icons: { [key: string]: React.ElementType } = {
  '/': PenSquare,
  '/map': LayoutGrid,
  '/settings': Settings,
};

export function AppSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Icons.Logo className="h-6 w-6 text-primary" />
                <span>Memory Weavers</span>
            </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = icons[item.href];
            return (
              <li key={item.href} className="list-none">
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </nav>
      <div className="mt-auto p-4 border-t">
        <div className="text-xs text-muted-foreground">
            <p className="mb-2 font-semibold">Collective Consciousness</p>
            <p>A Web3 dApp where memories become generative art on-chain.</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useWeb3 } from '@/hooks/useWeb3';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Wallet, LogOut } from 'lucide-react';
import { shortenAddress } from '@/lib/utils';
import Link from 'next/link';

export function ConnectWalletButton() {
  const { connectWallet, disconnectWallet, isConnected, address, username } = useWeb3();

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-accent text-accent-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            {username || shortenAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{username || 'My Account'}</DropdownMenuLabel>
          <DropdownMenuItem disabled>
            {shortenAddress(address)}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href="/settings" passHref>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={connectWallet}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}

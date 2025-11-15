"use client";

import React, { createContext, useState, useCallback, useEffect } from 'react';

interface Web3ContextType {
  address: string | null;
  isConnected: boolean;
  username: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  setUsername: (name: string) => void;
}

export const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsernameState] = useState<string | null>(null);

  const connectWallet = useCallback(() => {
    const mockAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setAddress(mockAddress);
    setIsConnected(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', mockAddress);
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        setUsernameState(savedUsername);
      }
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('username');
    }
    setUsernameState(null);
  }, []);

  const setUsername = useCallback((name: string) => {
    setUsernameState(name);
    if (typeof window !== 'undefined') {
        localStorage.setItem('username', name);
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('walletConnected') === 'true') {
      setAddress(localStorage.getItem('walletAddress'));
      setIsConnected(true);
      setUsernameState(localStorage.getItem('username'));
    }
  }, []);

  return (
    <Web3Context.Provider value={{ address, isConnected, username, connectWallet, disconnectWallet, setUsername }}>
      {children}
    </Web3Context.Provider>
  );
}

'use client';
import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { getUserBalance } from '@/lib/pocketbaseServer';

type BalanceContextType = {
  balance: number;           // Balance utente corrente dal database
  loading: boolean;          // Stato caricamento balance
  refetchBalance: () => Promise<void>;  // Funzione refresh balance
};

/**
 * Crea il Context per condividere balance data tra componenti
 * Default value null forza l'uso del Provider
 */
const BalanceContext = createContext<BalanceContextType | null>(null);

/**
 * Provider centrale per gestione stato balance
 * Fetch iniziale e fornisce refetch a tutti i figli
 */
export function BalanceProvider({ children }: { children: ReactNode }) {
  // Single source of truth per balance e loading state
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  /**
   * Funzione refresh balance: API call + update stato
   * useCallback mantiene reference stabile per evitare re-render inutili
   */
  const refetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const balanceData = await getUserBalance();  // Chiama PocketBase
      setBalance(balanceData);                     // Trigger re-render figli
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(0);  // Fallback su errore
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch iniziale al mount del Provider
  useEffect(() => {
    refetchBalance();
  }, [refetchBalance]);

  // Broadcast stato a tutti i componenti figli
  return (
    <BalanceContext.Provider value={{ balance, loading, refetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

/**
 * Hook custom per accesso sicuro al balance context
 * Throw error se usato fuori dal Provider (error boundary friendly)
 */
export function useBalance() {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}

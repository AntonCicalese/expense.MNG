'use client';
import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { getUserBalance } from '@/lib/pocketbaseServer';

type BalanceContextType = {
  balance: number;           // Current user balance from database
  loading: boolean;          // Is balance currently fetching?
  refetchBalance: () => Promise<void>;  // Function to refresh balance
};

/**
 * Creates the Context "channel" - like a radio frequency (98.5 FM)
 * All components tune into this same frequency to share balance data
 * Default value is null (components MUST be wrapped in Provider)
 */
const BalanceContext = createContext<BalanceContextType | null>(null);

/**
 * BalanceProvider - THE CENTRAL HUB for all balance data
 * 
 * Responsibilities:
 * 1. Fetches balance from PocketBase on mount
 * 2. Stores balance/loading state
 * 3. Provides refetchBalance() function to child components
 * 4. BROADCASTS data to ALL children via Context value prop
 * 
 * Usage: Wrap your app/dashboard with <BalanceProvider>
 */
export function BalanceProvider({ children }: { children: ReactNode }) {
  // Local state - SINGLE SOURCE OF TRUTH for balance data
  const [balance, setBalance] = useState(0);     // Current balance
  const [loading, setLoading] = useState(true);  // Fetching state

  /**
   * refetchBalance - THE KEY FUNCTION
   * 1. Sets loading = true
   * 2. Calls PocketBase API to get latest balance
   * 3. Updates local state with new balance
   * 4. Sets loading = false
   * 5. Triggers ALL child components to re-render with new data 
   * 
   * useCallback prevents unnecessary re-creations (stable reference)
   */
  const refetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const balanceData = await getUserBalance();  // API call
      setBalance(balanceData);                     // ← THIS triggers context update!
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(0);  // Fallback to 0 on error
    } finally {
      setLoading(false);  // Always stop loading
    }
  }, []);  // Empty deps = only create once

  useEffect(() => {
    refetchBalance();  // Load initial balance
  }, [refetchBalance]);

  /**
   * CRITICAL: value prop FILLS the context "radio broadcast"
   * Every time balance/loading changes → Provider re-renders → 
   * value updates → ALL useContext() calls get NEW data instantly
   */
  return (
    <BalanceContext.Provider value={{ balance, loading, refetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

/**
 * useBalance - EASY ACCESS HOOK for any component
 * 
 * Usage in any child component:
 * const { balance, loading, refetchBalance } = useBalance();
 * 
 * SAFETY: Throws error if used outside BalanceProvider
 */
export function useBalance() {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}

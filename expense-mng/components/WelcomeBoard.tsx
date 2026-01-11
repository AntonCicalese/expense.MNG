'use client';
import { useState, useEffect } from 'react';
import { useBalance } from "@/components/balanceContext";

export default function WelcomeBoard() {
  const { balance, loading } = useBalance();
  const [textIndex, setTextIndex] = useState(0);
  const fullText = 'Welcome back, Administrator';
  const accentStartIndex = 13;

  // Typing animation only
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => {
        if (prev < fullText.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  const textSlice = fullText.slice(0, textIndex);
  const isTypingActive = textIndex < fullText.length;
  const accentText = textSlice.slice(accentStartIndex);
  const regularText = textSlice.slice(0, accentStartIndex);

  return (
    <div className="bg-background w-full p-6 rounded-3xl shadow-sm col-span-2 flex items-center justify-between">
      <span className="roundo text-xl flex-1 min-w-0 pr-4 inline-flex items-center gap-1">
        <span className="leading-none">{regularText}</span>
        <span className="text-2xl text-accent font-bold leading-none">{accentText}</span>
        {isTypingActive && (
          <span
            className="inline-block w-2 h-7 bg-accent animate-pulse"
            style={{ verticalAlign: 'middle' }}
            aria-hidden="true"
          />
        )}
      </span>
      
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-foreground/80">Current Balance</div>
        <div className="text-xl font-bold text-accent">
          {loading ? '...' : `€${balance.toFixed(2)}`}
        </div>
      </div>
    </div>
  );
}

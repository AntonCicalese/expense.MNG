"use client";

import { useState, useEffect } from 'react';

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // Stato locale per tracciare se il tema corrente è dark
  const [isDark, setIsDark] = useState(true);

  // Inizializza il tema al mount del componente
  useEffect(() => {
    // Controlla prima localStorage, poi fallback su preferenza sistema
    let saved = localStorage.getItem('theme');
    if (saved == null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      saved = prefersDark ? 'dark' : 'light';
    }
    
    // Imposta stato e attributo HTML root con il tema rilevato
    const shouldBeDark = saved === 'dark';
    setIsDark(shouldBeDark);
    
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  // Funzione per switchare tra light/dark theme
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const themeValue = newTheme ? 'dark' : 'light';
    
    // Salva preferenza in localStorage e aggiorna HTML root
    localStorage.setItem('theme', themeValue);
    document.documentElement.setAttribute('data-theme', themeValue);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-12 h-12 rounded-xl bg-background-light/50 backdrop-blur-sm flex items-center justify-center border border-background-light/50 hover:border-subheader transition-all ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        // Icona luna per tema dark (attivo)
        <svg className="w-5 h-5 text-header" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // Icona sole per tema light (attivo)
        <svg className="w-5 h-5 text-header" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

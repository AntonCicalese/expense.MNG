'use client';

import { useState } from 'react';
import { deleteAllTransactionsAsSuperuser } from '@/lib/pocketbaseServer';

export default function Home() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      await deleteAllTransactionsAsSuperuser();
      setShowWarning(false);
    } catch (err: any) {
      setError(err.message || 'Failed to delete transactions');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark p-12 font-pilcrow col-span-3">
      {/* Danger zone header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-warning/20 border-4 border-warning/40 rounded-2xl flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-black text-header tracking-tight roundo">
              DANGER ZONE
            </h1>
            <p className="text-lg text-subheader font-medium mt-1">Admin Data Controls</p>
          </div>
        </div>

        {/* Warning message - always visible */}
        <div className="bg-warning/10 border-2 border-warning/30 rounded-3xl p-8 mb-12 shadow-2xl backdrop-blur-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-warning/30 border-2 border-warning/50 rounded-2xl flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-header mb-3 roundo">PERMANENT DATA DELETION</h2>
              <div className="space-y-3 text-subheader">
                <p><strong>This action will:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-body">
                  <li>Delete <strong>ALL</strong> transactions permanently</li>
                  <li>Reset user balance to 0</li>
                  <li>Cannot be undone or recovered</li>
                  <li>Takes effect immediately</li>
                </ul>
                <p className="font-semibold mt-4 text-header pt-4 border-t border-background-light roundo">
                  Only admins should use this. Are you <em>absolutely sure</em>?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 p-4 bg-warning/20 border-2 border-warning/40 rounded-2xl backdrop-blur-sm">
            <span className="text-sm text-warning font-medium">{error}</span>
          </div>
        )}

        {/* Delete button */}
        {!showWarning ? (
          <div className="flex flex-col items-center gap-6 p-12 bg-background-light/50 border-2 border-dashed border-warning/30 rounded-3xl backdrop-blur-sm shadow-xl">
            <button
              onClick={() => setShowWarning(true)}
              disabled={isDeleting}
              className="px-12 py-6 bg-warning/90 text-background-dark font-bold text-xl rounded-2xl shadow-2xl hover:bg-warning-dark/90 active:scale-95 transform transition-all duration-200 border border-warning/30 hover:border-warning min-h-18 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="/delete.svg" alt="Delete" className="w-6 h-6" />
              DELETE ALL DATA
            </button>
          </div>

        ) : (
          <div className="bg-warning/20 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border-4 border-warning/40">
            <div className="text-center text-header mb-8">
              <div className="w-24 h-24 bg-warning/40 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-warning/60">
                <svg className="w-12 h-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight roundo">FINAL WARNING</h3>
              <p className="text-xl text-subheader mb-8 max-w-md mx-auto leading-relaxed">
                This will <strong>PERMANENTLY DELETE ALL TRANSACTIONS</strong> and reset balance to zero.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowWarning(false)}
                disabled={isDeleting}
                className="px-8 py-4 bg-background-light/50 hover:bg-background-light text-header font-bold text-lg rounded-2xl backdrop-blur-sm border-2 border-background-light/50 hover:border-subheader transition-all duration-200 flex-1 disabled:opacity-50 disabled:cursor-not-allowed roundo"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={isDeleting}
                className="px-12 py-4 bg-linear-to-r from-warning to-warning-dark text-background-dark font-black text-xl rounded-2xl shadow-2xl border-2 border-warning hover:from-warning-dark hover:to-warning/90 active:scale-[0.97] transition-all duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed min-h-18 flex-1 roundo"
              >
                {isDeleting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    DELETING...
                  </>
                ) : (
                  <>
                    <img src="/delete.svg" alt="Delete" className="w-6 h-6" />
                    CONFIRM DELETE ALL
                  </>
                )}
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

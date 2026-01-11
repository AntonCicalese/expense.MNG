"use client";

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({ open, onCancel, onConfirm }: Props) {
  // Non renderizza nulla se modal chiusa
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/70">
      <div className="bg-background-light w-full max-w-sm rounded-2xl p-6 shadow-lg">
        {/* Layout flex orizzontale: icona + contenuto */}
        <div className="flex items-stretch gap-4">
          {/* Colonna icona warning (altezza piena) */}
          <div className="flex items-center">
            <div className="flex h-full items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-warning/10 text-warning text-3xl font-semibold">
                !
              </div>
            </div>
          </div>

          {/* Contenuto principale: testo + bottoni */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="block text-sm font-semibold text-header">
                Delete transaction?
              </span>
              <p className="mt-1 text-xs text-subheader leading-relaxed">
                This action cannot be undone. Are you sure you want to permanently remove this transaction?
              </p>
            </div>

            {/* Bottoni azioni allineati a destra */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-3.5 py-1.5 text-xs font-medium rounded-full border border-background-light text-subheader
                          hover:bg-background-light hover:text-header transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-1.5 text-xs font-medium rounded-full
                          bg-warning text-background-dark
                          hover:bg-warning-dark hover:text-background-light
                          transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

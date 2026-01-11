"use client";

import { useState, FormEvent } from "react";
import {
  createTransactionAsSuperuser,
  deleteTransactionAsSuperuser,
  updateTransactionAsSuperuser,
  updateUserBalance,
} from "@/lib/pocketbaseServer";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { EditTransactionModal } from "@/components/transactions/EditTransactionModal";
import { DeleteConfirmModal } from "@/components/transactions/DeleteConfirmModal";
import { useBalance } from "@/components/balanceContext";

// Tipo per le righe della tabella transazioni
type Row = { id: string; amount: number; title: string; category: string; created?: string }; 

// Formatta importi numerici con localizzazione (es. 1000.50 → 1,000.50)
function formatAmount(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default function Table({ 
  rows,
  maxHeight,
  colSpan, 
  onTransactionsChange
}: { 
  rows: Row[];
  maxHeight: string; 
  colSpan: string;
  onTransactionsChange?: (newRows: Row[]) => void
}) {
  const { refetchBalance } = useBalance();

  // Stati per modal aggiunta transazione
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [amountType, setAmountType] = useState<"income" | "expense">("income");

  // Stati per modal eliminazione
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Stati per modal modifica transazione
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAmountType, setEditAmountType] = useState<'income' | 'expense'>('expense');
  const [originalAmount, setOriginalAmount] = useState<number>(0);

  // Gestisce submit form aggiunta nuova transazione
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title || !amount || !category) return;

    const signedAmount = Number(amount) * (amountType === 'income' ? 1 : -1);
    const created = await createTransactionAsSuperuser(signedAmount, title, category);
    
    await updateUserBalance(signedAmount);
    await refetchBalance();

    // Notifica parent con nuove righe (nuova + esistenti)
    onTransactionsChange?.([created, ...rows]);

    // Reset form e chiude modal
    setTitle("");
    setAmount("");
    setCategory("");
    setIsOpen(false);
  }

  // Conferma eliminazione transazione e aggiorna balance
  async function confirmDelete() {
    if (!deleteId) return;
    const transactionToDelete = rows.find(r => r.id === deleteId);
    if (!transactionToDelete) return;

    const revertAmount = -transactionToDelete.amount;
    await deleteTransactionAsSuperuser(deleteId);
    await updateUserBalance(revertAmount);
    await refetchBalance();
    
    // Notifica parent con righe filtrate (senza eliminata)
    onTransactionsChange?.(rows.filter((r) => r.id !== deleteId));
    
    setDeleteId(null);
  }

  // Apre modal edit popolando campi con dati riga selezionata
  function openEdit(row: Row) {
    setEditRow(row);
    setEditTitle(row.title);
    setEditAmount(Math.abs(row.amount).toString());
    setEditCategory(row.category ?? "");
    setEditAmountType(row.amount >= 0 ? 'income' : 'expense');
    setOriginalAmount(row.amount);
  }

  // Gestisce submit form modifica transazione
  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editRow) return;

    const newAmount = Number(editAmount) * (editAmountType === 'income' ? 1 : -1);
    const delta = newAmount - originalAmount;
    
    const updated = await updateTransactionAsSuperuser(editRow.id, {
      title: editTitle,
      amount: newAmount,
      category: editCategory,
    });
    
    await updateUserBalance(delta);
    await refetchBalance();

    // Notifica parent sostituendo riga modificata
    onTransactionsChange?.(rows.map((r) => (r.id === updated.id ? updated : r)));
    
    setEditRow(null);
    setOriginalAmount(0);
  }

  return (
    <>
      <div className={`relative bg-background w-full p-6 rounded-3xl shadow-sm col-span-${colSpan}`}>
        {/* Header sezione con titolo e bottone Add */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium tracking-wide uppercase text-subheader">
              Overview
            </span>
            <span className="text-base font-semibold text-header">
              Recent activity
            </span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-accent px-4 py-1.5 text-xs font-medium text-accent hover:bg-accent hover:text-background-light transition-colors"
          >
            <span className="text-base leading-none">+</span>
            <span>Add</span>
          </button>
        </div>

        <div className="h-px w-full bg-body/40 mb-3" />

        {/* Container righe con scroll personalizzato */}
        <div className={`h-${maxHeight} overflow-y-auto pr-1 scroll-thin-muted`}>
          <div className="flex flex-col divide-y divide-body/20">
            {rows.map((row) => (
              <div
                key={row.id}
                className="group flex items-center py-3.5"
              >
                {/* Colonna importo con icona income/expense */}
                <div className="w-28 shrink-0 flex items-center gap-2">
                  <svg 
                    className={`w-4 h-4 ${row.amount >= 0 ? 'text-success' : 'text-warning'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {row.amount >= 0 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    )}
                  </svg>
                  <span className="block text-sm font-semibold text-accent leading-tight truncate">
                    {formatAmount(Math.abs(row.amount))} $
                  </span>
                </div>

                {/* Separatore verticale */}
                <div className="h-8 w-px bg-body/30 mx-3" />

                {/* Colonna categoria con badge */}
                <div className="w-40 shrink-0 flex items-center">
                  <span className="inline-flex max-w-full items-center rounded-full bg-background border border-background-light px-2 py-0.5 text-[11px] text-subheader truncate">
                    {row.category}
                  </span>
                </div>

                {/* Colonna titolo (flessibile) */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-header leading-snug truncate">
                    {row.title}
                  </p>
                </div>

                {/* Bottoni azioni (visibili solo su hover) */}
                <div className="ml-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(row)}
                    className="rounded-full px-2.5 py-1 text-[11px] text-subheader border border-background-light hover:bg-background-light"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(row.id)}
                    className="rounded-full px-2.5 py-1 text-[11px] font-medium
                              text-warning border border-warning-dark
                              hover:bg-warning hover:text-background-light transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal per aggiunta nuova transazione */}
      <AddTransactionModal
        open={isOpen}
        title={title}
        amount={amount}
        category={category}
        amountType={amountType}
        onTitleChange={setTitle}
        onAmountChange={setAmount}
        onCategoryChange={setCategory}
        onAmountTypeChange={setAmountType}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Modal conferma eliminazione */}
      <DeleteConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* Modal per modifica transazione */}
      <EditTransactionModal
        row={editRow}
        title={editTitle}
        amount={editAmount}
        category={editCategory}
        amountType={editAmountType}
        onTitleChange={setEditTitle}
        onAmountChange={setEditAmount}
        onCategoryChange={setEditCategory}
        onAmountTypeChange={setEditAmountType}
        onClose={() => setEditRow(null)}
        onSubmit={handleEditSubmit}
      />
    </>
  );
}

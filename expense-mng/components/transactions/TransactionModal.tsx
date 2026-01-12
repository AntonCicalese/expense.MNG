"use client";

import { FormEvent, useState } from "react";

type Props = {
  mode: 'add' | 'edit';
  open: boolean;
  row?: { id: string; amount: number; title: string; category: string } | null;
  title: string;
  amount: string;
  category: string;
  date: string;
  amountType: 'income' | 'expense';
  onTitleChange: (v: string) => void;
  onAmountChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onAmountTypeChange: (v: 'income' | 'expense') => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
};

// Liste categorie per tipo transazione
const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Bonus", "Investment", "Rental", "Gifts", "Other"
];

const EXPENSE_CATEGORIES = [
  "Food", "Transportation", "Utilities", 
  "Subscriptions", "Entertainment", "Shopping", 
  "Healthcare", "Rent/Mortgage", "Education", "Other"
];

export function TransactionModal({
  mode,
  open,
  row,
  title,
  amount,
  category,
  date,
  amountType,
  onTitleChange,
  onAmountChange,
  onCategoryChange,
  onDateChange,
  onAmountTypeChange,
  onClose,
  onSubmit,
}: Props) {
  const [warning, setWarning] = useState('');
  
  // Non renderizza nulla se modal chiusa (add) o non c'è riga da editare (edit)
  if (!open || (mode === 'edit' && !row)) return null;

  // Seleziona categorie basate sul tipo selezionato
  const categories = amountType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Determina testi dinamici basati sulla modalità
  const headerText = mode === 'add' ? 'New transaction' : 'Edit transaction';
  const subheaderText = mode === 'add' ? 'Add a new entry' : 'Update entry';
  const submitText = mode === 'add' ? 'Submit' : 'Save';

  // Validazione form prima del submit
  const validateForm = (): boolean => {
    if (!title.trim()) {
      setWarning('Title is required');
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setWarning('Please enter a valid amount');
      return false;
    }
    if (!category) {
      setWarning('Please select a category');
      return false;
    }
    if (!date) {
      setWarning('Please select a date');
      return false;
    }
    setWarning('');
    return true;
  };

  // Gestore submit con validazione
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/70">
      <div className="bg-background-light w-full max-w-sm rounded-2xl p-6 shadow-lg">
        {/* Header modal */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-subheader">
              {headerText}
            </span>
            <span className="block text-sm font-semibold text-header">
              {subheaderText}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-subheader hover:text-header"
          >
            ✕
          </button>
        </div>

        {/* Messaggio di errore */}
        {warning && (
          <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
            <span className="text-xs text-warning font-medium">{warning}</span>
          </div>
        )}

        {/* Form principale */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo titolo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-subheader">Title</label>
            <input
              type="text"
              className={`w-full rounded-lg bg-background border px-3 py-2.5 text-sm text-header placeholder:text-subheader/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-all ${
                !title.trim() && warning ? 'border-warning ring-1 ring-warning/40' : 'border-background-light'
              }`}
              placeholder="Groceries at supermarket"
              value={title}
              onChange={(e) => {
                onTitleChange(e.target.value);
                if (warning) setWarning('');
              }}
            />
          </div>

          {/* Toggle Income/Expense */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-subheader">Type</label>
            <div className="grid grid-cols-2 grid-rows-1 gap-3 p-0 border border-transparent">
              <div className="rounded-l-lg border border-background-light p-1 bg-background-light">
                <button
                  type="button"
                  className={`w-full py-2.5 px-3 text-xs font-medium rounded-md transition-colors h-9.5 ${
                    amountType === 'income'
                      ? 'bg-success text-background-dark shadow-sm'
                      : 'text-subheader hover:text-header'
                  } ${!amountType && warning ? 'ring-1 ring-warning/40' : ''}`}
                  onClick={() => {
                    onAmountTypeChange('income');
                    if (warning) setWarning('');
                  }}
                >
                  Income
                </button>
              </div>
              <div className="rounded-r-lg border border-background-light p-1 bg-background-light">
                <button
                  type="button"
                  className={`w-full py-2.5 px-3 text-xs font-medium rounded-md transition-colors h-9.5 ${
                    amountType === 'expense'
                      ? 'bg-warning text-background-dark shadow-sm'
                      : 'text-subheader hover:text-header'
                  } ${!amountType && warning ? 'ring-1 ring-warning/40' : ''}`}
                  onClick={() => {
                    onAmountTypeChange('expense');
                    if (warning) setWarning('');
                  }}
                >
                  Expense
                </button>
              </div>
            </div>
          </div>

          {/* Griglia importo + data */}
          <div className="grid grid-cols-2 gap-3">
            {/* Input importo con simbolo € */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-subheader">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  className={`w-full rounded-lg bg-background border px-3 pr-10 py-2.5 text-sm text-header placeholder:text-subheader/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield] leading-tight transition-all ${
                    (!amount || parseFloat(amount) <= 0) && warning ? 'border-warning ring-1 ring-warning/40' : 'border-background-light'
                  }`}
                  placeholder="42"
                  value={amount}
                  onChange={(e) => {
                    onAmountChange(e.target.value);
                    if (warning) setWarning('');
                  }}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-subheader">
                  €
                </span>
              </div>
            </div>

            {/* Campo data */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-subheader">Date</label>
              <input
                type="date"
                className={`w-full rounded-lg bg-background border px-4 py-2.5 text-sm text-header placeholder:text-subheader/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-all ${
                  !date && warning ? 'border-warning ring-1 ring-warning/40' : 'border-background-light'
                }`}
                value={date}
                onChange={(e) => {
                  onDateChange(e.target.value);
                  if (warning) setWarning('');
                }}
              />
            </div>
          </div>

          {/* Select categoria dinamica */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-subheader">Category</label>
            <select
              className={`w-full rounded-lg bg-background border px-3 py-2.5 text-sm text-header leading-tight outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 appearance-none transition-all ${
                !category && warning ? 'border-warning ring-1 ring-warning/40' : 'border-background-light'
              }`}
              value={category}
              onChange={(e) => {
                onCategoryChange(e.target.value);
                if (warning) setWarning('');
              }}
            >
              <option value="" disabled>Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Bottoni azioni */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-subheader rounded-full border border-transparent hover:border-background-light hover:bg-background-light hover:text-header transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium rounded-full bg-accent text-background-dark hover:bg-accent-dark disabled:bg-accent/50 disabled:cursor-not-allowed disabled:text-background-dark/70 transition-colors"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

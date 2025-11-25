import { Transaction } from '../types';

const STORAGE_KEY = 'royal_ledger_transactions';

export const getTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load royal archives", e);
    return [];
  }
};

export const saveTransaction = (transaction: Transaction): Transaction[] => {
  const current = getTransactions();
  const updated = [transaction, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearArchives = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
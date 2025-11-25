export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  originalInput: string;
  amount: number;
  currency: string;
  type: TransactionType;
  category: string;
  summary: string;
  date: string; // ISO String
  timestamp: number;
}

export interface AiParsingResult {
  amount: number;
  type: string; // 'INCOME' | 'EXPENSE'
  category: string;
  summary: string;
}

export enum ViewState {
  SCRIBE = 'SCRIBE', // Input
  TREASURY = 'TREASURY', // Dashboard/Reports
  ARCHIVES = 'ARCHIVES' // History
}
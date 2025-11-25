import React, { useState, useEffect } from 'react';
import { BookLayout } from './components/BookLayout';
import { ScribeInput } from './components/ScribeInput';
import { TreasuryDashboard } from './components/TreasuryDashboard';
import { Archives } from './components/Archives';
import { ViewState, Transaction } from './types';
import { getTransactions } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.SCRIBE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load initial data
    setTransactions(getTransactions());
  }, []);

  const handleTransactionAdded = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.SCRIBE:
        return (
            <div className="flex flex-col h-full">
                <ScribeInput onTransactionAdded={handleTransactionAdded} />
                
                {/* Recent Items - Minimalist Pastoral */}
                {transactions.length > 0 && (
                  <div className="mt-6 border-t border-[#F2EFE9] pt-6">
                      <h3 className="text-[10px] font-bold text-[#BCAAA4] uppercase tracking-[0.15em] mb-4 text-center font-sans">Recent</h3>
                      <div className="space-y-2">
                          {transactions.slice(0, 3).map(t => (
                              <div key={t.id} className="px-4 py-3 bg-[#FAF9F6]/50 rounded-lg flex justify-between items-center text-sm border border-transparent hover:border-[#E6E2D8] transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D7CCC8]"></div>
                                    <span className="text-[#6D4C41] font-serif truncate max-w-[150px]">{t.summary}</span>
                                  </div>
                                  <span className={`font-sans ${t.type === 'INCOME' ? 'text-[#A3B18A]' : 'text-[#8D6E63]'}`}>
                                      {t.type === 'INCOME' ? '+' : '-'}{t.amount}
                                  </span>
                              </div>
                          ))}
                      </div>
                  </div>
                )}
            </div>
        );
      case ViewState.TREASURY:
        return <TreasuryDashboard transactions={transactions} />;
      case ViewState.ARCHIVES:
        return <Archives transactions={transactions} />;
      default:
        return null;
    }
  };

  return (
    <BookLayout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}
    </BookLayout>
  );
};

export default App;
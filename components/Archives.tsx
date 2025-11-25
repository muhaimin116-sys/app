import React from 'react';
import { Transaction, TransactionType } from '../types';

interface ArchivesProps {
  transactions: Transaction[];
}

export const Archives: React.FC<ArchivesProps> = ({ transactions }) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-xl font-serif text-[#5D4037] tracking-wide">时光胶囊</h2>
        <div className="w-12 h-0.5 bg-[#DDBEA9] mx-auto mt-2 rounded-full opacity-60"></div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
           <span className="text-4xl mb-4 grayscale opacity-30">🍂</span>
           <p className="text-sm text-[#A1887F] font-serif">暂无往事</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((t) => (
            <div 
              key={t.id} 
              className="group relative flex items-center justify-between p-5 bg-white border border-[#F2EFE9] rounded-xl hover:border-[#DDBEA9] transition-all duration-300 shadow-sm hover:shadow-[0_4px_15px_-5px_rgba(221,190,169,0.3)]"
            >
              <div className="flex items-center gap-5">
                {/* Category Circle - Soft Colors */}
                <div className="w-10 h-10 rounded-full bg-[#F5F5F4] group-hover:bg-[#E6E2D8] flex items-center justify-center text-xs font-serif text-[#8D6E63] shrink-0 transition-colors">
                   {t.category.substring(0, 1)}
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[#5D4037] font-medium text-base font-serif tracking-wide">{t.summary}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#A1887F] font-sans">
                      {new Date(t.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#D7CCC8]"></span>
                    <span className="text-[10px] text-[#A1887F] font-sans">{t.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-lg font-serif ${
                  t.type === TransactionType.INCOME ? 'text-[#A3B18A]' : 'text-[#6D4C41]'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'} {t.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
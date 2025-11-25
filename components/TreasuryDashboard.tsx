import React, { useEffect, useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { generateRoyalReport } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TreasuryDashboardProps {
  transactions: Transaction[];
}

// Soft, healing nature colors
const COLORS = ['#A3B18A', '#DAD7CD', '#B5838D', '#E5989B', '#6B705C', '#CB997E', '#DDBEA9'];

export const TreasuryDashboard: React.FC<TreasuryDashboardProps> = ({ transactions }) => {
  const [report, setReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState(false);

  // Calculate totals
  const financials = useMemo(() => {
    let income = 0;
    let expense = 0;
    const categoryMap: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        income += t.amount;
      } else {
        expense += t.amount;
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });

    const expenseData = Object.keys(categoryMap)
      .map(key => ({ name: key, value: categoryMap[key] }))
      .sort((a, b) => b.value - a.value);

    return { income, expense, balance: income - expense, expenseData };
  }, [transactions]);

  useEffect(() => {
    const fetchAdvice = async () => {
      if (transactions.length === 0) return;
      setLoadingReport(true);
      try {
        const text = await generateRoyalReport(transactions.slice(0, 50), "本月");
        setReport(text);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingReport(false);
      }
    };

    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]); 

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* 1. TOP: Charts & Legend */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-[#E6E2D8] p-6 shadow-sm">
         <div className="text-center mb-6">
            <h2 className="text-lg font-serif font-medium text-[#5D4037] tracking-wide">支出分布</h2>
            <div className="w-8 h-0.5 bg-[#A3B18A] mx-auto mt-2 rounded-full opacity-50"></div>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {/* Chart Circle */}
            <div className="w-48 h-48 relative shrink-0">
               {financials.expenseData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={financials.expenseData}
                       cx="50%"
                       cy="50%"
                       innerRadius={50}
                       outerRadius={80}
                       paddingAngle={3}
                       dataKey="value"
                       stroke="none"
                     >
                       {financials.expenseData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                        formatter={(value: number) => `¥${value}`}
                        contentStyle={{ backgroundColor: '#FDFCF8', borderRadius: '12px', border: '1px solid #E6E2D8', fontFamily: 'serif' }} 
                        itemStyle={{ color: '#5D4037' }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="w-full h-full rounded-full border-4 border-dashed border-[#E6E2D8] flex items-center justify-center text-[#A1887F] text-xs">
                    暂无数据
                 </div>
               )}
            </div>

            {/* Detailed Legend */}
            <div className="flex-1 w-full sm:w-auto max-h-48 overflow-y-auto pr-2 custom-scrollbar">
               {financials.expenseData.length > 0 ? (
                 <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {financials.expenseData.map((entry, index) => (
                      <div key={index} className="flex items-center text-sm text-[#6D4C41]">
                        <span className="w-2.5 h-2.5 rounded-full mr-2 shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span className="truncate flex-1 font-serif">{entry.name}</span>
                        <span className="font-sans text-[#8D6E63] text-xs">{(entry.value / financials.expense * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                 </div>
               ) : (
                 <p className="text-center text-[#A1887F] text-sm font-serif italic">期待您的第一笔记录...</p>
               )}
            </div>
         </div>
      </div>

      {/* 2. MIDDLE: Income, Expense, Balance */}
      <div className="grid grid-cols-3 gap-3">
        {/* Expenditure */}
        <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E6E2D8] text-center flex flex-col justify-center h-24">
           <span className="text-[10px] text-[#8D6E63] uppercase tracking-wider mb-1 font-sans">支出</span>
           <span className="text-lg font-serif text-[#5D4037]">- {financials.expense.toLocaleString()}</span>
        </div>
        
        {/* Income */}
        <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E6E2D8] text-center flex flex-col justify-center h-24">
           <span className="text-[10px] text-[#A3B18A] uppercase tracking-wider mb-1 font-sans">收入</span>
           <span className="text-lg font-serif text-[#5D4037]">+ {financials.income.toLocaleString()}</span>
        </div>
        
        {/* Balance */}
        <div className="bg-[#E6E2D8]/30 p-4 rounded-2xl border border-[#D7CCC8] text-center flex flex-col justify-center h-24">
           <span className="text-[10px] text-[#6B705C] uppercase tracking-wider mb-1 font-sans">结余</span>
           <span className={`text-xl font-serif font-medium ${financials.balance >= 0 ? 'text-[#3E2723]' : 'text-[#BC4749]'}`}>
             {financials.balance.toLocaleString()}
           </span>
        </div>
      </div>

      {/* 3. BOTTOM: AI Analysis Report */}
      <div className="relative">
        <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#FDFCF8] border border-[#E6E2D8] rounded-full p-2 shadow-sm z-10">
          <span className="text-xl">🍃</span>
        </div>
        
        <div className="bg-white rounded-xl border border-[#E6E2D8] p-6 pt-8 shadow-[0_4px_20px_-4px_rgba(163,177,138,0.15)] relative overflow-hidden">
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DAD7CD] via-[#A3B18A] to-[#DAD7CD] opacity-50"></div>
          
          <h3 className="text-sm font-serif font-bold text-[#6D4C41] mb-4 uppercase tracking-widest text-center">
            财务手札
          </h3>
          
          <div className="font-serif text-[#5D4037] leading-relaxed text-sm">
            {loadingReport ? (
              <div className="animate-pulse space-y-3 py-4">
                 <div className="h-2 bg-[#F2EFE9] rounded w-3/4 mx-auto"></div>
                 <div className="h-2 bg-[#F2EFE9] rounded w-5/6 mx-auto"></div>
                 <div className="h-2 bg-[#F2EFE9] rounded w-2/3 mx-auto"></div>
              </div>
            ) : (
               <div className="prose prose-sm prose-stone prose-p:my-2 prose-strong:text-[#4A3B32] prose-strong:font-medium text-justify">
                 {report ? (
                   report.split('\n').map((line, i) => (
                     <p key={i} className="mb-2 last:mb-0">
                       {line.replace(/\*\*/g, '')}
                     </p>
                   ))
                 ) : (
                   <p className="text-[#A1887F] italic text-center">在恬静的时光里，记录下生活的点滴，AI 将为您整理思绪。</p>
                 )}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
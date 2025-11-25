import React, { useState } from 'react';
import { parseLedgerEntry } from '../services/geminiService';
import { saveTransaction } from '../services/storageService';
import { Transaction, TransactionType } from '../types';

const simpleId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

interface ScribeInputProps {
  onTransactionAdded: (t: Transaction) => void;
}

export const ScribeInput: React.FC<ScribeInputProps> = ({ onTransactionAdded }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await parseLedgerEntry(input);
      
      const newTransaction: Transaction = {
        id: simpleId(),
        originalInput: input,
        amount: result.amount,
        type: result.type as TransactionType,
        category: result.category,
        summary: result.summary,
        date: new Date().toISOString(),
        currency: 'CNY',
        timestamp: Date.now()
      };

      saveTransaction(newTransaction);
      onTransactionAdded(newTransaction);
      setInput('');
    } catch (err) {
      setError("似乎没能听清，请您再说一次...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-4">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-serif text-[#5D4037] mb-2 tracking-wide">今日随笔</h2>
        <p className="text-[#A1887F] font-light text-xs tracking-widest">
           Today's Moments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full relative group max-w-lg mx-auto">
        <div className="relative overflow-hidden rounded-xl border border-[#E6E2D8] bg-[#FAF9F6] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_25px_-8px_rgba(163,177,138,0.2)]">
          {/* Paper lines decoration */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]"
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2rem' }}>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="记下一笔开支，或是一段心情..."
            className="w-full h-48 p-8 text-lg text-[#5D4037] placeholder:text-[#D7CCC8] resize-none focus:outline-none bg-transparent font-serif leading-loose"
            disabled={loading}
          />
          
          <div className="absolute bottom-4 right-4 flex items-center gap-3 z-10">
             <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`
                h-10 px-6 rounded-full text-xs font-bold tracking-widest transition-all font-sans
                ${loading 
                  ? 'bg-[#E6E2D8] text-white cursor-not-allowed' 
                  : 'bg-[#A3B18A] text-white hover:bg-[#8D9E76] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
              `}
            >
              {loading ? "整理中..." : "记录"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-xs text-[#BC4749] text-center font-serif italic">
             {error}
          </div>
        )}
      </form>
    </div>
  );
};
import React, { ReactNode } from 'react';
import { ViewState } from '../types';

interface BookLayoutProps {
  children: ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const BookLayout: React.FC<BookLayoutProps> = ({ children, currentView, onChangeView }) => {
  const navItems = [
    { id: ViewState.SCRIBE, label: '记录', icon: '✎' },
    { id: ViewState.TREASURY, label: '分析', icon: '☘' },
    { id: ViewState.ARCHIVES, label: '归档', icon: '🕰' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-serif text-[#5D4037] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A3B18A] opacity-[0.03] rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#DDBEA9] opacity-[0.03] rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <header className="pt-10 pb-4 text-center z-10">
         <div className="inline-block border-b border-[#E6E2D8] pb-4 px-8">
           <h1 className="text-2xl font-bold text-[#4A3B32] tracking-widest font-serif">
                简 记
           </h1>
           <p className="text-[10px] text-[#A1887F] uppercase tracking-[0.2em] mt-1 font-sans">
             Daily Ledger
           </p>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
         <div className="max-w-xl mx-auto px-6 h-full flex flex-col">
          {children}
         </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md border border-[#E6E2D8] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-50">
        <div className="flex justify-around items-center px-6 py-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`
                relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300
                ${currentView === item.id 
                  ? 'text-[#6B705C] bg-[#F2EFE9]' 
                  : 'text-[#BCAAA4] hover:text-[#8D6E63]'}
              `}
            >
              <span className={`text-xl mb-0.5 ${currentView === item.id ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                {item.icon}
              </span>
              {currentView === item.id && (
                 <span className="absolute -bottom-2 w-1 h-1 bg-[#A3B18A] rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
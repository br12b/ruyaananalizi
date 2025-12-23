
import React, { useState, useCallback } from 'react';
import { Send, Brain } from 'lucide-react';

interface DreamInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const DreamInput: React.FC<DreamInputProps> = ({ onAnalyze, isLoading }) => {
  const [dream, setDream] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim() && !isLoading) {
      onAnalyze(dream);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  }, [dream, isLoading, handleSubmit]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative z-10">
      <form onSubmit={handleSubmit} className="relative group perspective-1000">
        
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-mystic-800 via-mystic-gold/10 to-mystic-800 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative bg-mystic-900/80 backdrop-blur-xl border border-mystic-700/50 rounded-2xl shadow-2xl p-2 transition-all duration-300 group-hover:border-mystic-gold/30">
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Rüyanızı buraya yazın... Hangi semboller, renkler veya hisler ön plandaydı?"
            className="w-full h-40 bg-transparent text-mystic-100 placeholder-mystic-500/50 p-4 text-lg font-light focus:outline-none resize-none scrollbar-hide selection:bg-mystic-gold/20 leading-relaxed"
            spellCheck={false}
          />
          
          <div className="flex justify-between items-center px-4 pb-2 pt-2 border-t border-mystic-800/50">
             <div className="text-xs text-mystic-500 font-serif tracking-wider flex items-center gap-1 opacity-70">
               <Brain className="w-3 h-3" />
               ANALİZ ASİSTANI HAZIR
             </div>
             
             <button
              type="submit"
              disabled={!dream.trim() || isLoading}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-full font-serif text-xs tracking-widest transition-all duration-300
                ${!dream.trim() || isLoading 
                  ? 'bg-mystic-800 text-mystic-600 cursor-not-allowed' 
                  : 'bg-mystic-gold/90 text-mystic-950 hover:bg-mystic-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95'
                }
              `}
            >
              {isLoading ? (
                <span className="animate-pulse">İŞLENİYOR...</span>
              ) : (
                <>
                  ANALİZ ET <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DreamInput;

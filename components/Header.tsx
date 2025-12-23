import React from 'react';
import { Moon, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 relative z-10 animate-fadeIn w-full">
      
      {/* Live Status Indicator - Top Right */}
      <div className="absolute top-0 right-0 md:top-4 md:right-4 flex items-center gap-2 px-4 py-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] uppercase tracking-widest text-mystic-500 font-serif opacity-70">Sistem Aktif</span>
      </div>

      <div className="relative group cursor-default mt-6 md:mt-0">
        {/* Glow behind logo */}
        <div className="absolute -inset-6 bg-mystic-gold/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-gradient-to-br from-mystic-900 to-black p-5 rounded-full border border-mystic-700/50 shadow-2xl ring-1 ring-mystic-gold/20 group-hover:ring-mystic-gold/50 transition-all duration-500">
          <Moon className="w-12 h-12 text-mystic-goldLight drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-mystic-gold animate-pulse-slow" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-mystic-goldLight via-mystic-gold to-amber-700 drop-shadow-sm tracking-widest uppercase">
          Rüya Analisti
        </h1>
        <div className="flex items-center justify-center gap-3 opacity-50">
           <div className="h-px w-12 bg-gradient-to-r from-transparent to-mystic-gold"></div>
           <div className="w-1.5 h-1.5 rotate-45 border border-mystic-gold bg-mystic-900"></div>
           <div className="h-px w-12 bg-gradient-to-l from-transparent to-mystic-gold"></div>
        </div>
      </div>
      
      <p className="text-mystic-100/70 text-sm md:text-base max-w-lg font-sans font-light tracking-wide leading-relaxed">
        Bilinçaltının derinliklerindeki sembolleri <span className="text-mystic-gold font-serif">Jung</span> ve <span className="text-mystic-gold font-serif">Freud</span> bilgeliğiyle aydınlatın.
      </p>
    </header>
  );
};

export default Header;
import React, { useMemo } from 'react';
import { AnalysisStatus } from '../types';
import { AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';

interface AnalysisDisplayProps {
  status: AnalysisStatus;
  analysis: string;
  imageUrl: string | null;
  isImageLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ status, analysis, imageUrl, isImageLoading, error, onReset }) => {
  if (status === AnalysisStatus.IDLE) return null;

  if (status === AnalysisStatus.ERROR) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-red-950/40 border border-red-900/50 backdrop-blur-md rounded-xl text-red-200 flex items-center gap-4 animate-fadeIn">
        <AlertCircle className="w-8 h-8 flex-shrink-0 text-red-500" />
        <div>
          <h3 className="font-serif font-bold text-lg text-red-400">Ruhsal Bağlantı Hatası</h3>
          <p className="text-sm opacity-80">{error || "Rüya evreniyle bağlantı kurulurken bir sorun oluştu. Lütfen tekrar deneyin."}</p>
          <button 
            onClick={onReset}
            className="mt-3 text-xs uppercase tracking-widest underline hover:text-white transition-colors"
          >
            Bağlantıyı Yenile
          </button>
        </div>
      </div>
    );
  }

  // Parse and Clean content (REMOVE **)
  const { title, contentSections } = useMemo(() => {
    if (!analysis) return { title: '', contentSections: [] };

    // Global cleanup for bold markdown
    const cleanAnalysis = analysis.replace(/\*\*/g, '');

    const lines = cleanAnalysis.split('\n');
    let titleText = '';
    let remainingText = cleanAnalysis;

    // Check if the first line is a H1 header (# Title)
    if (lines[0].startsWith('# ')) {
      titleText = lines[0].replace('# ', '').trim();
      remainingText = lines.slice(1).join('\n').trim();
    }

    // Split by sections (### Header)
    const sections = remainingText.split(/(?=###)/g).map(section => {
        const cleanSection = section.replace('###', '').trim();
        if (!cleanSection) return null;
        
        const [heading, ...bodyParts] = cleanSection.split('\n');
        return {
            title: heading.trim(),
            body: bodyParts.join('\n').trim()
        };
    }).filter(Boolean);

    return { title: titleText, contentSections: sections };
  }, [analysis]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 pb-24">
      <div className="relative">
        
        {/* Main Card Container */}
        <div className="bg-mystic-900/80 backdrop-blur-xl border border-mystic-gold/20 rounded-xl p-2 shadow-2xl relative overflow-hidden transition-all duration-700">
          
          {/* Inner Decorative Border */}
          <div className="border border-mystic-700/30 rounded-lg p-6 md:p-10 relative flex flex-col items-center">
            
            {/* Ornate Corners */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-mystic-gold/40 rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-mystic-gold/40 rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b border-l border-mystic-gold/40 rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b border-r border-mystic-gold/40 rounded-br-lg"></div>

            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-mystic-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-mystic-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            {/* --- DREAM VISUALIZATION (TAROT CARD STYLE) --- */}
            <div className="w-full max-w-[320px] aspect-[2/3] mb-10 relative rounded-lg overflow-hidden border border-mystic-700 bg-black/40 shadow-[0_0_30px_rgba(0,0,0,0.5)] group hover:border-mystic-gold/40 transition-colors duration-700">
              {imageUrl ? (
                <>
                  <img 
                    src={imageUrl} 
                    alt="Rüya Kartı" 
                    className="w-full h-full object-cover animate-fadeIn opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  {/* Image Vintage Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-mystic-900 via-transparent to-mystic-900/20 mix-blend-multiply pointer-events-none"></div>
                  <div className="absolute inset-0 border-[6px] border-mystic-900/30 pointer-events-none"></div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                   {isImageLoading ? (
                     <>
                       <div className="absolute inset-0 bg-gradient-to-t from-mystic-900 via-mystic-800/50 to-transparent opacity-50 animate-pulse-slow"></div>
                       <Sparkles className="w-10 h-10 text-mystic-gold/70 animate-spin-slow mb-4" />
                       <p className="text-xs text-mystic-300 font-serif tracking-[0.2em] animate-pulse">
                         VİZYON OLUŞTURULUYOR
                       </p>
                     </>
                   ) : (
                      <div className="opacity-10 flex flex-col items-center">
                        <ImageIcon className="w-16 h-16 mb-4" />
                        <span className="font-serif text-sm tracking-widest">TAROT</span>
                      </div>
                   )}
                </div>
              )}
            </div>

            {/* Loading Text State */}
            {status === AnalysisStatus.ANALYZING && !analysis && (
               <div className="flex flex-col items-center justify-center pb-10 space-y-4">
                 <p className="text-mystic-200 animate-pulse text-sm font-serif tracking-[0.3em]">SEMBOLLER OKUNUYOR...</p>
               </div>
            )}

            {/* --- ANALYSIS TEXT --- */}
            <div className={`w-full max-w-2xl transition-all duration-1000 ${status === AnalysisStatus.ANALYZING && !analysis ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              
              {/* Title Section */}
              {title && (
                <div className="text-center mb-12 animate-fadeIn">
                    <span className="text-[10px] text-mystic-gold/60 uppercase tracking-[0.4em] mb-2 block font-serif">Rüya Kartı</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-mystic-goldLight to-amber-600 drop-shadow-sm px-2 leading-tight py-1">
                        {title}
                    </h2>
                    <div className="flex justify-center items-center mt-6 gap-3 opacity-60">
                         <div className="h-px w-16 bg-gradient-to-r from-transparent to-mystic-gold"></div>
                         <div className="w-2 h-2 rotate-45 border border-mystic-gold bg-black"></div>
                         <div className="h-px w-16 bg-gradient-to-l from-transparent to-mystic-gold"></div>
                    </div>
                </div>
              )}

              {/* Text Content */}
              <div className="space-y-10 px-1 md:px-4">
                  {contentSections.map((section: any, index: number) => (
                      <div key={index} className="animate-fadeIn group" style={{ animationDelay: `${index * 150 + 300}ms` }}>
                          <h3 className="text-lg font-serif text-mystic-gold/80 mb-4 uppercase tracking-wider text-center flex items-center justify-center gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-mystic-gold/40 group-hover:bg-mystic-gold transition-colors"></span>
                              {section.title}
                              <span className="w-1.5 h-1.5 rounded-full bg-mystic-gold/40 group-hover:bg-mystic-gold transition-colors"></span>
                          </h3>
                          <div className="text-gray-300 leading-relaxed font-sans text-justify text-sm md:text-base font-light tracking-wide border-l-2 border-mystic-800/50 pl-6 hover:border-mystic-gold/20 transition-colors duration-500">
                              {section.body}
                          </div>
                      </div>
                  ))}
              </div>

            </div>
            
            {/* Reset Button */}
            {status === AnalysisStatus.COMPLETED && (
               <div className="mt-16 pt-10 w-full border-t border-mystic-800/50 flex justify-center animate-fadeIn">
                 <button 
                  onClick={onReset}
                  className="px-10 py-3 rounded-full border border-mystic-700 bg-mystic-900 hover:bg-mystic-800 hover:border-mystic-gold/40 text-mystic-200 hover:text-mystic-goldLight transition-all duration-300 text-xs font-serif tracking-[0.2em] flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.3)] group"
                 >
                   <span className="group-hover:-translate-x-1 transition-transform duration-300 text-lg">←</span>
                   BAŞKA BİR RÜYA
                 </button>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
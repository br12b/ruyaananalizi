import React, { useState, useRef } from 'react';
import Header from './components/Header';
import DreamInput from './components/DreamInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import { AnalysisStatus } from './types';
import { analyzeDreamStream, generateDreamImage } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysis, setAnalysis] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const analysisAccumulator = useRef<string>('');

  const handleAnalyze = async (dreamText: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    setAnalysis('');
    setImageUrl(null);
    setIsImageLoading(true);
    setError(null);
    analysisAccumulator.current = '';

    // We run image generation and text analysis in parallel
    const textPromise = analyzeDreamStream(dreamText, (chunk) => {
      analysisAccumulator.current += chunk;
      setAnalysis(analysisAccumulator.current);
    });

    const imagePromise = generateDreamImage(dreamText)
      .then((url) => {
        setImageUrl(url);
        setIsImageLoading(false);
      })
      .catch((err) => {
        console.error("Image generation failed", err);
        setIsImageLoading(false);
        // We don't fail the whole process if image fails, just show text
      });

    try {
      await textPromise;
      setStatus(AnalysisStatus.COMPLETED);
      // Ensure image promise is handled (mostly for loading state cleanup if it's still running)
      await imagePromise; 
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
      setStatus(AnalysisStatus.ERROR);
      setIsImageLoading(false);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setAnalysis('');
    setImageUrl(null);
    setIsImageLoading(false);
    setError(null);
    analysisAccumulator.current = '';
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mystic-800 via-mystic-900 to-[#050511] text-white selection:bg-mystic-gold/30 selection:text-white overflow-x-hidden flex flex-col">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl flex-grow flex flex-col relative z-10">
        <Header />
        
        <main className="mt-8 md:mt-12 flex-grow transition-all duration-500 ease-in-out">
          {status === AnalysisStatus.IDLE && (
            <div className="animate-fadeInUp">
              <DreamInput onAnalyze={handleAnalyze} isLoading={false} />
              
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-mystic-300 opacity-60">
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-mystic-gold/20 transition-colors">
                  <h3 className="font-serif text-lg text-mystic-100 mb-2">Görselleştirme</h3>
                  <p className="text-xs leading-relaxed">Rüyanızın mistik bir illüstrasyonu yapay zeka tarafından çizilir.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-mystic-gold/20 transition-colors">
                  <h3 className="font-serif text-lg text-mystic-100 mb-2">Derin Analiz</h3>
                  <p className="text-xs leading-relaxed">Psikanalitik teoriler ışığında sembollerin gizli anlamları çözülür.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-mystic-gold/20 transition-colors">
                  <h3 className="font-serif text-lg text-mystic-100 mb-2">Çözüm Yolu</h3>
                  <p className="text-xs leading-relaxed">İçsel yolculuğunuz için somut tavsiyeler ve rehberlik.</p>
                </div>
              </div>
            </div>
          )}

          {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.COMPLETED || status === AnalysisStatus.ERROR) && (
             <AnalysisDisplay 
                status={status} 
                analysis={analysis}
                imageUrl={imageUrl}
                isImageLoading={isImageLoading}
                error={error} 
                onReset={handleReset} 
             />
          )}
        </main>
        
        <footer className="mt-20 py-6 text-center text-mystic-700 text-[10px] uppercase tracking-widest border-t border-white/5">
          <p>© {new Date().getFullYear()} Mistik Rüya Analisti</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
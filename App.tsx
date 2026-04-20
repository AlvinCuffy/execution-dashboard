
import React, { useState } from 'react';
import { BrandData, ReportState, AppStep } from './types';
import InputPanel from './components/InputPanel';
import ReportPanel from './components/ReportPanel';
import InjectionChamber from './components/InjectionChamber';
import { generateStrategyThemes, extractDNA } from './geminiService';
import OutreachChecklist from './components/OutreachChecklist';

const DEFAULT_DATA: BrandData = {
  businessName: '',
  colors: {
    primary: '#0f172a',
    secondary: '#b45309',
    accent: '#0369a1'
  },
  yearEstablished: 2024,
  tagline: '',
  overview: '',
  images: []
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('injection');
  const [brandData, setBrandData] = useState<BrandData>(DEFAULT_DATA);
  const [isInitializing, setIsInitializing] = useState(false);
  const [reportState, setReportState] = useState<ReportState>({
    themes: ["Modernization", "Efficiency", "Legacy", "Scale"],
    isGenerating: false,
    error: null
  });

  const handleInitializeDNA = async (rawText: string) => {
    setIsInitializing(true);
    try {
      const extracted = await extractDNA(rawText);
      setBrandData(prev => ({
        ...prev,
        ...extracted,
        colors: { ...prev.colors, ...extracted.colors }
      }));
      setStep('refinement');
    } catch (err) {
      console.error(err);
      setStep('refinement');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleUpdateData = (newData: BrandData) => {
    setBrandData(newData);
  };

  const handleGenerateReport = async () => {
    setReportState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const themes = await generateStrategyThemes(brandData.overview);
      setReportState({
        themes,
        isGenerating: false,
        error: null
      });
    } catch (err) {
      setReportState(prev => ({
        ...prev,
        isGenerating: false,
        error: "Failed to generate AI themes."
      }));
    }
  };

  if (step === 'dashboard') {
    return (
      <OutreachChecklist
        onBack={() => setStep(brandData.businessName ? 'refinement' : 'injection')}
      />
    );
  }

  if (step === 'injection') {
    return (
      <>
        <button
          onClick={() => setStep('dashboard')}
          className="fixed top-4 right-4 z-50 text-[10px] font-bold text-slate-400 hover:text-blue-400 uppercase tracking-widest border border-slate-700 hover:border-blue-500/40 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded transition-all"
        >
          Dashboard
        </button>
        <InjectionChamber onInitialize={handleInitializeDNA} isProcessing={isInitializing} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 animate-in fade-in duration-700">
      {/* Left Panel: Inputs */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white border-r border-slate-200 overflow-y-auto h-screen sticky top-0 no-print">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">POMELLI <span className="text-blue-600 font-light italic">DNA</span></h1>
            <p className="text-sm text-slate-500">Refinement Lab</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep('dashboard')}
              className="text-[10px] font-bold text-slate-400 hover:text-blue-500 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setStep('injection')}
              className="text-[10px] font-bold text-slate-400 hover:text-blue-500 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded"
            >
              Re-Inject
            </button>
          </div>
        </header>
        
        <InputPanel 
          data={brandData} 
          onUpdate={handleUpdateData} 
          onGenerate={handleGenerateReport}
          isGenerating={reportState.isGenerating}
        />
        
        <footer className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">© 2025 Pomelli Strategic Intelligence</p>
        </footer>
      </div>

      {/* Right Panel: Report Output */}
      <div className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-12 overflow-y-auto print-area">
        <ReportPanel 
          data={brandData} 
          themes={reportState.themes} 
          isGenerating={reportState.isGenerating}
        />
      </div>
    </div>
  );
};

export default App;

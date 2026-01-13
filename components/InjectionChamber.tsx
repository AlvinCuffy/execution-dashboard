
import React, { useState } from 'react';

interface InjectionChamberProps {
  onInitialize: (rawText: string) => void;
  isProcessing: boolean;
}

const InjectionChamber: React.FC<InjectionChamberProps> = ({ onInitialize, isProcessing }) => {
  const [text, setText] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-[0.2em] uppercase">
            Pomelli <span className="text-blue-500 font-light italic">DNA</span> Chamber
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Awaiting Forensic Raw Data Injection
          </p>
        </header>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw client JSON, meeting transcripts, website copy, or brand manifestos here..."
              className="w-full h-80 bg-transparent border-none text-blue-100 font-mono text-sm focus:ring-0 resize-none placeholder-slate-700"
            />
          </div>
        </div>

        <button
          onClick={() => onInitialize(text)}
          disabled={isProcessing || !text.trim()}
          className="w-full py-5 bg-blue-600 text-white font-black tracking-[0.3em] rounded-xl hover:bg-blue-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              DECRYPTING IDENTITY...
            </>
          ) : (
            "INITIALIZE DNA SEQUENCE"
          )}
        </button>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase">Input Type</p>
            <p className="text-xs text-slate-400">JSON / Text / Bio</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase">Parsing Engine</p>
            <p className="text-xs text-slate-400">Gemini 3 Pro</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase">Extraction Mode</p>
            <p className="text-xs text-slate-400">Automated Forensic</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjectionChamber;

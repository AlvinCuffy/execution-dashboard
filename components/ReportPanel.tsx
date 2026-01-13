
import React from 'react';
import { BrandData } from '../types';
import AuthorityBadge from './AuthorityBadge';
import StrategyGrid from './StrategyGrid';

interface ReportPanelProps {
  data: BrandData;
  themes: string[];
  isGenerating: boolean;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ data, themes, isGenerating }) => {
  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - data.yearEstablished;
  const isAuthority = yearsActive >= 10;

  const handlePrint = () => {
    window.print();
  };

  const handleActivatePilot = () => {
    alert("Syncing Strategy to GoHighLevel API Hub...");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 relative">
      {/* Top Actions */}
      <div className="flex justify-end gap-3 no-print sticky top-4 z-50">
        <button 
          onClick={handlePrint}
          className="px-6 py-2 bg-white text-slate-900 border border-slate-200 rounded-full font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          GENERATE CLIENT PDF
        </button>
        <button 
          onClick={handleActivatePilot}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          ACTIVATE PILOT
        </button>
      </div>

      {/* Hero Section */}
      <header className="relative py-16 px-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div 
          className="absolute top-0 left-0 w-2 h-full" 
          style={{ backgroundColor: data.colors.primary }} 
        />
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-bold text-slate-900 uppercase tracking-tighter" style={{ color: data.colors.primary }}>
              {data.businessName || "UNNAMED ENTITY"}
            </h2>
            <div className="flex items-center gap-3">
               <span className="text-sm font-medium tracking-[0.2em] text-slate-400 uppercase">Forensic Audit // 2025</span>
               {isAuthority && <AuthorityBadge years={yearsActive} colors={data.colors} />}
            </div>
          </div>
          <div className="text-right">
             <div className="text-xs font-mono text-slate-300">REF: POMELLI-X-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-100 italic serif text-2xl text-slate-600 leading-relaxed max-w-2xl">
           "{data.tagline || "Identity awaiting calibration."}"
        </div>
      </header>

      {/* Visual DNA Panel */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Chromatic DNA</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 group">
              <div className="w-24 h-24 rounded-2xl shadow-inner transition-transform group-hover:scale-105" style={{ backgroundColor: data.colors.primary }} />
              <div>
                <p className="text-sm font-bold text-slate-900">Primary Authority</p>
                <p className="text-xs font-mono text-slate-400 uppercase">{data.colors.primary}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-xl shadow-inner transition-transform group-hover:scale-105" style={{ backgroundColor: data.colors.secondary }} />
              <div>
                <p className="text-sm font-bold text-slate-900">Secondary Texture</p>
                <p className="text-xs font-mono text-slate-400 uppercase">{data.colors.secondary}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg shadow-inner transition-transform group-hover:scale-105" style={{ backgroundColor: data.colors.accent }} />
              <div>
                <p className="text-sm font-bold text-slate-900">Conversion Accent</p>
                <p className="text-xs font-mono text-slate-400 uppercase">{data.colors.accent}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Strategic Footprint</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
                {data.overview || "Provide business overview to generate strategic footprint analysis."}
            </p>
            <div className="mt-6 flex gap-2">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">Legacy Status</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">Market Segment A</span>
            </div>
        </div>
      </section>

      {/* Market Exclusion Risk */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-red-100" />
            <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">Market Exclusion Risk Analysis</h3>
            <div className="h-[1px] flex-1 bg-red-100" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <p className="text-xs font-bold text-red-800 uppercase mb-2">The 24-Hour Loss</p>
            <p className="text-2xl font-black text-red-600 mb-1">76%</p>
            <p className="text-xs text-red-700 leading-tight">of local searchers visit a business within 24 hours. Your lag is their gain.</p>
          </div>
          
          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
            <p className="text-xs font-bold text-red-800 uppercase mb-2">The Trust Gap</p>
            <p className="text-2xl font-black text-red-600 mb-1">71%</p>
            <p className="text-xs text-red-700 leading-tight">of customers reject businesses with under 3 stars or poor digital visibility.</p>
          </div>

          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h2v8zm-4 0H8v-4h2v4zm8 0h-2v-6h2v6z"/></svg>
            </div>
            <p className="text-xs font-bold text-red-800 uppercase mb-2">The B2B Vetting</p>
            <p className="text-2xl font-black text-red-600 mb-1">89%</p>
            <p className="text-xs text-red-700 leading-tight">of B2B buyers use social media to verify vendors before signing. Invisible = Rejected.</p>
          </div>
        </div>

        <div className="p-6 bg-slate-900 rounded-2xl flex items-center justify-between">
            <div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest">Forensic Verdict</p>
                <p className="text-white text-lg font-medium">Despite your history, you are invisible to this modern volume.</p>
            </div>
            <div className="px-4 py-2 bg-red-600 text-white font-black text-xs rounded animate-pulse">CRITICAL FAILURE</div>
        </div>
      </section>

      {/* Competitive Knife */}
      <section className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Competitive Alignment</h3>
         <table className="w-full text-left">
            <thead>
                <tr className="border-b border-slate-100">
                    <th className="pb-4 text-xs font-bold text-slate-400 uppercase">Analysis Metric</th>
                    <th className="pb-4 text-xs font-bold text-slate-900 uppercase">{data.businessName} (Legacy Giant)</th>
                    <th className="pb-4 text-xs font-bold text-slate-500 uppercase italic">Local Competitors (Digital Noise)</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                <tr>
                    <td className="py-4 text-sm font-bold text-slate-600">Experience depth</td>
                    <td className="py-4 text-sm text-green-600 font-bold">Unrivaled Excellence</td>
                    <td className="py-4 text-sm text-slate-400 italic">Superficial / New</td>
                </tr>
                <tr>
                    <td className="py-4 text-sm font-bold text-slate-600">Digital Visibility</td>
                    <td className="py-4 text-sm text-red-500 font-bold">Near Zero</td>
                    <td className="py-4 text-sm text-slate-900 font-bold">Dominant Presence</td>
                </tr>
                <tr>
                    <td className="py-4 text-sm font-bold text-slate-600">Conversion Velocity</td>
                    <td className="py-4 text-sm text-amber-500 font-bold">Manual / Slow</td>
                    <td className="py-4 text-sm text-slate-900 font-bold">Automated / Instant</td>
                </tr>
                <tr>
                    <td className="py-4 text-sm font-bold text-slate-600">Brand Trust Score</td>
                    <td className="py-4 text-sm text-green-600 font-bold">High (Legacy)</td>
                    <td className="py-4 text-sm text-amber-500 font-bold">Varies / Low</td>
                </tr>
            </tbody>
         </table>
      </section>

      {/* Strategy Grid */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h3 className="text-3xl font-bold text-slate-900">30-Day Recovery Strategy</h3>
                <p className="text-slate-500 text-sm">Automated pipeline injection based on AI overview analysis.</p>
            </div>
            <div className="flex gap-4">
                {themes.map((theme, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-100 rounded-lg text-[10px] font-black text-slate-800 uppercase border border-slate-200">
                        WK {i+1}: {theme}
                    </div>
                ))}
            </div>
        </div>

        <StrategyGrid images={data.images} themes={themes} colors={data.colors} />
      </section>
    </div>
  );
};

export default ReportPanel;

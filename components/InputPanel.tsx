
import React from 'react';
import { BrandData } from '../types';

interface InputPanelProps {
  data: BrandData;
  onUpdate: (data: BrandData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ data, onUpdate, onGenerate, isGenerating }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('color_')) {
      const colorKey = name.split('_')[1];
      onUpdate({
        ...data,
        colors: {
          ...data.colors,
          [colorKey]: value
        }
      });
    } else {
      onUpdate({
        ...data,
        [name]: name === 'yearEstablished' ? parseInt(value) || 0 : value
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Explicitly cast 'file' to 'Blob' to resolve TypeScript inference error with URL.createObjectURL from FileList
      const newImages = Array.from(files).map(file => URL.createObjectURL(file as Blob));
      onUpdate({
        ...data,
        images: [...data.images, ...newImages].slice(0, 12) // Limit to 12
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Business Name</label>
        <input 
          type="text" 
          name="businessName"
          value={data.businessName}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Primary</label>
          <input 
            type="color" 
            name="color_primary"
            value={data.colors.primary}
            onChange={handleChange}
            className="w-full h-10 rounded-md cursor-pointer border-0 p-0 overflow-hidden"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Secondary</label>
          <input 
            type="color" 
            name="color_secondary"
            value={data.colors.secondary}
            onChange={handleChange}
            className="w-full h-10 rounded-md cursor-pointer border-0 p-0 overflow-hidden"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Accent</label>
          <input 
            type="color" 
            name="color_accent"
            value={data.colors.accent}
            onChange={handleChange}
            className="w-full h-10 rounded-md cursor-pointer border-0 p-0 overflow-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Year Est.</label>
          <input 
            type="number" 
            name="yearEstablished"
            value={data.yearEstablished}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Tagline</label>
        <input 
          type="text" 
          name="tagline"
          value={data.tagline}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Overview</label>
        <textarea 
          name="overview"
          rows={4}
          value={data.overview}
          onChange={handleChange}
          placeholder="Paste raw business DNA here..."
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none text-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Moodboard Assets</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-lg hover:border-blue-400 transition-colors">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-10 w-10 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-slate-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload images</span>
                <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
          </div>
        </div>
        {data.images.length > 0 && (
          <p className="mt-2 text-xs text-green-600 font-medium">{data.images.length} assets uploaded.</p>
        )}
      </div>

      <button 
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ANALYZING DNA...
          </>
        ) : (
          "GENERATE REPORT"
        )}
      </button>
    </div>
  );
};

export default InputPanel;

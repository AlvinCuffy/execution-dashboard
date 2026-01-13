
import React from 'react';
import { BrandColors } from '../types';

interface StrategyGridProps {
  images: string[];
  themes: string[];
  colors: BrandColors;
}

const StrategyGrid: React.FC<StrategyGridProps> = ({ images, themes, colors }) => {
  // Pad images to 12 if fewer exist
  const displayImages = [...images];
  while (displayImages.length < 12) {
    displayImages.push(`https://picsum.photos/seed/${displayImages.length + Math.random()}/400/400`);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {displayImages.map((img, i) => {
        // Distribute themes as captions across the grid
        const themeIndex = Math.floor(i / 3) % themes.length;
        const currentTheme = themes[themeIndex];
        
        return (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
            <img 
              src={img} 
              alt={`Asset ${i}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-[10px] font-bold text-white uppercase tracking-tighter opacity-70">Week {themeIndex + 1}</p>
                <p className="text-xs font-black text-white uppercase">{currentTheme}</p>
            </div>
            {/* Visual indicator of the week theme via a color tab */}
            <div 
              className="absolute top-0 right-0 w-8 h-1" 
              style={{ backgroundColor: i % 2 === 0 ? colors.primary : colors.accent }} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default StrategyGrid;

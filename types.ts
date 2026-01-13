
export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface BrandData {
  businessName: string;
  colors: BrandColors;
  yearEstablished: number;
  tagline: string;
  overview: string;
  images: string[]; 
}

export type AppStep = 'injection' | 'refinement';

export interface ReportState {
  themes: string[];
  isGenerating: boolean;
  error: string | null;
}

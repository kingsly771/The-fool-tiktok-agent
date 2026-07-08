export interface GrowthScores {
  growthScore: number;
  brandingScore: number;
  contentQualityScore: number;
  consistencyScore: number;
  seoScore: number;
  retentionScore: number;
  viralPotentialScore: number;
}

export interface AccountAnalysis extends GrowthScores {
  id?: string;
  tiktokUsername: string;
  bioReview: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  createdAt?: string;
}

export interface VideoIdea {
  title: string;
  hook: string;
  script: string;
  cta: string;
  length: string;
  targetAudience: string;
  editingTips: string[];
  keywords: string[];
  hashtags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedPerformance: 'Low' | 'Medium' | 'High' | 'Viral Potential';
}

export interface GrowthReport {
  executiveSummary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  growthScore: number;
  actionPlan: { step: number; title: string; description: string }[];
}

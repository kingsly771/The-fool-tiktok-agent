import { z } from 'zod';

export const analyzeAccountSchema = z.object({
  input: z
    .string()
    .min(2, 'Enter a TikTok username or profile URL')
    .max(200)
    .transform((val) => val.trim())
});

export type AnalyzeAccountInput = z.infer<typeof analyzeAccountSchema>;

export const generateIdeasSchema = z.object({
  niche: z.string().min(2, 'Tell us your niche or topic').max(120),
  count: z.number().int().min(1).max(30).default(30),
  tone: z.enum(['Educational', 'Entertaining', 'Inspirational', 'Comedic', 'Storytelling']).default('Entertaining')
});

export type GenerateIdeasInput = z.infer<typeof generateIdeasSchema>;

export const growthScoresSchema = z.object({
  growthScore: z.number().min(0).max(100),
  brandingScore: z.number().min(0).max(100),
  contentQualityScore: z.number().min(0).max(100),
  consistencyScore: z.number().min(0).max(100),
  seoScore: z.number().min(0).max(100),
  retentionScore: z.number().min(0).max(100),
  viralPotentialScore: z.number().min(0).max(100)
});

export const accountAnalysisSchema = growthScoresSchema.extend({
  tiktokUsername: z.string(),
  bioReview: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
  recommendations: z.array(z.string())
});

export const videoIdeaSchema = z.object({
  title: z.string(),
  hook: z.string(),
  script: z.string(),
  cta: z.string(),
  length: z.string(),
  targetAudience: z.string(),
  editingTips: z.array(z.string()),
  keywords: z.array(z.string()),
  hashtags: z.array(z.string()),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  expectedPerformance: z.enum(['Low', 'Medium', 'High', 'Viral Potential'])
});

export const videoIdeasResponseSchema = z.object({
  ideas: z.array(videoIdeaSchema)
});

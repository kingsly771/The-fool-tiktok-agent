import Groq from 'groq-sdk';
import {
  accountAnalysisSchema,
  videoIdeasResponseSchema,
  type GenerateIdeasInput
} from './validations';
import type { AccountAnalysis, GrowthReport, VideoIdea } from '@/types';

/**
 * Server-only Groq client. Import this file ONLY from API routes / server
 * actions. GROQ_API_KEY must never be sent to the client.
 */
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set. Add it to your environment variables.');
  }
  return new Groq({ apiKey });
}

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT_ANALYSIS = `You are FOOL, a world-class TikTok growth strategist who has personally
advised creators from 0 to 10M+ followers. You analyze TikTok accounts with the rigor of a data
analyst and the instincts of a viral content producer.

You will be given a TikTok username or profile URL. Since you cannot browse the live profile,
reason from the username/handle, any bio or niche signals in the input, and general best-practice
patterns for that kind of account to produce a REALISTIC, USEFUL, actionable analysis. Be specific,
not generic. Never say "insufficient data" — always produce your best professional assessment and
clearly-labeled assumptions where needed.

Respond with ONLY valid JSON (no markdown fences, no preamble) matching exactly this shape:

{
  "tiktokUsername": string,
  "growthScore": number (0-100),
  "brandingScore": number (0-100),
  "contentQualityScore": number (0-100),
  "consistencyScore": number (0-100),
  "seoScore": number (0-100),
  "retentionScore": number (0-100),
  "viralPotentialScore": number (0-100),
  "bioReview": string (2-4 sentences),
  "strengths": string[] (3-5 items),
  "weaknesses": string[] (3-5 items),
  "opportunities": string[] (3-5 items),
  "threats": string[] (2-4 items),
  "recommendations": string[] (5-8 items, specific and actionable)
}`;

const SYSTEM_PROMPT_IDEAS = `You are FOOL, a TikTok content strategist who generates scroll-stopping,
algorithm-friendly video concepts. Every idea must be genuinely specific to the creator's niche —
never generic filler.

Respond with ONLY valid JSON (no markdown fences, no preamble) matching exactly this shape:

{
  "ideas": [
    {
      "title": string,
      "hook": string (first 1-2 lines spoken/shown in the first 2 seconds),
      "script": string (short beat-by-beat outline, 3-6 sentences),
      "cta": string,
      "length": string (e.g. "15-30s"),
      "targetAudience": string,
      "editingTips": string[] (2-4 items),
      "keywords": string[] (3-6 items),
      "hashtags": string[] (5-8 items, include the # symbol),
      "difficulty": "Easy" | "Medium" | "Hard",
      "expectedPerformance": "Low" | "Medium" | "High" | "Viral Potential"
    }
  ]
}`;

const SYSTEM_PROMPT_REPORT = `You are FOOL, producing a professional growth report for a TikTok
creator that could be handed to a client or investor. Be sharp, structured, and specific.

Respond with ONLY valid JSON (no markdown fences, no preamble) matching exactly this shape:

{
  "executiveSummary": string (3-5 sentences),
  "swot": {
    "strengths": string[],
    "weaknesses": string[],
    "opportunities": string[],
    "threats": string[]
  },
  "growthScore": number (0-100),
  "actionPlan": [
    { "step": number, "title": string, "description": string }
  ] (6-10 steps, ordered)
}`;

function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

async function callGroqJSON(system: string, user: string): Promise<unknown> {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.8,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ]
  });

  const raw = completion.choices[0]?.message?.content ?? '';
  const cleaned = stripCodeFences(raw);

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned malformed JSON. Please try again.');
  }
}

export async function analyzeAccount(usernameOrUrl: string): Promise<AccountAnalysis> {
  const userPrompt = `Analyze this TikTok account: ${usernameOrUrl}

Infer the likely niche from the handle. Produce a full professional growth analysis.`;

  const json = await callGroqJSON(SYSTEM_PROMPT_ANALYSIS, userPrompt);
  const parsed = accountAnalysisSchema.parse(json);
  return parsed;
}

export async function generateVideoIdeas(input: GenerateIdeasInput): Promise<VideoIdea[]> {
  const userPrompt = `Niche/topic: ${input.niche}
Desired tone: ${input.tone}
Generate exactly ${input.count} distinct, high-quality video ideas. No two ideas should feel similar.`;

  const json = await callGroqJSON(SYSTEM_PROMPT_IDEAS, userPrompt);
  const parsed = videoIdeasResponseSchema.parse(json);
  return parsed.ideas;
}

export async function generateGrowthReport(analysis: AccountAnalysis): Promise<GrowthReport> {
  const userPrompt = `Build a professional growth report based on this existing account analysis:

${JSON.stringify(analysis, null, 2)}`;

  const json = await callGroqJSON(SYSTEM_PROMPT_REPORT, userPrompt);
  return json as GrowthReport;
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { analyzeAccountSchema } from '@/lib/validations';
import { analyzeAccount } from '@/lib/groq';
import { getSupabaseServerClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = analyzeAccountSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  try {
    const analysis = await analyzeAccount(parsed.data.input);

    // Persist to Supabase, scoped to the Clerk user via profiles table.
    try {
      const supabase = getSupabaseServerClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', userId)
        .maybeSingle();

      if (profile?.id) {
        await supabase.from('analyses').insert({
          user_id: profile.id,
          tiktok_username: analysis.tiktokUsername,
          growth_score: analysis.growthScore,
          branding_score: analysis.brandingScore,
          content_quality_score: analysis.contentQualityScore,
          consistency_score: analysis.consistencyScore,
          seo_score: analysis.seoScore,
          retention_score: analysis.retentionScore,
          viral_potential_score: analysis.viralPotentialScore,
          bio_review: analysis.bioReview,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          opportunities: analysis.opportunities,
          threats: analysis.threats,
          recommendations: analysis.recommendations,
          raw_ai_response: analysis
        });
      }
    } catch (dbError) {
      // Don't fail the request if persistence fails — still return the analysis.
      console.error('Failed to persist analysis:', dbError);
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

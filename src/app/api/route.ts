import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateIdeasSchema } from '@/lib/validations';
import { generateVideoIdeas } from '@/lib/groq';
import { getSupabaseServerClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 45;

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = generateIdeasSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  try {
    const ideas = await generateVideoIdeas(parsed.data);

    try {
      const supabase = getSupabaseServerClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', userId)
        .maybeSingle();

      if (profile?.id) {
        await supabase.from('content_ideas').insert({
          user_id: profile.id,
          niche: parsed.data.niche,
          ideas
        });
      }
    } catch (dbError) {
      console.error('Failed to persist ideas:', dbError);
    }

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Idea generation error:', error);
    const message = error instanceof Error ? error.message : 'Idea generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

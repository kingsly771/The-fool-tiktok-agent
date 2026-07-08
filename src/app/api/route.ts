import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { accountAnalysisSchema } from '@/lib/validations';
import { generateGrowthReport } from '@/lib/groq';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = accountAnalysisSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'A valid account analysis is required to build a report' },
      { status: 400 }
    );
  }

  try {
    const report = await generateGrowthReport(parsed.data);
    return NextResponse.json({ report });
  } catch (error) {
    console.error('Report generation error:', error);
    const message = error instanceof Error ? error.message : 'Report generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

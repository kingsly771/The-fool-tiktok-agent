'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { VideoIdea } from '@/types';
import { ChevronDown, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const DIFFICULTY_TONE: Record<VideoIdea['difficulty'], string> = {
  Easy: 'text-emerald-500 border-emerald-500/30',
  Medium: 'text-amber-500 border-amber-500/30',
  Hard: 'text-red-500 border-red-500/30'
};

const PERFORMANCE_TONE: Record<VideoIdea['expectedPerformance'], string> = {
  Low: 'text-muted-foreground',
  Medium: 'text-blue-500',
  High: 'text-emerald-500',
  'Viral Potential': 'text-fuchsia-500'
};

export function IdeaCard({ idea, index }: { idea: VideoIdea; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="flex flex-col animate-fade-in">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-snug">
            <span className="mr-1.5 text-muted-foreground">#{index}</span>
            {idea.title}
          </CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={DIFFICULTY_TONE[idea.difficulty]}>{idea.difficulty}</Badge>
          <span className={cn('text-xs font-medium', PERFORMANCE_TONE[idea.expectedPerformance])}>
            {idea.expectedPerformance}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-sm italic text-muted-foreground">"{idea.hook}"</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {idea.length}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {idea.targetAudience}
          </span>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-auto flex items-center gap-1 text-xs font-medium text-primary"
        >
          {expanded ? 'Hide details' : 'Show script & tips'}
          <ChevronDown className={cn('h-3 w-3 transition-transform', expanded && 'rotate-180')} />
        </button>

        {expanded && (
          <div className="space-y-3 border-t border-border pt-3 text-sm">
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">Script</p>
              <p className="text-sm">{idea.script}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">CTA</p>
              <p className="text-sm">{idea.cta}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">Editing Tips</p>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {idea.editingTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-1">
              {idea.hashtags.map((tag, i) => (
                <span key={i} className="text-xs text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

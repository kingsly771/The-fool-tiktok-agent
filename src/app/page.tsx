import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,hsl(var(--primary)/0.25),transparent_60%)]" />
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" /> Powered by Groq
      </span>
      <h1 className="max-w-3xl text-balance text-5xl font-bold tracking-tight sm:text-6xl">
        Grow your TikTok with an AI that actually gets the algorithm.
      </h1>
      <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground">
        FOOL analyzes your account, scores your growth potential, and generates viral-ready
        content — in seconds.
      </p>
      <div className="mt-10 flex items-center gap-3">
        <Link href="/dashboard">
          <Button size="lg">
            <Zap className="h-4 w-4" /> Get Started Free
          </Button>
        </Link>
        <Link href="/sign-in">
          <Button size="lg" variant="outline">
            Sign In
          </Button>
        </Link>
      </div>
      <div className="mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: TrendingUp, title: 'Growth Score', desc: 'Full account audit in one click' },
          { icon: Sparkles, title: '30 Viral Ideas', desc: 'Scripts, hooks, hashtags, CTAs' },
          { icon: Zap, title: 'Instant Reports', desc: 'SWOT + action plan, exportable' }
        ].map((f) => (
          <div key={f.title} className="rounded-lg border border-border p-5 text-left">
            <f.icon className="mb-3 h-5 w-5 text-primary" />
            <p className="font-medium">{f.title}</p>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

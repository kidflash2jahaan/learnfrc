"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Circle, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setLessonComplete, toggleBookmark } from "@/app/actions/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = ["#2f5fff", "#22d3ee", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function Confetti({ trigger }: { trigger: number }) {
  const reduce = useReducedMotion();
  const [pieces, setPieces] = React.useState<
    { id: string; x: number; y: number; r: number; c: string }[]
  >([]);

  React.useEffect(() => {
    if (trigger === 0 || reduce) return;
    const ps = Array.from({ length: 20 }, (_, i) => ({
      id: `${trigger}-${i}`,
      x: (Math.random() - 0.5) * 240,
      y: -(Math.random() * 170 + 50),
      r: Math.random() * 360,
      c: COLORS[i % COLORS.length],
    }));
    setPieces(ps);
    const t = setTimeout(() => setPieces([]), 950);
    return () => clearTimeout(t);
  }, [trigger, reduce]);

  return (
    <div className="pointer-events-none absolute left-8 top-1/2 z-20">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.r }}
          transition={{ duration: 0.95, ease: "easeOut" }}
          className="absolute h-2 w-2 rounded-[2px]"
          style={{ background: p.c }}
        />
      ))}
    </div>
  );
}

export function LessonActions({
  lessonId,
  deptSlug,
  lessonPath,
  authed,
  initialCompleted,
  initialBookmarked,
}: {
  lessonId: string;
  deptSlug: string;
  lessonPath: string;
  authed: boolean;
  initialCompleted: boolean;
  initialBookmarked: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = React.useState(initialCompleted);
  const [bookmarked, setBookmarked] = React.useState(initialBookmarked);
  const [pending, startTransition] = React.useTransition();
  const [burst, setBurst] = React.useState(0);

  const requireAuth = (verb: string) => {
    toast(`Sign in to ${verb}`, {
      action: {
        label: "Sign in",
        onClick: () =>
          router.push(`/login?next=${encodeURIComponent(lessonPath)}`),
      },
    });
  };

  const onComplete = () => {
    if (!authed) return requireAuth("track your progress");
    const next = !completed;
    setCompleted(next);
    if (next) setBurst((b) => b + 1);
    startTransition(async () => {
      const r = await setLessonComplete(lessonId, deptSlug, next);
      if (r?.error) {
        setCompleted(!next);
        toast.error(r.error);
      } else {
        if (next) toast.success("Lesson complete!  +10 XP");
        router.refresh();
      }
    });
  };

  const onBookmark = () => {
    if (!authed) return requireAuth("save lessons");
    const next = !bookmarked;
    setBookmarked(next);
    startTransition(async () => {
      const r = await toggleBookmark(lessonId, next);
      if (r?.error) {
        setBookmarked(!next);
        toast.error(r.error);
      } else {
        toast(next ? "Saved to bookmarks" : "Removed from bookmarks");
        router.refresh();
      }
    });
  };

  return (
    <div className="relative flex flex-wrap items-center gap-3">
      <Confetti trigger={burst} />
      <Button
        onClick={onComplete}
        disabled={pending}
        variant={completed ? "secondary" : "brand"}
        size="lg"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : completed ? (
          <Check className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
        {completed ? "Completed" : "Mark complete"}
      </Button>
      <button
        onClick={onBookmark}
        disabled={pending}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-xl border transition-colors cursor-pointer",
          bookmarked
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        {bookmarked ? (
          <BookmarkCheck className="h-5 w-5" />
        ) : (
          <Bookmark className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

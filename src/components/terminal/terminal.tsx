"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { runTerminal, type TermLine, type TermTone } from "@/lib/terminal";

const TONE: Record<TermTone, string> = {
  out: "text-foreground/90",
  err: "text-destructive",
  ok: "text-primary",
  muted: "text-muted-foreground",
  accent: "text-accent",
  cmd: "text-foreground",
};

const BANNER: TermLine[] = [
  { text: "LearnFRC terminal — type `help` to get around. Try `ls`, `cd guides`, `rank`, `start`.", tone: "muted" },
];

export function Terminal() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [lines, setLines] = React.useState<TermLine[]>(BANNER);
  const [input, setInput] = React.useState("");
  const [authed, setAuthed] = React.useState(false);
  const histRef = React.useRef<string[]>([]);
  const histIdx = React.useRef(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);

  // Lazy auth check (for whoami / analyze) the first time the terminal opens.
  React.useEffect(() => {
    if (!open) return;
    let active = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => active && setAuthed(!!d?.authed))
      .catch(() => {});
    setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      active = false;
    };
  }, [open]);

  // Open via the `open-terminal` event (optionally auto-running a command) or the backtick key.
  React.useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const cmd = (e as CustomEvent).detail?.cmd as string | undefined;
      if (cmd) setTimeout(() => run(cmd), 60);
    };
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "`" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("open-terminal", onOpen as EventListener);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-terminal", onOpen as EventListener);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const run = React.useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      const echo: TermLine = { text: "~/learnfrc $ " + raw, tone: "cmd" };
      if (cmd) {
        histRef.current = [cmd, ...histRef.current.filter((h) => h !== cmd)].slice(0, 50);
      }
      histIdx.current = -1;

      const res = runTerminal(raw, { path: window.location.pathname, authed });

      if (res.clear) {
        setLines(BANNER);
        return;
      }
      setLines((prev) => [...prev, echo, ...res.lines]);

      if (res.close) {
        setTimeout(() => setOpen(false), 120);
      }
      if (res.search != null) {
        setTimeout(() => {
          setOpen(false);
          window.dispatchEvent(new CustomEvent("open-search", { detail: { query: res.search } }));
        }, 140);
      }
      if (res.newsletter) {
        setTimeout(() => {
          setOpen(false);
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }, 180);
      }
      if (res.navigate) {
        setTimeout(() => {
          setOpen(false);
          if (res.navigate === "__back__") router.back();
          else router.push(res.navigate!);
        }, 260);
      }
    },
    [authed, router]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(input);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = histRef.current;
      if (h.length) {
        histIdx.current = Math.min(histIdx.current + 1, h.length - 1);
        setInput(h[histIdx.current] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      histIdx.current = Math.max(histIdx.current - 1, -1);
      setInput(histIdx.current === -1 ? "" : histRef.current[histIdx.current] ?? "");
    }
  };

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open terminal"
          className="group fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-xl border border-primary/40 bg-card/80 px-3 py-2 font-mono text-xs text-primary shadow-[var(--glow-primary)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_0_24px_-4px_var(--primary)] sm:inline-flex"
        >
          <TerminalSquare className="h-4 w-4" />
          <span className="hidden sm:inline">terminal</span>
          <kbd className="hidden rounded border border-primary/30 bg-primary/10 px-1 text-[10px] sm:inline">`</kbd>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="neon-border flex h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-card/95 backdrop-blur-xl sm:h-[64vh] sm:rounded-2xl"
              role="dialog"
              aria-label="LearnFRC terminal"
            >
              {/* titlebar */}
              <div className="terminal-titlebar flex items-center gap-2 px-3.5 py-2.5">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,.6)]" />
                </span>
                <span className="ml-1 font-mono text-xs text-muted-foreground">learnfrc — terminal</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close terminal"
                  className="ml-auto rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* output */}
              <div
                ref={bodyRef}
                className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed"
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((l, i) => (
                  <div key={i} className={cn("whitespace-pre-wrap break-words", TONE[l.tone ?? "out"])}>
                    {l.text || " "}
                  </div>
                ))}
                {/* input row */}
                <form onSubmit={onSubmit} className="mt-1 flex items-center gap-2">
                  <span className="shrink-0 text-primary">~/learnfrc $</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    aria-label="Terminal input"
                    className="flex-1 bg-transparent text-foreground caret-primary outline-none"
                  />
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

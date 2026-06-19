import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("text-[0.97rem]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          h1: ({ ...p }) => (
            <h2 className="mt-9 mb-3 text-2xl font-bold tracking-tight" {...p} />
          ),
          h2: ({ ...p }) => (
            <h2
              className="mt-9 mb-3 scroll-mt-24 text-xl font-bold tracking-tight"
              {...p}
            />
          ),
          h3: ({ ...p }) => (
            <h3 className="mt-7 mb-2 text-lg font-semibold tracking-tight" {...p} />
          ),
          h4: ({ ...p }) => (
            <h4 className="mt-5 mb-2 font-semibold" {...p} />
          ),
          p: ({ ...p }) => (
            <p className="my-4 leading-7 text-foreground/85" {...p} />
          ),
          a: ({ ...p }) => (
            <a
              className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
              target="_blank"
              rel="noopener noreferrer"
              {...p}
            />
          ),
          ul: ({ ...p }) => (
            <ul className="my-4 list-disc space-y-2 pl-6 text-foreground/85 marker:text-primary/60" {...p} />
          ),
          ol: ({ ...p }) => (
            <ol className="my-4 list-decimal space-y-2 pl-6 text-foreground/85 marker:text-muted-foreground" {...p} />
          ),
          li: ({ ...p }) => <li className="leading-7" {...p} />,
          strong: ({ ...p }) => (
            <strong className="font-semibold text-foreground" {...p} />
          ),
          blockquote: ({ ...p }) => (
            <blockquote
              className="my-5 rounded-r-lg border-l-2 border-primary bg-muted/50 py-2 pl-4 pr-3 italic text-muted-foreground"
              {...p}
            />
          ),
          hr: () => <hr className="my-8 border-border" />,
          code: ({ className, children, ...rest }) => {
            const isBlock = /language-/.test(className || "");
            if (isBlock) {
              return (
                <code className={cn("hljs font-mono text-[0.85rem]", className)} {...rest}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.82em] text-accent"
                {...rest}
              >
                {children}
              </code>
            );
          },
          pre: ({ ...p }) => (
            <pre
              className="my-5 overflow-x-auto rounded-xl border border-border bg-[#070b14] p-4 leading-6 text-foreground/90 shadow-[var(--shadow-sm)]"
              {...p}
            />
          ),
          table: ({ ...p }) => (
            <div className="my-5 overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-sm" {...p} />
            </div>
          ),
          th: ({ ...p }) => (
            <th
              className="border-b border-border bg-muted/60 px-3 py-2 text-left font-semibold"
              {...p}
            />
          ),
          td: ({ ...p }) => (
            <td className="border-b border-border px-3 py-2 align-top text-foreground/85" {...p} />
          ),
          img: ({ ...p }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="my-5 rounded-xl border border-border" alt="" {...p} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

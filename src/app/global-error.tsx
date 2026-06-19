"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#060912",
          color: "#e8edf7",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ color: "#94a2bf", marginTop: 8 }}>
          A critical error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 24,
            padding: "12px 22px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            color: "white",
            background: "linear-gradient(110deg,#2f5fff,#22d3ee)",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

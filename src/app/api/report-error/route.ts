import { NextResponse } from "next/server";
import { sendEmail, errorEmailHtml } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Lightweight built-in error monitor: client/server error boundaries POST here,
// and we email the site admin. Rate-limited so one bad bug can't flood the inbox.
export async function POST(req: Request) {
  const admin = (process.env.ADMIN_EMAILS || "").split(",")[0]?.trim();
  if (!admin) return new NextResponse(null, { status: 204 });

  // Cap to a few alerts/hour per IP, and globally, to avoid email storms.
  const ok =
    (await rateLimit("error-report", 6, 3600)) &&
    (await rateLimit("error-report-global", 30, 3600, "all"));
  if (!ok) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const message = String(body.message || "Unknown error").slice(0, 500);
  const stack = body.stack ? String(body.stack).slice(0, 6000) : undefined;
  const url = body.url ? String(body.url).slice(0, 300) : undefined;
  const kind = body.kind ? String(body.kind).slice(0, 40) : "Client error";
  const digest = body.digest ? String(body.digest).slice(0, 80) : undefined;
  const userAgent = req.headers.get("user-agent")?.slice(0, 200) || undefined;

  await sendEmail({
    to: admin,
    subject: `⚠️ LearnFRC ${kind}: ${message.slice(0, 80)}`,
    html: errorEmailHtml({ message, stack, url, kind, digest, userAgent }),
  });

  return new NextResponse(null, { status: 204 });
}

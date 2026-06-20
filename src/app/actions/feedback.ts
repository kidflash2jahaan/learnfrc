"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail, feedbackEmailHtml } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export type FeedbackState = { error?: string; success?: boolean } | undefined;

export async function sendFeedback(
  _prev: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
  const message = String(formData.get("message") || "").trim();
  const page = String(formData.get("page") || "");
  if (message.length < 5) return { error: "Please add a little more detail." };
  if (message.length > 4000) return { error: "That message is a bit too long." };

  if (!(await rateLimit("feedback", 8, 3600)))
    return { error: "Too many messages — please try again later." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = (process.env.ADMIN_EMAILS || "").split(",")[0]?.trim();
  if (!admin) return { success: true }; // nowhere to send, but don't error the user

  const res = await sendEmail({
    to: admin,
    subject: "LearnFRC — feedback / topic request",
    html: feedbackEmailHtml({ message, fromEmail: user?.email, page }),
    replyTo: user?.email || undefined,
  });
  if (!res.ok) return { error: "Couldn't send right now — please try again." };
  return { success: true };
}

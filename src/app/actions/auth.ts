"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendEmail, welcomeEmailHtml } from "@/lib/email";

export type AuthState = { error?: string } | undefined;

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  if (!email || !password)
    return { error: "Please enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const usernameRaw = String(formData.get("username") || "").trim();
  const teamNumber = String(formData.get("team_number") || "").trim();
  const next = String(formData.get("next") || "/dashboard");

  if (!email || !password)
    return { error: "Email and password are required." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  const username = usernameRaw
    ? usernameRaw.toLowerCase().replace(/[^a-z0-9_]/g, "")
    : "";
  if (usernameRaw && username.length < 3)
    return { error: "Username must be at least 3 characters (letters, numbers, _)." };

  const supabase = await createClient();

  // Friendly pre-check for username collision (avoids cryptic DB error)
  if (username) {
    const { data: taken } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    if (taken) return { error: "That username is already taken." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
        username: username || null,
        team_number: teamNumber || null,
      },
    },
  });
  if (error) return { error: error.message };

  // Best-effort welcome email (won't block signup)
  void sendEmail({
    to: email,
    subject: "Welcome to LearnFRC 🤖",
    html: welcomeEmailHtml(fullName),
  });

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

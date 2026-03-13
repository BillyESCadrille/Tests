import { supabase } from "./supabase";

const ALLOWED_DOMAIN = "partoo.co";

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        // hd = hosted domain — restricts the Google picker to @partoo.co accounts
        hd: ALLOWED_DOMAIN,
      },
    },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Returns true only if the session email ends with @partoo.co */
export function isAllowedEmail(email: string | undefined): boolean {
  return !!email?.endsWith(`@${ALLOWED_DOMAIN}`);
}

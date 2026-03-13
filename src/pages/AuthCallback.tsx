import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { isAllowedEmail } from "@/lib/auth";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email;
      if (!isAllowedEmail(email)) {
        // Wrong domain — sign out and redirect to login with error
        supabase.auth.signOut().then(() => navigate("/login?error=domain"));
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
      Connexion en cours…
    </div>
  );
}

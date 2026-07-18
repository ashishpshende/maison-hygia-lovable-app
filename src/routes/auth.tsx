import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo.svg.asset.json";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : "",
  }),
  head: () => ({
    meta: [
      { title: "Sign In — Maison Hygia" },
      { name: "description", content: "Sign in to the Maison Hygia admin." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const redirectTarget = next || "/admin";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace(redirectTarget);
    });
  }, [redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${redirectTarget}` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
        window.location.replace(redirectTarget);
        return;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md border border-border bg-background p-10 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <img src={logoAsset.url} alt="Maison Hygia" className="h-14 w-auto" />
          <div className="my-5 h-px w-10 bg-gold/60" />
          <h1 className="font-serif text-2xl text-foreground">
            {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Maison Hygia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-colors hover:bg-cocoa-soft disabled:opacity-70"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? (
            <>
              Need an account?{" "}
              <button
                type="button"
                className="text-foreground underline underline-offset-4"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have one?{" "}
              <button
                type="button"
                className="text-foreground underline underline-offset-4"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </>
          )}
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import logoAsset from "@/assets/logo.svg.asset.json";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "mh_welcome_popup_dismissed";

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .max(255, { message: "Email is too long" })
  .email({ message: "Please enter a valid email address" });

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    setStatus("loading");
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.toLowerCase(), source: "welcome_popup" });

    if (dbError) {
      // Postgres unique_violation
      if (dbError.code === "23505") {
        setStatus("success");
        toast.success("You're already on the list — welcome back.");
        setTimeout(close, 1800);
        return;
      }
      console.error("Newsletter signup failed:", dbError);
      setStatus("idle");
      setError("Something went wrong. Please try again.");
      toast.error("We couldn't save your email. Please try again.");
      return;
    }

    setStatus("success");
    toast.success("You're in — check your inbox for 20% off.");
    setTimeout(close, 1800);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md overflow-hidden border border-gold/30 bg-background shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-4 top-4 text-foreground/60 transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center px-8 py-10 text-center">
          <img src={logoAsset.url} alt="Maison Hygia" className="h-16 w-auto" />
          <p className="mt-2 font-serif text-lg text-foreground">Maison Hygia</p>
          <div className="my-5 h-px w-10 bg-gold/60" />

          {status === "success" ? (
            <>
              <h2 className="font-serif text-2xl text-foreground">Welcome in.</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Your 20% off code is on its way to your inbox.
              </p>
            </>
          ) : (
            <>
              <h2
                id="welcome-popup-title"
                className="font-serif text-3xl leading-tight text-foreground"
              >
                Get 20% Off Now
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Sign up to get access to our latest updates and exclusive offers,
                plus 30% off your first order.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 w-full" noValidate>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Your email address"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "welcome-popup-error" : undefined}
                  disabled={status === "loading"}
                  maxLength={255}
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none disabled:opacity-60"
                />
                {error && (
                  <p
                    id="welcome-popup-error"
                    role="alert"
                    className="mt-2 text-left text-xs text-destructive"
                  >
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-colors hover:bg-cocoa-soft disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {status === "loading" ? "Signing up…" : "Claim My 20% Off"}
                </button>
              </form>

              <button
                type="button"
                onClick={close}
                className="mt-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              >
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

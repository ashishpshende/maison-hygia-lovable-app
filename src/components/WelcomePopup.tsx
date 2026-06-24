import { useEffect, useState } from "react";
import { X } from "lucide-react";
import logoAsset from "@/assets/logo.svg.asset.json";

const STORAGE_KEY = "mh_welcome_popup_dismissed";

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
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

          {submitted ? (
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

              <form onSubmit={handleSubmit} className="mt-6 w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-3 w-full bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-colors hover:bg-cocoa-soft"
                >
                  Claim My 20% Off
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

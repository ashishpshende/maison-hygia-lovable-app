import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .max(255, { message: "Email is too long" })
  .email({ message: "Please enter a valid email address" });

export function NewsletterInline({ source = "stay_close" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

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
      .insert({ email: parsed.data.toLowerCase(), source });

    if (dbError) {
      if (dbError.code === "23505") {
        setStatus("success");
        toast.success("You're already on the list — welcome back.");
        return;
      }
      setStatus("idle");
      setError("Something went wrong. Please try again.");
      toast.error("We couldn't save your email. Please try again.");
      return;
    }
    setStatus("success");
    setEmail("");
    toast.success("Welcome to the Maison.");
  };

  if (status === "success") {
    return (
      <p className="font-serif text-lg italic text-foreground">
        Welcome to the Maison. Look for us in your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter your email"
          disabled={status === "loading"}
          maxLength={255}
          aria-invalid={error ? true : undefined}
          className="flex-1 border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-colors hover:bg-cocoa-soft disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {status === "loading" ? "Joining…" : "Join the Maison"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}

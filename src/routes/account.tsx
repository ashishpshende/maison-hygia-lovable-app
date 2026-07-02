import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { formatCents, CART_DISCOUNT_PCT } from "@/lib/cart-context";
import logoAsset from "@/assets/logo.svg.asset.json";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your Account — Maison Hygia" },
      { name: "description", content: "Sign in to unlock your Maison Hygia discounts, view orders, and check out." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AccountPage,
});

const emailSchema = z.string().trim().email({ message: "Enter a valid email" }).max(255);
const passwordSchema = z.string().min(6, { message: "At least 6 characters" }).max(72);
const nameSchema = z.string().trim().min(1, { message: "Name is required" }).max(80);

type Order = {
  id: string;
  status: string;
  total_cents: number;
  discount_cents: number;
  created_at: string;
  items: Array<{ name: string; quantity: number }>;
};

function AccountPage() {
  const [session, setSession] = useState<null | { userId: string; email: string }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      setSession(u ? { userId: u.id, email: u.email ?? "" } : null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      const u = s?.user;
      setSession(u ? { userId: u.id, email: u.email ?? "" } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-foreground/40" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16 md:py-24">
      {session ? <SignedIn userId={session.userId} email={session.email} /> : <AuthForms />}
    </div>
  );
}

function AuthForms() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const emailR = emailSchema.safeParse(email);
    if (!emailR.success) return setErr(emailR.error.issues[0].message);
    const pwR = passwordSchema.safeParse(password);
    if (!pwR.success) return setErr(pwR.error.issues[0].message);
    if (mode === "signup") {
      const nR = nameSchema.safeParse(name);
      if (!nR.success) return setErr(nR.error.issues[0].message);
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: emailR.data,
          password: pwR.data,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { full_name: name.trim() },
          },
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from("customer_profiles").upsert({
            user_id: data.user.id,
            full_name: name.trim(),
          });
        }
        toast.success("Welcome — your discounts are unlocked.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailR.data,
          password: pwR.data,
        });
        if (error) throw error;
        toast.success("Signed in.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-border bg-background p-10 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <img src={logoAsset.url} alt="Maison Hygia" className="h-12 w-auto" />
        <div className="my-4 h-px w-10 bg-gold/60" />
        <h1 className="font-serif text-2xl text-foreground">
          {mode === "signup" ? "Join Maison Hygia" : "Welcome back"}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {mode === "signup"
            ? `Sign up — ${CART_DISCOUNT_PCT.signup + CART_DISCOUNT_PCT.firstBuyer}% off your first order`
            : "Sign in to your account"}
        </p>
      </div>

      <div className="mt-6 border border-gold/30 bg-gold/5 p-3 text-center text-xs text-foreground/80">
        {CART_DISCOUNT_PCT.signup}% signup discount + {CART_DISCOUNT_PCT.firstBuyer}% first-time buyer,
        auto-applied at checkout.
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {mode === "signup" && (
          <Field label="Full name" value={name} onChange={setName} type="text" autoComplete="name" />
        )}
        <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />

        {err && <p role="alert" className="text-xs text-destructive">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-colors hover:bg-cocoa-soft disabled:opacity-70"
        >
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        {mode === "signup" ? (
          <>Already have an account?{" "}
            <button type="button" className="text-foreground underline underline-offset-4" onClick={() => setMode("signin")}>Sign in</button>
          </>
        ) : (
          <>New here?{" "}
            <button type="button" className="text-foreground underline underline-offset-4" onClick={() => setMode("signup")}>Create an account</button>
          </>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link to="/shop" className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground">
          ← Back to shop
        </Link>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type, autoComplete,
}: { label: string; value: string; onChange: (v: string) => void; type: string; autoComplete?: string }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</label>
      <input
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}

function SignedIn({ userId, email }: { userId: string; email: string }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    supabase
      .from("orders")
      .select("id,status,total_cents,discount_cents,created_at,items")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
    supabase.rpc("has_paid_order", { _user_id: userId }).then(({ data }) => setHasPaid(!!data));
  }, [userId]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out.");
    navigate({ to: "/shop" });
  };

  return (
    <div className="space-y-8">
      <div className="border border-border bg-background p-8">
        <p className="text-[10px] uppercase tracking-[0.32em] text-gold">Signed in</p>
        <h1 className="mt-2 font-serif text-2xl text-foreground">{email}</h1>

        <div className="mt-5 grid gap-2 text-sm">
          <DiscountRow active label={`${CART_DISCOUNT_PCT.signup}% signup discount`} note="auto-applied" />
          <DiscountRow
            active={!hasPaid}
            label={`${CART_DISCOUNT_PCT.firstBuyer}% first-time buyer`}
            note={hasPaid ? "used" : "auto-applied"}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center border-b border-gold/60 pb-1 text-xs uppercase tracking-[0.28em] text-foreground hover:border-foreground"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl text-foreground">Your orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between border border-border bg-background px-4 py-3 text-sm">
                <div>
                  <p className="text-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.items?.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-base">{formatCents(o.total_cents)}</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{o.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DiscountRow({ active, label, note }: { active: boolean; label: string; note: string }) {
  return (
    <div className={`flex items-center justify-between border px-3 py-2 ${active ? "border-gold/40 bg-gold/5" : "border-border bg-muted/20"}`}>
      <span className={active ? "text-foreground" : "text-muted-foreground line-through"}>{label}</span>
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{note}</span>
    </div>
  );
}

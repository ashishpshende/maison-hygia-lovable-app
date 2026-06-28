import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Loader2, LogOut, RefreshCw, Search, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Newsletter Subscribers" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserEmail(user?.email ?? null);

    if (!user) {
      navigate({ to: "/auth" });
      return;
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    const admin = !!roleRow;
    setIsAdmin(admin);

    if (!admin) {
      setLoading(false);
      return;
    }

    const { data, error: qErr } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, source, created_at")
      .order("created_at", { ascending: false });

    if (qErr) {
      setError(qErr.message);
      toast.error("Couldn't load subscribers.");
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.email.toLowerCase().includes(q) ||
        (r.source ?? "").toLowerCase().includes(q),
    );
  }, [rows, query]);

  const exportCsv = () => {
    if (!filtered.length) {
      toast.message("Nothing to export.");
      return;
    }
    const header = ["email", "source", "created_at"];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      header.join(","),
      ...filtered.map((r) =>
        [r.email, r.source ?? "", r.created_at].map((v) => escape(String(v))).join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maison-hygia-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} ${filtered.length === 1 ? "row" : "rows"}.`);
  };

  const remove = async (id: string, email: string) => {
    if (!confirm(`Remove ${email} from the list?`)) return;
    const { error: dErr } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (dErr) {
      toast.error("Couldn't delete subscriber.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Subscriber removed.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground" />
        <h1 className="mt-4 font-serif text-2xl text-foreground">Admin access required</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You are signed in as <span className="font-medium text-foreground">{userEmail}</span> but this
          account is not an admin yet.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          To grant admin: in Cloud → SQL editor run
          <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[11px]">
            INSERT INTO public.user_roles (user_id, role) SELECT id, 'admin' FROM auth.users WHERE email = '{userEmail ?? "you@example.com"}';
          </code>
        </p>
        <button
          onClick={signOut}
          className="mt-8 inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] text-foreground hover:bg-muted"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Admin</p>
          <h1 className="mt-1 font-serif text-3xl text-foreground">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} total · signed in as {userEmail}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.22em] text-foreground hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 bg-cocoa px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary-foreground hover:bg-cocoa-soft"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.22em] text-foreground hover:bg-muted"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search email or source…"
            className="w-full border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {filtered.length} match{filtered.length === 1 ? "" : "es"}
        </span>
      </div>

      {error && (
        <div className="mt-6 border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Signed up</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No subscribers {query ? "match your search." : "yet."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{r.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.source ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(r.id, r.email)}
                      aria-label={`Remove ${r.email}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

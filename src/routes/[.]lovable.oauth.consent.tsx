import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo.svg.asset.json";

type OAuthClient = { supabase: { auth: { oauth: OAuthNamespace } } };
type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: DecisionResult | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: DecisionResult | null; error: { message: string } | null }>;
};
type AuthDetails = {
  client?: { name?: string; redirect_uri?: string } | null;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type DecisionResult = { redirect_url?: string; redirect_to?: string };

function oauth(): OAuthNamespace {
  return (supabase as unknown as OAuthClient["supabase"]).auth.oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="flex min-h-[70vh] items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="font-serif text-2xl text-foreground">Authorization error</h1>
        <p className="mt-3 text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(approve ? "approve" : "deny");
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(null);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(null);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an application";
  const scopes = (details?.scope ?? "").split(/\s+/).filter(Boolean);

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md border border-border bg-background p-10 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <img src={logoAsset.url} alt="Maison Hygia" className="h-14 w-auto" />
          <div className="my-5 h-px w-10 bg-gold/60" />
          <h1 className="font-serif text-2xl text-foreground">
            Connect {clientName} to Maison Hygia
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {clientName} will be able to call this app's tools while you are signed in.
          </p>
        </div>

        {scopes.length > 0 && (
          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Requested access</div>
            <ul className="mt-2 space-y-1 text-sm text-foreground">
              {scopes.map((s: string) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          This does not bypass Maison Hygia's permissions or data policies.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => decide(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.28em] text-primary-foreground hover:bg-cocoa-soft disabled:opacity-70"
          >
            {busy === "approve" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Approve
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => decide(false)}
            className="inline-flex flex-1 items-center justify-center gap-2 border border-border px-6 py-3 text-xs uppercase tracking-[0.28em] text-foreground hover:bg-muted disabled:opacity-70"
          >
            {busy === "deny" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Deny
          </button>
        </div>
      </div>
    </main>
  );
}

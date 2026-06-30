import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ImageIcon, Loader2, LogOut, Pencil, Plus, RefreshCw, ShieldAlert, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isStorageRef, resolveImageUrl, uploadProductImage } from "@/lib/product-image";

type Product = {
  id: string;
  slug: string;
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  notes: string;
  size: string;
  price: string;
  image_url: string;
  alt: string;
  coming_soon: boolean;
  is_published: boolean;
  sort_order: number;
};

type ProductDraft = Omit<Product, "id"> & { id?: string };

const empty: ProductDraft = {
  slug: "",
  eyebrow: "",
  name: "",
  tagline: "",
  description: "",
  notes: "",
  size: "",
  price: "",
  image_url: "",
  alt: "",
  coming_soon: false,
  is_published: true,
  sort_order: 0,
};

export const Route = createFileRoute("/_authenticated/admin-products")({
  head: () => ({
    meta: [
      { title: "Admin — Products" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProductDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    setUserEmail(user?.email ?? null);
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
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
    if (admin) {
      const { data, error: e } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (e) setError(e.message);
      else setRows((data as Product[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error: e } = await supabase.from("products").delete().eq("id", p.id);
    if (e) return toast.error("Couldn't delete product.");
    setRows((prev) => prev.filter((r) => r.id !== p.id));
    toast.success("Product deleted.");
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.slug.trim() || !editing.name.trim()) {
      toast.error("Slug and name are required.");
      return;
    }
    setSaving(true);
    const payload = {
      slug: editing.slug.trim(),
      eyebrow: editing.eyebrow,
      name: editing.name,
      tagline: editing.tagline,
      description: editing.description,
      notes: editing.notes,
      size: editing.size,
      price: editing.price,
      image_url: editing.image_url,
      alt: editing.alt,
      coming_soon: editing.coming_soon,
      is_published: editing.is_published,
      sort_order: Number(editing.sort_order) || 0,
    };
    if (editing.id) {
      const { data, error: e } = await supabase
        .from("products").update(payload).eq("id", editing.id).select().single();
      setSaving(false);
      if (e) return toast.error(e.message);
      setRows((prev) => prev.map((r) => (r.id === editing.id ? (data as Product) : r)));
      toast.success("Product updated.");
    } else {
      const { data, error: e } = await supabase
        .from("products").insert(payload).select().single();
      setSaving(false);
      if (e) return toast.error(e.message);
      setRows((prev) => [...prev, data as Product]);
      toast.success("Product added.");
    }
    setEditing(null);
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
          Signed in as <span className="font-medium text-foreground">{userEmail}</span>.
        </p>
        <button onClick={signOut} className="mt-8 inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:bg-muted">
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
      <nav className="mb-8 flex gap-1 text-[11px] uppercase tracking-[0.22em]">
        <Link to="/admin" className="border border-border bg-background px-3 py-2 text-foreground hover:bg-muted">Subscribers</Link>
        <Link to="/admin-products" activeProps={{ className: "border-gold text-foreground" }} className="border border-border bg-background px-3 py-2 text-foreground hover:bg-muted">Products</Link>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Admin</p>
          <h1 className="mt-1 font-serif text-3xl text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} total · signed in as {userEmail}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.22em] hover:bg-muted">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 bg-cocoa px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary-foreground hover:bg-cocoa-soft">
            <Plus className="h-3.5 w-3.5" /> New Product
          </button>
          <button onClick={signOut} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.22em] hover:bg-muted">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
      )}

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No products yet.</td></tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <ProductThumb value={p.image_url} />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.price}</td>
                  <td className="px-4 py-3 text-xs">
                    {!p.is_published && <span className="mr-1 border border-border px-1.5 py-0.5 text-muted-foreground">Hidden</span>}
                    {p.coming_soon && <span className="border border-gold/50 px-1.5 py-0.5 text-gold">Soon</span>}
                    {p.is_published && !p.coming_soon && <span className="text-muted-foreground">Live</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sort_order}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-3">
                      <button onClick={() => setEditing({ ...p })} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => remove(p)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductDialog
          draft={editing}
          saving={saving}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function ProductDialog({
  draft, saving, onChange, onClose, onSave,
}: {
  draft: ProductDraft;
  saving: boolean;
  onChange: (d: ProductDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const set = <K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) =>
    onChange({ ...draft, [k]: v });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 md:p-8">
      <div className="w-full max-w-2xl border border-border bg-background p-6 shadow-lg md:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="font-serif text-xl text-foreground">{draft.id ? "Edit Product" : "New Product"}</h2>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Slug *"><input value={draft.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} /></Field>
          <Field label="Name *"><input value={draft.name} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Field>
          <Field label="Eyebrow"><input value={draft.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} className={inputCls} /></Field>
          <Field label="Tagline"><input value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputCls} /></Field>
          <Field label="Price"><input value={draft.price} onChange={(e) => set("price", e.target.value)} className={inputCls} /></Field>
          <Field label="Size"><input value={draft.size} onChange={(e) => set("size", e.target.value)} className={inputCls} /></Field>
          <Field label="Notes" full><input value={draft.notes} onChange={(e) => set("notes", e.target.value)} className={inputCls} /></Field>
          <Field label="Description" full>
            <textarea value={draft.description} onChange={(e) => set("description", e.target.value)} rows={4} className={inputCls} />
          </Field>
          <Field label="Image URL" full><input value={draft.image_url} onChange={(e) => set("image_url", e.target.value)} className={inputCls} placeholder="https://… or /assets/…" /></Field>
          <Field label="Image alt text" full><input value={draft.alt} onChange={(e) => set("alt", e.target.value)} className={inputCls} /></Field>
          <Field label="Sort order">
            <input type="number" value={draft.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className={inputCls} />
          </Field>
          <div className="flex items-end gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={draft.is_published} onChange={(e) => set("is_published", e.target.checked)} />
              Published
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={draft.coming_soon} onChange={(e) => set("coming_soon", e.target.checked)} />
              Coming soon
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-2 border-t border-border pt-6">
          <button onClick={onClose} className="border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:bg-muted">Cancel</button>
          <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 bg-cocoa px-5 py-2 text-xs uppercase tracking-[0.22em] text-primary-foreground hover:bg-cocoa-soft disabled:opacity-60">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {draft.id ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "md:col-span-2" : ""}`}>
      <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

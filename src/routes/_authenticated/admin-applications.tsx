import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Application = {
  id: string;
  job_slug: string;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  work_auth: string;
  employer: string | null;
  previous_job_title: string | null;
  years_experience: string;
  responsibilities: string | null;
  school: string | null;
  degree: string | null;
  field_of_study: string | null;
  grad_year: string | null;
  resume_name: string;
  linkedin: string | null;
  portfolio: string | null;
  cover_letter: string | null;
  referral: string;
  eeo_gender: string | null;
  eeo_ethnicity: string | null;
  eeo_veteran: string | null;
  eeo_disability: string | null;
  certified: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

const STATUSES = ["new", "reviewing", "interview", "offer", "hired", "rejected"] as const;

export const Route = createFileRoute("/_authenticated/admin-applications")({
  head: () => ({
    meta: [
      { title: "Admin — Fellowship Applications" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminApplicationsPage,
});

function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<"name" | "email" | "job_title" | "status" | "created_at">(
    "created_at",
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selected, setSelected] = useState<Application | null>(null);

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
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (qErr) {
      setError(qErr.message);
      toast.error("Couldn't load applications.");
    } else {
      setRows((data ?? []) as Application[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jobs = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) => map.set(r.job_slug, r.job_title));
    return Array.from(map, ([slug, title]) => ({ slug, title }));
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (jobFilter !== "all" && r.job_slug !== jobFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.first_name.toLowerCase().includes(q) ||
        r.last_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.job_title.toLowerCase().includes(q) ||
        `${r.city} ${r.country}`.toLowerCase().includes(q)
      );
    });
  }, [rows, query, jobFilter, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: string;
      let bv: string;
      if (sortKey === "name") {
        av = `${a.first_name} ${a.last_name}`;
        bv = `${b.first_name} ${b.last_name}`;
      } else {
        av = (a[sortKey] ?? "") as string;
        bv = (b[sortKey] ?? "") as string;
      }
      const cmp =
        sortKey === "created_at"
          ? new Date(av).getTime() - new Date(bv).getTime()
          : av.localeCompare(bv, undefined, { sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sorted, currentPage, pageSize],
  );

  useEffect(() => {
    setPage(1);
  }, [query, jobFilter, statusFilter, sortKey, sortDir, pageSize]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "created_at" ? "desc" : "asc");
    }
  };

  const SortIcon = ({ k }: { k: typeof sortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const exportCsv = () => {
    if (!filtered.length) {
      toast.message("Nothing to export.");
      return;
    }
    const headers = [
      "created_at",
      "job_title",
      "first_name",
      "last_name",
      "email",
      "phone",
      "city",
      "country",
      "work_auth",
      "years_experience",
      "employer",
      "previous_job_title",
      "school",
      "degree",
      "field_of_study",
      "grad_year",
      "linkedin",
      "portfolio",
      "referral",
      "status",
    ];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [
      headers.join(","),
      ...filtered.map((r) => headers.map((h) => escape((r as any)[h])).join(",")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maison-hygia-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} row${filtered.length === 1 ? "" : "s"}.`);
  };

  const updateStatus = async (id: string, status: string) => {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    if (selected?.id === id) setSelected({ ...selected, status });
    const { error: uErr } = await supabase.from("job_applications").update({ status }).eq("id", id);
    if (uErr) {
      setRows(prev);
      toast.error("Couldn't update status.");
    } else {
      toast.success("Status updated.");
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete application from ${name}?`)) return;
    const { error: dErr } = await supabase.from("job_applications").delete().eq("id", id);
    if (dErr) {
      toast.error("Couldn't delete application.");
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success("Application removed.");
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
          You are signed in as <span className="font-medium text-foreground">{userEmail}</span> but
          this account is not an admin yet.
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
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
      <nav className="mb-8 flex flex-wrap gap-1 text-[11px] uppercase tracking-[0.22em]">
        <Link
          to="/admin"
          activeProps={{ className: "border-gold text-foreground" }}
          className="border border-border bg-background px-3 py-2 text-foreground hover:bg-muted"
        >
          Subscribers
        </Link>
        <Link
          to="/admin-products"
          activeProps={{ className: "border-gold text-foreground" }}
          className="border border-border bg-background px-3 py-2 text-foreground hover:bg-muted"
        >
          Products
        </Link>
        <Link
          to="/admin-applications"
          activeProps={{ className: "border-gold text-foreground" }}
          className="border border-border bg-background px-3 py-2 text-foreground hover:bg-muted"
        >
          Applications
        </Link>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Admin</p>
          <h1 className="mt-1 font-serif text-3xl text-foreground">Fellowship Applications</h1>
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, role, location…"
            className="w-full border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
        >
          <option value="all">All roles</option>
          {jobs.map((j) => (
            <option key={j.slug} value={j.slug}>
              {j.title}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-border bg-background px-3 py-2 text-sm capitalize focus:border-gold focus:outline-none"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
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
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">
                <button
                  onClick={() => toggleSort("name")}
                  className="inline-flex items-center gap-1.5 uppercase tracking-[0.18em] hover:text-foreground"
                >
                  Candidate <SortIcon k="name" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  onClick={() => toggleSort("email")}
                  className="inline-flex items-center gap-1.5 uppercase tracking-[0.18em] hover:text-foreground"
                >
                  Email <SortIcon k="email" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  onClick={() => toggleSort("job_title")}
                  className="inline-flex items-center gap-1.5 uppercase tracking-[0.18em] hover:text-foreground"
                >
                  Role <SortIcon k="job_title" />
                </button>
              </th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">
                <button
                  onClick={() => toggleSort("status")}
                  className="inline-flex items-center gap-1.5 uppercase tracking-[0.18em] hover:text-foreground"
                >
                  Status <SortIcon k="status" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  onClick={() => toggleSort("created_at")}
                  className="inline-flex items-center gap-1.5 uppercase tracking-[0.18em] hover:text-foreground"
                >
                  Applied <SortIcon k="created_at" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No applications {query || jobFilter !== "all" || statusFilter !== "all" ? "match your filters." : "yet."}
                </td>
              </tr>
            ) : (
              pageRows.map((r) => (
                <tr
                  key={r.id}
                  className="cursor-pointer border-t border-border hover:bg-muted/30"
                  onClick={() => setSelected(r)}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.job_title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.city}, {r.country}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="border border-border bg-background px-2 py-1 text-xs capitalize focus:border-gold focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="capitalize">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => remove(r.id, `${r.first_name} ${r.last_name}`)}
                      aria-label={`Remove ${r.first_name} ${r.last_name}`}
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize">Rows per page</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-border bg-background px-2 py-1 text-xs focus:border-gold focus:outline-none"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>
            {sorted.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="border border-border px-3 py-1 uppercase tracking-[0.18em] hover:bg-muted disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-2">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="border border-border px-3 py-1 uppercase tracking-[0.18em] hover:bg-muted disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="h-full w-full max-w-2xl overflow-y-auto bg-background p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  {selected.job_title}
                </p>
                <h2 className="mt-1 font-serif text-2xl text-foreground">
                  {selected.first_name} {selected.last_name}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Applied {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <Field label="Email" value={selected.email} />
              <Field label="Phone" value={selected.phone} />
              <Field label="Location" value={`${selected.city}, ${selected.country}`} />
              <Field label="Work authorization" value={selected.work_auth} />
              <Field label="Years experience" value={selected.years_experience} />
              <Field label="Current / recent employer" value={selected.employer} />
              <Field label="Previous title" value={selected.previous_job_title} />
              <Field label="School" value={selected.school} />
              <Field label="Degree" value={selected.degree} />
              <Field label="Field of study" value={selected.field_of_study} />
              <Field label="Graduation year" value={selected.grad_year} />
              <Field label="LinkedIn" value={selected.linkedin} link />
              <Field label="Portfolio" value={selected.portfolio} link />
              <Field label="Referral source" value={selected.referral} />
              <Field label="Resume" value={selected.resume_name} />
              <Field label="Status" value={selected.status} />
            </dl>

            {selected.responsibilities && (
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Responsibilities
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                  {selected.responsibilities}
                </p>
              </div>
            )}

            {selected.cover_letter && (
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Cover letter
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                  {selected.cover_letter}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <label className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Update status
              </label>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="border border-border bg-background px-3 py-2 text-sm capitalize focus:border-gold focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => remove(selected.id, `${selected.first_name} ${selected.last_name}`)}
                className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  link,
}: {
  label: string;
  value: string | null | undefined;
  link?: boolean;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-foreground">
        {value ? (
          link ? (
            <a
              href={value.startsWith("http") ? value : `https://${value}`}
              target="_blank"
              rel="noreferrer"
              className="text-cocoa underline underline-offset-2 hover:text-gold"
            >
              {value}
            </a>
          ) : (
            <span className="capitalize-none">{value}</span>
          )
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </dd>
    </div>
  );
}

import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronLeft } from "lucide-react";
import { findOpening } from "@/lib/careers-openings";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/careers/apply/$jobId")({
  loader: ({ params }) => {
    const job = findOpening(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Apply — ${loaderData.job.title} — Maison Hygia`
          : "Apply — Maison Hygia",
      },
      {
        name: "description",
        content:
          "Apply to join Maison Hygia. A short, step-by-step application for a role at the Maison.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <div className="bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-foreground">Role not found</h1>
        <p className="mt-4 text-cocoa">
          The position you're looking for is no longer open.
        </p>
        <Link
          to="/careers"
          className="mt-8 inline-block text-sm uppercase tracking-[0.3em] text-gold hover:text-gold/80"
        >
          ← Back to careers
        </Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-foreground">Something went wrong</h1>
        <Link
          to="/careers"
          className="mt-8 inline-block text-sm uppercase tracking-[0.3em] text-gold hover:text-gold/80"
        >
          ← Back to careers
        </Link>
      </div>
    </div>
  ),
  component: ApplyPage,
});

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  workAuth: string;
  employer: string;
  jobTitle: string;
  yearsExperience: string;
  responsibilities: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  gradYear: string;
  resumeName: string;
  linkedin: string;
  portfolio: string;
  coverLetter: string;
  referral: string;
  eeoGender: string;
  eeoEthnicity: string;
  eeoVeteran: string;
  eeoDisability: string;
  certify: boolean;
};

const initial: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  workAuth: "",
  employer: "",
  jobTitle: "",
  yearsExperience: "",
  responsibilities: "",
  school: "",
  degree: "",
  fieldOfStudy: "",
  gradYear: "",
  resumeName: "",
  linkedin: "",
  portfolio: "",
  coverLetter: "",
  referral: "",
  eeoGender: "",
  eeoEthnicity: "",
  eeoVeteran: "",
  eeoDisability: "",
  certify: false,
};

const steps = [
  "Review",
  "Personal",
  "Experience",
  "Education",
  "Documents",
  "Questions",
  "Review & Submit",
] as const;

const personalSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(80),
  lastName: z.string().trim().min(1, "Required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(5, "Enter a valid phone").max(40),
  city: z.string().trim().min(1, "Required").max(120),
  country: z.string().trim().min(1, "Required").max(120),
  workAuth: z.string().min(1, "Select an option"),
});

const experienceSchema = z.object({
  employer: z.string().trim().max(160).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(160).optional().or(z.literal("")),
  yearsExperience: z.string().min(1, "Select years of experience"),
  responsibilities: z.string().trim().max(2000).optional().or(z.literal("")),
});

const educationSchema = z.object({
  school: z.string().trim().max(160).optional().or(z.literal("")),
  degree: z.string().trim().max(160).optional().or(z.literal("")),
  fieldOfStudy: z.string().trim().max(160).optional().or(z.literal("")),
  gradYear: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$|^$/, "Enter a 4-digit year")
    .optional()
    .or(z.literal("")),
});

const documentsSchema = z.object({
  resumeName: z.string().min(1, "Attach your résumé"),
  linkedin: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^https?:\/\//i.test(v), "Must start with http(s)://"),
  portfolio: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^https?:\/\//i.test(v), "Must start with http(s)://"),
  coverLetter: z.string().trim().max(4000).optional().or(z.literal("")),
});

const questionsSchema = z.object({
  referral: z.string().min(1, "Select an option"),
});

function ApplyPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const step = steps[stepIdx];
  const progress = useMemo(
    () => Math.round(((stepIdx + 1) / steps.length) * 100),
    [stepIdx]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as string]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key as string];
        return next;
      });
    }
  }

  function validateCurrent(): boolean {
    let result: z.SafeParseReturnType<unknown, unknown> | null = null;
    if (step === "Personal") result = personalSchema.safeParse(form);
    else if (step === "Experience") result = experienceSchema.safeParse(form);
    else if (step === "Education") result = educationSchema.safeParse(form);
    else if (step === "Documents") result = documentsSchema.safeParse(form);
    else if (step === "Questions") result = questionsSchema.safeParse(form);
    if (!result || result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const k = issue.path[0];
      if (typeof k === "string" && !fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  }

  function next() {
    if (!validateCurrent()) return;
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStepIdx((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!form.certify) {
      toast.error("Please certify your application before submitting.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("job_applications").insert({
      job_slug: job.slug,
      job_title: job.title,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      city: form.city,
      country: form.country,
      work_auth: form.workAuth,
      employer: form.employer || null,
      previous_job_title: form.jobTitle || null,
      years_experience: form.yearsExperience,
      responsibilities: form.responsibilities || null,
      school: form.school || null,
      degree: form.degree || null,
      field_of_study: form.fieldOfStudy || null,
      grad_year: form.gradYear || null,
      resume_name: form.resumeName,
      linkedin: form.linkedin || null,
      portfolio: form.portfolio || null,
      cover_letter: form.coverLetter || null,
      referral: form.referral,
      eeo_gender: form.eeoGender || null,
      eeo_ethnicity: form.eeoEthnicity || null,
      eeo_veteran: form.eeoVeteran || null,
      eeo_disability: form.eeoDisability || null,
      certified: form.certify,
    });
    setSubmitting(false);
    if (error) {
      toast.error("We couldn't submit your application. Please try again.");
      return;
    }
    toast.success("Application submitted.");
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  function handleResume(file: File | null) {
    if (!file) {
      update("resumeName", "");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrors((e) => ({ ...e, resumeName: "File must be under 8 MB" }));
      return;
    }
    const okTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!okTypes.includes(file.type) && !/\.(pdf|docx?|)$/i.test(file.name)) {
      setErrors((e) => ({ ...e, resumeName: "Use PDF or Word format" }));
      return;
    }
    update("resumeName", file.name);
  }

  if (submitted) {
    return (
      <div className="bg-cream">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
          <FadeIn>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold">
              <Check className="h-6 w-6" />
            </div>
            <p className="mt-8 text-[11px] uppercase tracking-[0.4em] text-cocoa/70">
              Application received
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Thank you, {form.firstName || "friend"}.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cocoa">
              Your application for <span className="italic">{job.title}</span> has
              been sent to the Maison. Someone from our team will read it by hand
              and reach out within two weeks if there is a fit.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-cocoa text-cream hover:bg-cocoa/90"
              >
                <Link to="/careers">Back to careers</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cocoa/30 text-cocoa hover:bg-cocoa/5"
                onClick={() => navigate({ to: "/" })}
              >
                Return home
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <Link
          to="/careers"
          className="inline-flex items-center gap-1 text-sm uppercase tracking-[0.3em] text-cocoa/70 hover:text-gold"
        >
          <ChevronLeft className="h-4 w-4" /> All roles
        </Link>

        <FadeIn>
          <p className="mt-10 text-[11px] uppercase tracking-[0.4em] text-cocoa/70">
            {job.team} · {job.location} · {job.type}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Apply — {job.title}
          </h1>
        </FadeIn>

        {/* Progress */}
        <div className="mt-10">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-cocoa/70">
            <span>
              Step {stepIdx + 1} of {steps.length}
            </span>
            <span>{step}</span>
          </div>
          <div className="mt-3 h-px w-full bg-border/60">
            <div
              className="h-px bg-gold transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ol className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] md:flex">
            {steps.map((s, i) => (
              <li
                key={s}
                className={
                  i === stepIdx
                    ? "text-gold"
                    : i < stepIdx
                    ? "text-cocoa"
                    : "text-cocoa/40"
                }
              >
                {i + 1}. {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12">
          {step === "Review" && <ReviewStep job={job} />}
          {step === "Personal" && (
            <PersonalStep form={form} errors={errors} update={update} />
          )}
          {step === "Experience" && (
            <ExperienceStep form={form} errors={errors} update={update} />
          )}
          {step === "Education" && (
            <EducationStep form={form} errors={errors} update={update} />
          )}
          {step === "Documents" && (
            <DocumentsStep
              form={form}
              errors={errors}
              update={update}
              handleResume={handleResume}
            />
          )}
          {step === "Questions" && (
            <QuestionsStep form={form} errors={errors} update={update} />
          )}
          {step === "Review & Submit" && (
            <SummaryStep form={form} job={job} update={update} />
          )}
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-border/60 pt-8">
          <Button
            variant="ghost"
            className="text-cocoa hover:bg-cocoa/5"
            onClick={back}
            disabled={stepIdx === 0}
          >
            Back
          </Button>
          {stepIdx < steps.length - 1 ? (
            <Button
              className="bg-cocoa text-cream hover:bg-cocoa/90"
              onClick={next}
            >
              Continue
            </Button>
          ) : (
            <Button
              className="bg-gold text-cream hover:bg-gold/90"
              onClick={submit}
              disabled={submitting || !form.certify}
            >
              {submitting ? "Submitting…" : "Submit application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Steps ---------- */

function ReviewStep({ job }: { job: ReturnType<typeof findOpening> & object }) {
  return (
    <FadeIn>
      <h2 className="font-serif text-2xl text-foreground">About this role</h2>
      <p className="mt-4 leading-relaxed text-cocoa">{job.summary}</p>

      <h3 className="mt-10 text-sm uppercase tracking-[0.3em] text-cocoa/70">
        What you'll do
      </h3>
      <ul className="mt-4 space-y-3 text-cocoa">
        {job.responsibilities.map((r) => (
          <li key={r} className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
            <span className="leading-relaxed">{r}</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-10 text-sm uppercase tracking-[0.3em] text-cocoa/70">
        What we're looking for
      </h3>
      <ul className="mt-4 space-y-3 text-cocoa">
        {job.qualifications.map((r) => (
          <li key={r} className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
            <span className="leading-relaxed">{r}</span>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-cocoa/70">
        The application takes about five minutes. You can review everything before
        you submit.
      </p>
    </FadeIn>
  );
}

type StepProps = {
  form: FormState;
  errors: Record<string, string>;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
};

function Field({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <Label
        htmlFor={htmlFor}
        className="text-xs uppercase tracking-[0.25em] text-cocoa/70"
      >
        {label}
      </Label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}

function PersonalStep({ form, errors, update }: StepProps) {
  return (
    <FadeIn>
      <h2 className="font-serif text-2xl text-foreground">Personal information</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="First name" error={errors.firstName} htmlFor="firstName">
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Last name" error={errors.lastName} htmlFor="lastName">
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            autoComplete="family-name"
          />
        </Field>
        <Field label="Email" error={errors.email} htmlFor="email">
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field label="Phone" error={errors.phone} htmlFor="phone">
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            autoComplete="tel"
          />
        </Field>
        <Field label="City" error={errors.city} htmlFor="city">
          <Input
            id="city"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            autoComplete="address-level2"
          />
        </Field>
        <Field label="Country" error={errors.country} htmlFor="country">
          <Input
            id="country"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            autoComplete="country-name"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Work authorization" error={errors.workAuth}>
            <Select
              value={form.workAuth}
              onValueChange={(v) => update("workAuth", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="authorized">
                  Authorized to work in the role's country
                </SelectItem>
                <SelectItem value="sponsorship">
                  Will require visa sponsorship
                </SelectItem>
                <SelectItem value="remote-only">
                  Applying for a remote role only
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>
    </FadeIn>
  );
}

function ExperienceStep({ form, errors, update }: StepProps) {
  return (
    <FadeIn>
      <h2 className="font-serif text-2xl text-foreground">Most recent experience</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Employer" error={errors.employer} htmlFor="employer">
          <Input
            id="employer"
            value={form.employer}
            onChange={(e) => update("employer", e.target.value)}
          />
        </Field>
        <Field label="Job title" error={errors.jobTitle} htmlFor="jobTitle">
          <Input
            id="jobTitle"
            value={form.jobTitle}
            onChange={(e) => update("jobTitle", e.target.value)}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Years of relevant experience" error={errors.yearsExperience}>
            <Select
              value={form.yearsExperience}
              onValueChange={(v) => update("yearsExperience", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">Less than 1 year</SelectItem>
                <SelectItem value="1-3">1–3 years</SelectItem>
                <SelectItem value="3-5">3–5 years</SelectItem>
                <SelectItem value="5-8">5–8 years</SelectItem>
                <SelectItem value="8+">8+ years</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field
            label="Key responsibilities"
            error={errors.responsibilities}
            htmlFor="responsibilities"
          >
            <Textarea
              id="responsibilities"
              rows={5}
              value={form.responsibilities}
              onChange={(e) => update("responsibilities", e.target.value)}
              placeholder="A few sentences on what you own today."
            />
          </Field>
        </div>
      </div>
    </FadeIn>
  );
}

function EducationStep({ form, errors, update }: StepProps) {
  return (
    <FadeIn>
      <h2 className="font-serif text-2xl text-foreground">Education</h2>
      <p className="mt-3 text-sm text-cocoa/70">
        Optional. Share what feels relevant.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="School" error={errors.school} htmlFor="school">
          <Input
            id="school"
            value={form.school}
            onChange={(e) => update("school", e.target.value)}
          />
        </Field>
        <Field label="Degree" error={errors.degree} htmlFor="degree">
          <Input
            id="degree"
            value={form.degree}
            onChange={(e) => update("degree", e.target.value)}
          />
        </Field>
        <Field
          label="Field of study"
          error={errors.fieldOfStudy}
          htmlFor="fieldOfStudy"
        >
          <Input
            id="fieldOfStudy"
            value={form.fieldOfStudy}
            onChange={(e) => update("fieldOfStudy", e.target.value)}
          />
        </Field>
        <Field label="Graduation year" error={errors.gradYear} htmlFor="gradYear">
          <Input
            id="gradYear"
            inputMode="numeric"
            value={form.gradYear}
            onChange={(e) => update("gradYear", e.target.value)}
            placeholder="YYYY"
          />
        </Field>
      </div>
    </FadeIn>
  );
}

function DocumentsStep({
  form,
  errors,
  update,
  handleResume,
}: StepProps & { handleResume: (f: File | null) => void }) {
  return (
    <FadeIn>
      <h2 className="font-serif text-2xl text-foreground">Documents & links</h2>
      <div className="mt-8 grid grid-cols-1 gap-6">
        <Field label="Résumé (PDF or Word, up to 8MB)" error={errors.resumeName}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-cocoa/30 bg-white px-4 py-2 text-sm text-cocoa transition hover:bg-cocoa/5">
              Choose file
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => handleResume(e.target.files?.[0] ?? null)}
              />
            </label>
            <span className="text-sm text-cocoa/80">
              {form.resumeName || "No file selected"}
            </span>
          </div>
        </Field>
        <Field label="LinkedIn URL" error={errors.linkedin} htmlFor="linkedin">
          <Input
            id="linkedin"
            value={form.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/…"
          />
        </Field>
        <Field
          label="Portfolio / website"
          error={errors.portfolio}
          htmlFor="portfolio"
        >
          <Input
            id="portfolio"
            value={form.portfolio}
            onChange={(e) => update("portfolio", e.target.value)}
            placeholder="https://…"
          />
        </Field>
        <Field
          label="A note to the Maison (optional)"
          error={errors.coverLetter}
          htmlFor="coverLetter"
        >
          <Textarea
            id="coverLetter"
            rows={6}
            value={form.coverLetter}
            onChange={(e) => update("coverLetter", e.target.value)}
            placeholder="Anything you'd like us to know."
          />
        </Field>
      </div>
    </FadeIn>
  );
}

function QuestionsStep({ form, errors, update }: StepProps) {
  return (
    <FadeIn>
      <h2 className="font-serif text-2xl text-foreground">A few questions</h2>
      <div className="mt-8 grid grid-cols-1 gap-6">
        <Field label="How did you hear about us?" error={errors.referral}>
          <Select
            value={form.referral}
            onValueChange={(v) => update("referral", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friend">A friend at Maison Hygia</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="press">Press or editorial</SelectItem>
              <SelectItem value="search">Search engine</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <div className="mt-6 rounded-md border border-border/60 bg-[#F8F5F0] p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cocoa/70">
            Voluntary self-identification
          </p>
          <p className="mt-3 text-sm text-cocoa/80">
            The Maison is an equal opportunity employer. These questions are
            optional and used only in aggregate to improve our hiring.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Gender">
              <Select
                value={form.eeoGender}
                onValueChange={(v) => update("eeoGender", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prefer not to say" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="woman">Woman</SelectItem>
                  <SelectItem value="man">Man</SelectItem>
                  <SelectItem value="nonbinary">Non-binary</SelectItem>
                  <SelectItem value="self-describe">Prefer to self-describe</SelectItem>
                  <SelectItem value="decline">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Ethnicity">
              <Select
                value={form.eeoEthnicity}
                onValueChange={(v) => update("eeoEthnicity", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prefer not to say" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="black">Black or African descent</SelectItem>
                  <SelectItem value="hispanic">Hispanic or Latino/a/x</SelectItem>
                  <SelectItem value="mena">Middle Eastern or North African</SelectItem>
                  <SelectItem value="native">Indigenous or Native</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="multi">Two or more</SelectItem>
                  <SelectItem value="decline">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Veteran status">
              <Select
                value={form.eeoVeteran}
                onValueChange={(v) => update("eeoVeteran", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prefer not to say" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veteran">I am a veteran</SelectItem>
                  <SelectItem value="not-veteran">I am not a veteran</SelectItem>
                  <SelectItem value="decline">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Disability status">
              <Select
                value={form.eeoDisability}
                onValueChange={(v) => update("eeoDisability", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prefer not to say" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, I have a disability</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="decline">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function SummaryStep({
  form,
  job,
  update,
}: {
  form: FormState;
  job: { title: string; team: string; location: string; type: string };
  update: StepProps["update"];
}) {
  const rows: [string, string][] = [
    ["Role", `${job.title} — ${job.team}`],
    ["Location / Type", `${job.location} · ${job.type}`],
    ["Name", `${form.firstName} ${form.lastName}`.trim() || "—"],
    ["Email", form.email || "—"],
    ["Phone", form.phone || "—"],
    ["Based in", [form.city, form.country].filter(Boolean).join(", ") || "—"],
    ["Work authorization", form.workAuth || "—"],
    [
      "Most recent",
      form.employer || form.jobTitle
        ? `${form.jobTitle || "—"} at ${form.employer || "—"}`
        : "—",
    ],
    ["Years of experience", form.yearsExperience || "—"],
    [
      "Education",
      [form.degree, form.fieldOfStudy, form.school, form.gradYear]
        .filter(Boolean)
        .join(" · ") || "—",
    ],
    ["Résumé", form.resumeName || "—"],
    ["LinkedIn", form.linkedin || "—"],
    ["Portfolio", form.portfolio || "—"],
    ["Heard about us via", form.referral || "—"],
  ];

  return (
    <FadeIn>
      <h2 className="font-serif text-2xl text-foreground">Review & submit</h2>
      <p className="mt-3 text-sm text-cocoa/70">
        Please confirm everything below before submitting.
      </p>

      <dl className="mt-8 divide-y divide-border/60 border-y border-border/60">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-1 gap-1 py-4 md:grid-cols-3 md:gap-6">
            <dt className="text-xs uppercase tracking-[0.25em] text-cocoa/60">
              {k}
            </dt>
            <dd className="text-cocoa md:col-span-2">{v}</dd>
          </div>
        ))}
      </dl>

      {form.coverLetter && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cocoa/60">
            Note to the Maison
          </p>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-cocoa">
            {form.coverLetter}
          </p>
        </div>
      )}

      <label className="mt-10 flex items-start gap-3 rounded-md border border-border/60 bg-[#F8F5F0] p-5">
        <Checkbox
          checked={form.certify}
          onCheckedChange={(v) => update("certify", v === true)}
          className="mt-1"
        />
        <span className="text-sm leading-relaxed text-cocoa">
          I certify that the information above is accurate and complete, and I
          agree that Maison Hygia may process it to consider my application.
        </span>
      </label>
    </FadeIn>
  );
}

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { NewsletterInline } from "@/components/NewsletterInline";
import { openings } from "@/lib/careers-openings";
import heroImage from "@/assets/careers-hero.jpg";
import craftSourced from "@/assets/craft-sourced.jpg";
import craftCrafted from "@/assets/craft-crafted.jpg";
import craftDesigned from "@/assets/craft-designed.jpg";
import craftEveryday from "@/assets/craft-everyday.jpg";
import { ChevronDown } from "lucide-react";



export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Careers — Maison Hygia" },
      {
        name: "description",
        content:
          "Join Maison Hygia. Build modern rituals rooted in nature alongside a small, thoughtful team of makers, designers, and storytellers.",
      },
      { property: "og:title", content: "Careers — Maison Hygia" },
      {
        property: "og:description",
        content:
          "Build modern rituals rooted in nature with a small, thoughtful team.",
      },
      { property: "og:url", content: "/careers" },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

const values = [
  {
    title: "Craft over speed",
    body: "We take the time formulations, packaging, and ideas deserve. Slowness is a discipline.",
  },
  {
    title: "Nature as compass",
    body: "Every decision — from sourcing to storytelling — begins with what the earth offers.",
  },
  {
    title: "Considered by design",
    body: "Beauty and utility are not separate. We sweat the details others overlook.",
  },
  {
    title: "Quiet ambition",
    body: "We build a house, not a headline. We measure ourselves in years, not quarters.",
  },
];

const teams = [
  {
    name: "Formulation & Product",
    image: craftCrafted,
    blurb:
      "Cosmetic chemists, food scientists, and formulators shaping every ritual from the inside out.",
  },
  {
    name: "Design & Brand",
    image: craftDesigned,
    blurb:
      "Art direction, industrial design, and copy that carries the Maison's voice into every surface.",
  },
  {
    name: "Sourcing & Supply",
    image: craftSourced,
    blurb:
      "Partners with growers, cooperatives, and artisans to bring rare ingredients home responsibly.",
  },
  {
    name: "Retail & Hospitality",
    image: craftEveryday,
    blurb:
      "The people who welcome guests into the Maison, in stores and in every conversation.",
  },
];


const benefits = [
  {
    title: "A generous ritual",
    body: "Unlimited paid time off, extended parental leave, and a genuine four-day summer cadence.",
  },
  {
    title: "Well-being stipend",
    body: "A monthly allowance for practices that keep you nourished — movement, therapy, or a slow lunch.",
  },
  {
    title: "The Maison, at home",
    body: "Every team member receives the full collection quarterly, plus a friends-and-family allowance.",
  },
  {
    title: "Learning by hand",
    body: "An annual craft budget for workshops, residencies, and time spent learning from makers we admire.",
  },
];

function CareersPage() {
  return (
    <div className="bg-cream">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="A quiet atelier with botanicals and amber glass"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/75 to-transparent" />
        </div>
        <div className="relative mx-auto grid min-h-[72vh] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-24 md:px-10 lg:grid-cols-2 lg:py-32">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.4em] text-cocoa/70">
              Careers at Maison Hygia
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
              Come build rituals
              <br />
              <span className="italic text-gold">worth keeping.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-cocoa">
              We are a small, deliberate team of makers, designers, and
              storytellers shaping a modern house of everyday care — rooted in
              nature, made for modern living.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-cocoa text-cream hover:bg-cocoa/90">
                <a href="#openings">See open roles</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-cocoa/30 text-cocoa hover:bg-cocoa/5">
                <a href="#life">Life at the Maison</a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="border-t border-border/50 bg-[#F8F5F0]">
        <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
          <FadeIn>
            <p className="text-center text-[11px] uppercase tracking-[0.4em] text-cocoa/70">
              Our philosophy
            </p>
            <h2 className="mt-6 text-center font-serif text-4xl leading-tight text-foreground md:text-5xl">
              We work the way we make things.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-cocoa">
              Slowly. Attentively. With respect for people, ingredients, and
              time. The Maison is built by hand — every role matters, every
              detail counts.
            </p>
          </FadeIn>
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 80}>
                <div className="border-l border-gold/50 pl-6">
                  <h3 className="font-serif text-2xl text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-cocoa leading-relaxed">{v.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TEAMS */}
      <section id="life" className="border-t border-border/50 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.4em] text-cocoa/70">
              Life at the Maison
            </p>
            <h2 className="mt-6 max-w-3xl font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Four houses under one roof.
            </h2>
          </FadeIn>
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
            {teams.map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <article className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-[#F1ECE5]">
                    <img
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl text-foreground">
                    {t.name}
                  </h3>
                  <p className="mt-2 max-w-md text-cocoa leading-relaxed">
                    {t.blurb}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="border-t border-border/50 bg-[#F1ECE5]">
        <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
          <FadeIn>
            <p className="text-center text-[11px] uppercase tracking-[0.4em] text-cocoa/70">
              How we care for our own
            </p>
            <h2 className="mt-6 text-center font-serif text-4xl leading-tight text-foreground md:text-5xl">
              The Maison, extended.
            </h2>
          </FadeIn>
          <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <FadeIn key={b.title} delay={i * 80}>
                <div>
                  <div className="h-px w-10 bg-gold/60" />
                  <h3 className="mt-5 font-serif text-2xl text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-cocoa leading-relaxed">{b.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* OPENINGS */}
      <section id="openings" className="border-t border-border/50 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <FadeIn>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-cocoa/70">
                  Open positions
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
                  Currently welcoming.
                </h2>
              </div>
              <p className="max-w-sm text-cocoa">
                Don't see your role? We're always listening.{" "}
                <Link to="/contact" className="text-gold underline underline-offset-4 hover:text-gold/80">
                  Introduce yourself
                </Link>
                .
              </p>
            </div>
          </FadeIn>

          <div className="mt-14 divide-y divide-border/60 border-y border-border/60">
            {openings.map((o, i) => (
              <FadeIn key={o.slug} delay={i * 40}>
                <OpeningRow opening={o} />
              </FadeIn>
            ))}


          </div>
        </div>
      </section>

      {/* NEWSLETTER / STAY CLOSE */}
      <section className="border-t border-border/50 bg-[#F8F5F0]">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:px-10 md:py-32">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.4em] text-cocoa/70">
              Stay in touch
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Hear about future roles first.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-cocoa">
              Join our list to receive occasional notes from the Maison —
              including new positions as they open.
            </p>
            <div className="mx-auto mt-10 max-w-md">
              <NewsletterInline source="careers" />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function OpeningRow({ opening: o }: { opening: (typeof openings)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12 md:gap-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="group text-left md:col-span-5"
          aria-expanded={open}
        >
          <h3 className="font-serif text-2xl text-foreground transition-colors group-hover:text-gold">
            {o.title}
          </h3>
          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-cocoa/60">
            {o.team}
          </p>
        </button>
        <p className="text-cocoa md:col-span-3">{o.location}</p>
        <p className="text-cocoa md:col-span-2">{o.type}</p>
        <div className="flex items-center gap-4 md:col-span-2 md:justify-end">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-cocoa/70 hover:text-gold"
          >
            {open ? "Hide" : "Details"}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          <Link
            to="/careers/apply/$jobId"
            params={{ jobId: o.slug }}
            className="text-xs uppercase tracking-[0.3em] text-gold hover:text-gold/80"
          >
            Apply →
          </Link>
        </div>
      </div>
      {open && (
        <div className="mt-6 grid grid-cols-1 gap-8 border-t border-border/50 pt-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="leading-relaxed text-cocoa">{o.summary}</p>
            <h4 className="mt-8 text-xs uppercase tracking-[0.3em] text-cocoa/70">
              What you'll do
            </h4>
            <ul className="mt-4 space-y-2 text-cocoa">
              {o.responsibilities.map((r) => (
                <li key={r} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
            <h4 className="mt-8 text-xs uppercase tracking-[0.3em] text-cocoa/70">
              What we're looking for
            </h4>
            <ul className="mt-4 space-y-2 text-cocoa">
              {o.qualifications.map((r) => (
                <li key={r} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <div className="rounded-md border border-border/60 bg-[#F8F5F0] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cocoa/70">
                Ready to apply?
              </p>
              <p className="mt-3 text-sm text-cocoa">
                Takes about five minutes. You can review everything before you
                submit.
              </p>
              <Button
                asChild
                className="mt-5 w-full bg-cocoa text-cream hover:bg-cocoa/90"
              >
                <Link
                  to="/careers/apply/$jobId"
                  params={{ jobId: o.slug }}
                >
                  Start application
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


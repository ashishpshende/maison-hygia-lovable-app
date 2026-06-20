import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Maison Hygia" },
      {
        name: "description",
        content:
          "Write to Maison Hygia. For wholesale, press, custom rituals, or simply to share a thought — we'd love to hear from you.",
      },
      { property: "og:title", content: "Contact — Maison Hygia" },
      {
        property: "og:description",
        content:
          "Write to Maison Hygia — for wholesale, press, or to share a thought.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-cream">
      <FadeIn immediate as="section" className="px-6 md:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center pb-20 pt-32 text-center md:pt-40">
          <p className="text-xs uppercase tracking-[0.42em] text-gold md:text-sm">
            Contact
          </p>
          <h1 className="mt-8 font-serif text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Get in <span className="italic text-gold">Touch.</span>
          </h1>
          <div aria-hidden className="mx-auto my-10 h-px w-12 bg-gold/60" />
          <p className="max-w-xl text-base leading-[1.9] text-foreground/70 md:text-lg">
            We're here to help — thoughtfully and personally. Whether you have a
            question, a concern, or simply wish to share a note, we'd love to
            hear from you.
          </p>
        </div>
      </FadeIn>

      <FadeIn as="section" className="px-6 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-20 pb-32 md:grid-cols-[1.1fr_1fr] md:gap-24 md:pb-40">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
              Send a Note
            </p>
            <h2 className="mt-5 font-serif text-3xl text-foreground md:text-4xl">
              A quiet line.
            </h2>
            <div aria-hidden className="my-8 h-px w-12 bg-gold/50" />

            {submitted ? (
              <div className="border border-gold/30 bg-cream/60 px-8 py-12 text-center">
                <p className="font-serif text-2xl italic text-gold md:text-3xl">
                  Thank you.
                </p>
                <p className="mt-4 text-sm leading-[1.9] text-foreground/70 md:text-base">
                  Your note has been received. <br /> We'll write back, slowly
                  and thoughtfully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[11px] uppercase tracking-[0.3em] text-foreground/70"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="mt-3 w-full border-0 border-b border-gold/40 bg-transparent px-0 py-3 font-serif text-lg text-foreground placeholder:text-foreground/30 focus:border-cocoa focus:outline-none focus:ring-0"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] uppercase tracking-[0.3em] text-foreground/70"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-3 w-full border-0 border-b border-gold/40 bg-transparent px-0 py-3 font-serif text-lg text-foreground placeholder:text-foreground/30 focus:border-cocoa focus:outline-none focus:ring-0"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-[11px] uppercase tracking-[0.3em] text-foreground/70"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    defaultValue="general"
                    className="mt-3 w-full border-0 border-b border-gold/40 bg-transparent px-0 py-3 font-serif text-lg text-foreground focus:border-cocoa focus:outline-none focus:ring-0"
                  >
                    <option value="general">General inquiry</option>
                    <option value="product">A question about a product</option>
                    <option value="order">Help with an order</option>
                    <option value="wholesale">Wholesale & press</option>
                    <option value="other">Something else</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[11px] uppercase tracking-[0.3em] text-foreground/70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="mt-3 w-full resize-none border-0 border-b border-gold/40 bg-transparent px-0 py-3 font-serif text-lg leading-[1.7] text-foreground placeholder:text-foreground/30 focus:border-cocoa focus:outline-none focus:ring-0"
                    placeholder="Share your thought…"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 border border-cocoa bg-cocoa px-8 py-4 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-all duration-500 hover:border-cocoa-soft hover:bg-cocoa-soft"
                  >
                    Send Note
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="md:pt-2">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
              Reach Us
            </p>
            <h2 className="mt-5 font-serif text-3xl text-foreground md:text-4xl">
              With warmth & care.
            </h2>
            <div aria-hidden className="my-8 h-px w-12 bg-gold/50" />

            <dl className="space-y-10">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.3em] text-foreground/60">
                  Write to us
                </dt>
                <dd className="mt-3">
                  <a
                    href="mailto:care@maisonhygia.com"
                    className="font-serif text-xl text-foreground transition-colors hover:text-gold md:text-2xl"
                  >
                    care@maisonhygia.com
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-[11px] uppercase tracking-[0.3em] text-foreground/60">
                  The Studio
                </dt>
                <dd className="mt-3 font-serif text-lg leading-[1.7] text-foreground/80 md:text-xl">
                  Slow-crafted in small batches.
                </dd>
              </div>

              <div>
                <dt className="text-[11px] uppercase tracking-[0.3em] text-foreground/60">
                  Hours
                </dt>
                <dd className="mt-3 font-serif text-base leading-[1.8] text-foreground/70 md:text-lg">
                  Monday — Friday
                  <br />
                  10:00 — 18:00
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </FadeIn>

      <FadeIn as="section" className="border-t border-gold/15 px-6 md:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center py-32 text-center md:py-40">
          <div aria-hidden className="h-px w-12 bg-gold/50" />
          <p className="mt-12 font-serif text-2xl leading-[1.5] text-foreground md:text-3xl lg:text-[2.25rem] lg:leading-[1.4]">
            Care, <span className="italic text-gold">always,</span>
            <br />
            begins with a conversation.
          </p>
          <div aria-hidden className="mt-12 h-px w-12 bg-gold/50" />

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              to="/story"
              className="border-b border-gold/60 pb-1 text-xs uppercase tracking-[0.28em] text-foreground transition-colors hover:border-foreground"
            >
              Our Story
            </Link>
            <Link
              to="/shop"
              className="border-b border-gold/60 pb-1 text-xs uppercase tracking-[0.28em] text-foreground transition-colors hover:border-foreground"
            >
              The Collection
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

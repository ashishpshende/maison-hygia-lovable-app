import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, HeartHandshake, Sparkles, Sprout, Sun } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import heroAsset from "@/assets/hero-products.png.asset.json";
import bodyWashAsset from "@/assets/body-wash.png.asset.json";
import sheetMaskAsset from "@/assets/sheet-mask.png.asset.json";
import catalogAsset from "@/assets/catalog.png.asset.json";

const hero = heroAsset.url;
const bodyWash = bodyWashAsset.url;
const sheetMask = sheetMaskAsset.url;
const catalog = catalogAsset.url;

const pillars = [
  { label: "Rooted in Nature", Icon: Leaf },
  { label: "Cruelty Free", Icon: HeartHandshake },
  { label: "Clean Ingredients", Icon: Sprout },
  { label: "Modern Wellness", Icon: Sparkles },
  { label: "Made for Modern Living", Icon: Sun },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Hygia — Care, made into ritual." },
      {
        name: "description",
        content:
          "Rooted in Ayurveda. Made for modern living. Discover Maison Hygia's slow-crafted body wash, face care, sheet masks, and ritual essentials.",
      },
      { property: "og:title", content: "Maison Hygia — Care, made into ritual." },
      {
        property: "og:description",
        content: "Rooted in Ayurveda. Made for modern living. Care, made into ritual.",
      },
      { property: "og:url", content: "/" },
      { property: "og:image", content: hero },
      { name: "twitter:image", content: hero },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-cream">
        <div className="relative min-h-[640px] w-full md:h-[92vh]">
          <img
            src={hero}
            alt="Maison Hygia founder's collection — body wash, shampoo, face serum, ritual clusters, makhana and calm-filled dates on warm stone"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/55 to-transparent md:from-cream/85 md:via-cream/30"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream to-transparent"
          />

          <div className="relative z-10 mx-auto flex h-full min-h-[640px] max-w-7xl items-center px-6 py-16 md:min-h-0 md:px-10">
            <FadeIn immediate className="max-w-xl">
              <p className="text-xs font-medium uppercase tracking-[0.42em] text-gold md:text-sm">
                Maison Hygia
              </p>

              <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                Rituals that
                <br />
                <span className="italic text-gold">nourish</span> you.
              </h1>

              <div className="mt-8 max-w-md space-y-2 text-sm leading-relaxed text-foreground/75 md:text-base">
                <p>Beauty for your skin. Nourishment for your body.</p>
                <p>Every day. In every thoughtful choice.</p>
              </div>

              <div className="mt-10">
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-3 border border-cocoa bg-cocoa px-8 py-4 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-all duration-500 hover:bg-cocoa-soft hover:border-cocoa-soft"
                >
                  Discover the Ritual
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </Link>
              </div>

              <ul className="mt-12 flex flex-wrap items-start gap-x-6 gap-y-6 sm:gap-x-8">
                {pillars.map(({ label, Icon }, i) => (
                  <li
                    key={label}
                    className="group flex w-20 flex-col items-center text-center opacity-0 animate-[fade-in_0.7s_ease-out_forwards] sm:w-24"
                    style={{ animationDelay: `${400 + i * 150}ms` }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-cream/70 text-gold shadow-sm backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold group-hover:bg-cream group-hover:shadow-md sm:h-14 sm:w-14">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.4} />
                    </div>
                    <span className="mt-3 text-[10px] uppercase tracking-[0.18em] leading-tight text-foreground/75">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quiet brand intro */}
      <FadeIn as="section" className="relative bg-cream px-6 md:px-10">
        <div className="relative mx-auto flex max-w-3xl flex-col items-center py-40 text-center md:py-56">
          <div aria-hidden className="h-px w-12 bg-gold/50" />

          <h2 className="mt-12 font-serif text-3xl leading-[1.25] text-foreground md:text-4xl lg:text-[2.75rem]">
            There was a time when{" "}
            <span className="text-gold">care</span> was simple.
            <br />
            <span className="italic text-gold/90">Slower.</span> More{" "}
            <span className="text-gold">intentional.</span>
          </h2>

          <p className="mt-12 max-w-xl text-base leading-[1.9] text-foreground/70 md:text-lg">
            <span className="font-serif text-lg text-gold md:text-xl">Maison Hygia</span>{" "}
            brings that feeling back —
            <br />
            through thoughtfully crafted formulas
            <br />
            rooted in <span className="text-gold">Ayurvedic tradition.</span>
          </p>

          <div aria-hidden className="mt-16 h-px w-12 bg-gold/50" />
        </div>
      </FadeIn>

      {/* Product preview */}
      <FadeIn as="section" className="relative bg-cream px-6 md:px-10">
        <div className="mx-auto max-w-7xl pb-32 pt-8 md:pb-40">
          <div className="grid gap-16 md:grid-cols-3 md:gap-10 lg:gap-16">
            <article className="flex flex-col items-center text-center">
              <div className="w-full overflow-hidden bg-cream">
                <img
                  src={bodyWash}
                  alt="Maison Hygia Body Wash — amber glass bottle with gold pump on warm stone"
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-10 text-[11px] uppercase tracking-[0.4em] text-gold">
                Daily Cleanse
              </p>
              <h3 className="mt-5 font-serif text-2xl text-foreground md:text-[1.75rem]">
                A Gentle Start
              </h3>
              <p className="mt-5 max-w-xs text-sm leading-[1.9] text-foreground/70 md:text-base">
                Non-stripping Ayurvedic cleanser for everyday barrier care.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-3 border border-cocoa bg-cocoa px-7 py-3 text-[11px] uppercase tracking-[0.28em] text-primary-foreground transition-all duration-500 hover:border-cocoa-soft hover:bg-cocoa-soft"
              >
                Shop Body Wash
              </Link>
            </article>

            <article className="flex flex-col items-center text-center">
              <div className="w-full overflow-hidden bg-cream">
                <img
                  src={sheetMask}
                  alt="Maison Hygia Golden Glow Blend sheet mask in amber sachet beside a cotton mask"
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-10 text-[11px] uppercase tracking-[0.4em] text-gold">
                Ritual Glow
              </p>
              <h3 className="mt-5 font-serif text-2xl text-foreground md:text-[1.75rem]">
                A Slower Pause
              </h3>
              <p className="mt-5 max-w-xs text-sm leading-[1.9] text-foreground/70 md:text-base">
                Golden Glow Blend sheet mask — fifteen quiet minutes for the skin.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-3 border border-cocoa bg-cocoa px-7 py-3 text-[11px] uppercase tracking-[0.28em] text-primary-foreground transition-all duration-500 hover:border-cocoa-soft hover:bg-cocoa-soft"
              >
                Shop Sheet Mask
              </Link>
            </article>

            <article className="flex flex-col items-center text-center">
              <div className="w-full overflow-hidden bg-cream">
                <img
                  src={catalog}
                  alt="Maison Hygia full collection — body wash, bath salt, bath soak, body scrub, face care, hair care"
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-10 text-[11px] uppercase tracking-[0.4em] text-gold">
                The Full Ritual
              </p>
              <h3 className="mt-5 font-serif text-2xl text-foreground md:text-[1.75rem]">
                The Collection
              </h3>
              <p className="mt-5 max-w-xs text-sm leading-[1.9] text-foreground/70 md:text-base">
                Eleven slow-crafted essentials for skin, hair, and bath.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-3 border border-gold bg-transparent px-7 py-3 text-[11px] uppercase tracking-[0.28em] text-cocoa transition-all duration-500 hover:bg-gold/10"
              >
                Explore All
              </Link>
            </article>
          </div>
        </div>
      </FadeIn>

      {/* Botanical inspiration band */}
      <section className="relative isolate overflow-hidden bg-cream">
        <div className="relative h-[80vh] min-h-[520px] w-full md:h-[88vh]">
          <img
            src={catalog}
            alt="The Maison Hygia collection arranged across warm stone and dried botanicals"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />

          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cream to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cream to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-cream/30 via-cream/15 to-cream/40"
          />

          <div className="relative z-10 mx-auto flex h-full max-w-5xl items-center justify-center px-6 md:px-10">
            <FadeIn className="text-center">
              <div aria-hidden className="mx-auto h-px w-12 bg-gold/60" />
              <p className="mx-auto mt-12 max-w-2xl font-serif text-2xl leading-[1.4] text-foreground md:text-4xl lg:text-[2.5rem] lg:leading-[1.35]">
                Inspired by{" "}
                <span className="italic text-gold">botanicals</span> known for
                their{" "}
                <span className="text-gold">calming</span> and{" "}
                <span className="text-gold">grounding</span> qualities.
              </p>
              <div aria-hidden className="mx-auto mt-12 h-px w-12 bg-gold/60" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Closing band */}
      <section className="relative isolate overflow-hidden bg-cocoa text-primary-foreground">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-40 text-center md:px-10 md:py-56">
          <div aria-hidden className="h-px w-12 bg-gold/70" />
          <p className="mt-10 text-xs uppercase tracking-[0.42em] text-gold">
            Maison Hygia
          </p>
          <h2 className="mt-8 font-serif text-4xl leading-[1.15] md:text-5xl lg:text-6xl">
            Modern Rituals
            <br />
            <span className="italic text-gold">Rooted in Nature.</span>
          </h2>
          <div aria-hidden className="mt-12 h-px w-12 bg-gold/70" />
        </div>
      </section>
    </div>
  );
}

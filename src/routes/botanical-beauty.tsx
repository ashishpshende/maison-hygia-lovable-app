import { createFileRoute } from "@tanstack/react-router";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import bodyWashAsset from "@/assets/mh-body-wash.png.asset.json";
import faceSerumAsset from "@/assets/mh-face-serum.png.asset.json";
import bodyLotion from "@/assets/mh-body-lotion.jpg";
import collectionHero from "@/assets/mh-collection-hero.png.asset.json";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export const Route = createFileRoute("/botanical-beauty")({
  head: () => ({
    meta: [
      { title: "Botanical Beauty — Maison Hygia" },
      {
        name: "description",
        content:
          "Everyday rituals for skin, hair and body. Thoughtfully crafted formulations inspired by nature and designed for modern living.",
      },
      { property: "og:title", content: "Botanical Beauty — Maison Hygia" },
      {
        property: "og:description",
        content:
          "Everyday rituals for skin, hair and body — slow-crafted formulations inspired by nature.",
      },
      { property: "og:image", content: faceSerumAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: faceSerumAsset.url },
    ],
    links: [{ rel: "canonical", href: "/botanical-beauty" }],
  }),
  component: BotanicalBeautyPage,
});

function BotanicalBeautyPage() {
  return (
    <div className="bg-cream">
      {/* HERO — split-screen editorial */}
      <section className="relative overflow-hidden bg-[#F4EEE4]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:min-h-[78vh] md:grid-cols-2 md:gap-16 md:px-10 md:py-24">
          {/* Left copy */}
          <FadeIn className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
              Botanical Beauty
            </p>
            <h1 className="mt-8 font-serif text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
              Everyday Care,
              <br />
              <span className="italic text-gold">Elevated into Ritual.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-[1.9] text-foreground/70 md:text-lg">
              Thoughtfully crafted care for face, hair, and body—designed to
              bring gentleness, beauty, and intention to the rituals you return
              to every day.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button
                size="lg"
                onClick={() => scrollToId("collection")}
                className="bg-cocoa text-cream hover:bg-cocoa/90"
              >
                Shop the Collection
              </Button>
              <button
                type="button"
                onClick={() => scrollToId("rituals")}
                className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-cocoa transition-colors hover:text-gold"
              >
                Explore by Ritual
                <span
                  aria-hidden
                  className="inline-block h-px w-8 bg-cocoa transition-all group-hover:w-12 group-hover:bg-gold"
                />
              </button>
            </div>
          </FadeIn>

          {/* Right: editorial collection image */}
          <FadeIn delay={120}>
            <div className="relative overflow-hidden rounded-sm bg-[#EFE6D8] shadow-[0_30px_80px_-40px_rgba(60,40,20,0.35)]">
              <img
                src={collectionHero.url}
                alt="Maison Hygia botanical beauty collection on travertine with linen and botanicals"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* RITUALS — three category nav */}
      <section
        id="rituals"
        className="border-t border-border/50 bg-[#FBF7F0]"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <FadeIn className="mb-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
              Explore by Ritual
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground md:text-4xl">
              Find your daily practice.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                name: "Body Care",
                blurb: "Cleanse, soften, nourish.",
              },
              {
                name: "Face Care",
                blurb: "Barrier repair and quiet radiance.",
              },
              {
                name: "Hair Care",
                blurb: "Scalp health, strand to strand.",
              },
            ].map((r, i) => (
              <FadeIn key={r.name} delay={i * 80}>
                <button
                  type="button"
                  onClick={() => scrollToId("collection")}
                  className="group flex h-full w-full flex-col items-start rounded-sm border border-cocoa/15 bg-cream p-8 text-left transition-all hover:border-gold hover:shadow-[0_20px_50px_-30px_rgba(60,40,20,0.4)]"
                >
                  <p className="text-[10px] uppercase tracking-[0.36em] text-gold">
                    Ritual
                  </p>
                  <h3 className="mt-4 font-serif text-2xl text-foreground">
                    {r.name}
                  </h3>
                  <p className="mt-2 text-cocoa/80">{r.blurb}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-cocoa transition-colors group-hover:text-gold">
                    Shop
                    <span
                      aria-hidden
                      className="inline-block h-px w-6 bg-cocoa transition-all group-hover:w-10 group-hover:bg-gold"
                    />
                  </span>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* COLLECTION */}
      <section
        id="collection"
        className="border-t border-border/50 bg-cream"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.4em] text-cocoa/70">
              The Rituals
            </p>
            <h2 className="mt-6 max-w-2xl font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Slow-crafted essentials.
            </h2>
          </FadeIn>
          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Body Wash",
                blurb:
                  "Non-stripping Ayurvedic cleanser for daily barrier care.",
                img: bodyWashAsset.url,
              },
              {
                name: "Face Serum",
                blurb:
                  "Barrier repair, even tone, and radiant, healthy skin.",
                img: faceSerumAsset.url,
                hero: true,
              },
              {
                name: "Body Lotion",
                blurb:
                  "Weightless botanical hydration that lingers on skin.",
                img: bodyLotion,
              },
            ].map((p, i) => (
              <FadeIn key={p.name} delay={i * 80}>
                <article className="group">
                  <div className="aspect-[4/5] overflow-hidden rounded-sm bg-[#F1ECE5]">
                    <img
                      src={p.img}
                      alt={`Maison Hygia ${p.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-2xl text-foreground">
                      {p.name}
                    </h3>
                    {p.hero && (
                      <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
                        Hero
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-sm text-cocoa leading-relaxed">
                    {p.blurb}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

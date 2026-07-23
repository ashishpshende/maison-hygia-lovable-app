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
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F1EAE0]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:min-h-[76vh] md:grid-cols-12 md:gap-12 md:px-10 md:py-20">
          {/* Left copy */}
          <FadeIn className="md:col-span-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
              The Collection
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
              Botanical
              <br />
              <span className="italic text-gold">Beauty.</span>
            </h1>
            <p className="mt-8 max-w-md font-serif text-xl leading-snug text-cocoa md:text-2xl">
              Everyday rituals for skin, hair and body.
            </p>
            <p className="mt-6 max-w-md text-base leading-[1.9] text-foreground/70">
              Thoughtfully crafted formulations inspired by nature and designed
              for modern living.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-cocoa text-cream hover:bg-cocoa/90"
              >
                <a href="#collection">Shop Collection</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-cocoa/30 text-cocoa hover:bg-cocoa/5"
              >
                <Link to="/story">Our Philosophy</Link>
              </Button>
            </div>
          </FadeIn>

          {/* Right: editorial trio */}
          <FadeIn delay={120} className="md:col-span-7">
            <div className="relative grid grid-cols-12 gap-4 md:gap-6">
              <div className="col-span-6 col-start-1 row-start-1 aspect-[3/4] overflow-hidden rounded-sm bg-[#E8DFD1] md:col-span-5">
                <img
                  src={bodyWashAsset.url}
                  alt="Maison Hygia Body Wash on travertine with linen"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="col-span-6 col-start-7 row-start-1 mt-10 aspect-[3/4] overflow-hidden rounded-sm bg-[#E8DFD1] md:col-span-5 md:col-start-6 md:mt-16">
                <img
                  src={faceSerumAsset.url}
                  alt="Maison Hygia Face Serum with botanicals"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="col-span-8 col-start-3 row-start-2 -mt-6 aspect-[4/3] overflow-hidden rounded-sm bg-[#E8DFD1] md:col-span-5 md:col-start-8 md:-mt-24">
                <img
                  src={bodyLotion}
                  alt="Maison Hygia Body Lotion on travertine"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </FadeIn>
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

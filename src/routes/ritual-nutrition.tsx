import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart, parsePriceCents } from "@/lib/cart-context";
import { NewsletterInline } from "@/components/NewsletterInline";
import { Sparkles } from "lucide-react";
import heroAsset from "@/assets/founder-collection-hero.png.asset.json";
import roseSaffronAsset from "@/assets/rose-saffron-clusters.png.asset.json";
import heritageCashewAsset from "@/assets/heritage-cashew-clusters.png.asset.json";
import goldenMakhanaAsset from "@/assets/golden-glow-makhana.png.asset.json";
import royalTrailMixAsset from "@/assets/royal-heritage-trail-mix.png.asset.json";
import calmDatesAsset from "@/assets/calm-filled-dates.png.asset.json";
import stayCloseAsset from "@/assets/stay-close.jpg.asset.json";

const COMING_SOON: { name: string; note: string }[] = [
  { name: "Calm Filled Dates", note: "Soft dates with warm spice and golden honey" },
  { name: "Heritage Trail Mix", note: "A mindful blend of nuts, seeds and dried fruit" },
  { name: "Saffron Granola", note: "Slow-toasted clusters with cardamom and rose" },
  { name: "Rose Petal Brittle", note: "Delicate crunch with floral notes" },
  { name: "Spiced Energy Bites", note: "Dates, cacao and Ayurvedic spices" },
  { name: "Golden Turmeric Nuts", note: "Anti-inflammatory spiced almonds and cashews" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export const Route = createFileRoute("/ritual-nutrition")({
  head: () => ({
    meta: [
      { title: "Ritual Nutrition — Maison Hygia" },
      {
        name: "description",
        content:
          "Thoughtfully crafted ritual snacks — Rose Saffron Almond Clusters, Heritage Cashew Clusters, and Golden Glow Makhana — designed to nourish your everyday rituals.",
      },
      { property: "og:title", content: "Ritual Nutrition — Maison Hygia" },
      {
        property: "og:description",
        content:
          "Thoughtfully crafted ritual snacks designed to nourish your everyday rituals.",
      },
      { property: "og:image", content: heroAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroAsset.url },
    ],
    links: [{ rel: "canonical", href: "/ritual-nutrition" }],
  }),
  component: RitualNutritionPage,
});

type Ritual = "Glow" | "Daily" | "Celebration";

type Product = {
  slug: string;
  name: string;
  size: string;
  blurb: string;
  priceLabel: string;
  img: string;
};

const RITUALS: Record<Ritual, Product[]> = {
  Glow: [
    {
      slug: "golden-glow-makhana",
      name: "Golden Glow Makhana",
      size: "70 g",
      blurb: "Roasted fox nuts with turmeric, saffron and a whisper of black pepper.",
      priceLabel: "$14",
      img: goldenMakhanaAsset.url,
    },
  ],
  Daily: [
    {
      slug: "rose-saffron-almond-clusters",
      name: "Rose Saffron Almond Clusters",
      size: "80 g",
      blurb: "Crisp almonds bound with saffron, rose and cardamom.",
      priceLabel: "$18",
      img: roseSaffronAsset.url,
    },
    {
      slug: "heritage-spice-cashew-clusters",
      name: "Heritage Spice Cashew Clusters",
      size: "90 g",
      blurb: "Whole cashews with ginger, turmeric, black pepper and sesame.",
      priceLabel: "$18",
      img: heritageCashewAsset.url,
    },
  ],
  Celebration: [
    {
      slug: "royal-heritage-trail-mix",
      name: "Royal Heritage Trail Mix",
      size: "100 g",
      blurb: "Pistachios, almonds and walnuts with dried cocoa, rose, cardamom and saffron.",
      priceLabel: "$22",
      img: royalTrailMixAsset.url,
    },
    {
      slug: "calm-filled-dates",
      name: "Calm Filled Dates",
      size: "8 pieces",
      blurb: "Medjool dates filled with ashwagandha, saffron and almonds — a moment of calm.",
      priceLabel: "$26",
      img: calmDatesAsset.url,
    },
  ],
};

const RITUAL_ORDER: Ritual[] = ["Glow", "Daily", "Celebration"];

function RitualNutritionPage() {
  const [active, setActive] = useState<Ritual>("Glow");
  const cart = useCart();
  const products = RITUALS[active];

  const handleAdd = (p: Product) => {
    cart.add({
      productId: p.slug,
      slug: p.slug,
      name: p.name,
      priceCents: parsePriceCents(p.priceLabel),
      priceLabel: p.priceLabel,
      imageUrl: p.img || "",
    });
    cart.openCart();
    toast.success(`${p.name} added to your ritual`);
  };

  return (
    <div className="bg-cream">
      {/* HERO — split-screen editorial */}
      <section className="relative overflow-hidden bg-[#F4EEE4]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:min-h-[78vh] md:grid-cols-2 md:gap-16 md:px-10 md:py-24">
          <FadeIn className="max-w-xl">
            <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.28em] text-cocoa/60">
              <ol className="flex items-center gap-3">
                <li>
                  <Link to="/" className="transition-colors hover:text-cocoa">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-cocoa/40">/</li>
                <li className="text-cocoa">Founder Collection</li>
              </ol>
            </nav>

            <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
              Founder Collection
            </p>
            <h1 className="mt-8 font-serif text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
              Everyday Snacking,
              <br />
              <span className="italic text-gold">Elevated into Ritual.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-[1.9] text-foreground/70 md:text-lg">
              A thoughtfully curated collection of premium nuts, seeds, dates, and
              makhana—crafted with exceptional ingredients to transform everyday
              snacking into a beautiful daily ritual.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button
                size="lg"
                onClick={() => scrollToId("rituals")}
                className="bg-cocoa text-cream hover:bg-cocoa/90"
              >
                Shop Collection
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

          <FadeIn delay={120}>
            <div className="relative overflow-hidden rounded-sm bg-[#EFE6D8] shadow-[0_30px_80px_-40px_rgba(60,40,20,0.35)]">
              <img
                src={heroAsset.url}
                alt="Maison Hygia Founder Collection — premium nuts, seeds, dates and makhana arranged on warm travertine with linen and botanicals"
                className="h-full w-full object-cover"
                loading="eager"
                width={1280}
                height={1600}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 2 — Shop by Ritual */}
      <section id="rituals" className="border-t border-border/50 bg-[#FBF7F0]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <FadeIn className="text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
              Ritual Nutrition
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Shop by Ritual
            </h2>
            <p className="mt-4 text-cocoa/75">
              Find the ritual that fits your moment.
            </p>
          </FadeIn>

          {/* Tabs */}
          <div className="mt-12 flex justify-center">
            <div
              role="tablist"
              aria-label="Shop by ritual"
              className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-cocoa/15 bg-cream p-1.5"
            >
              {RITUAL_ORDER.map((r) => {
                const isActive = r === active;
                return (
                  <button
                    key={r}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(r)}
                    className={
                      "rounded-full px-6 py-2.5 text-xs uppercase tracking-[0.28em] transition-all duration-300 md:text-sm " +
                      (isActive
                        ? "bg-gold text-cream shadow-[0_10px_30px_-15px_rgba(180,140,60,0.7)]"
                        : "text-cocoa/70 hover:text-cocoa")
                    }
                  >
                    {r} Ritual
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products */}
          <div
            key={active}
            className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14"
          >
            {products.map((p, i) => (
              <FadeIn key={p.slug} delay={i * 90}>
                <article className="group flex flex-col">
                  <div className="aspect-[4/5] overflow-hidden rounded-sm bg-gradient-to-br from-[#F6EFE3] via-[#F1E7D5] to-[#E8DAC2]">
                    {p.img ? (
                      <img
                        src={p.img}
                        alt={`Maison Hygia ${p.name}`}
                        loading="lazy"
                        className="h-full w-full object-cover mix-blend-multiply transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gold">
                        <Sparkles className="h-10 w-10" strokeWidth={1.4} />
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl text-foreground md:text-3xl">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-cocoa/60">
                        {p.size}
                      </p>
                    </div>
                    <p className="font-serif text-xl text-foreground">{p.priceLabel}</p>
                  </div>
                  <p className="mt-3 max-w-md leading-relaxed text-cocoa/80">
                    {p.blurb}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      className="border-cocoa/30 bg-transparent text-cocoa hover:border-gold hover:text-gold"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleAdd(p)}
                      className="bg-cocoa text-cream hover:bg-cocoa/90"
                    >
                      Add to Bag
                    </Button>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — The Next Rituals */}
      <section className="border-t border-border/50 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <FadeIn className="text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
              Looking Ahead
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              The Next Rituals
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cocoa/75">
              Ritual Nutrition is an evolving collection. We're thoughtfully
              developing new snacks to complement the rhythms of your day.
            </p>
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COMING_SOON.map((item, i) => (
              <FadeIn key={item.name} delay={i * 60}>
                <div className="group flex h-full flex-col items-center rounded-sm border border-cocoa/10 bg-[#FBF7F0] px-6 py-10 text-center transition-all duration-500 hover:border-gold/40 hover:shadow-[0_20px_50px_-30px_rgba(180,140,60,0.4)]">
                  <div className="flex h-40 w-40 items-center justify-center rounded-full border border-gold/30 bg-cream text-gold transition-transform duration-500 group-hover:scale-105">
                    <Sparkles className="h-6 w-6" strokeWidth={1.4} />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-cocoa/65">{item.note}</p>
                  <span className="mt-6 inline-block rounded-full border border-gold/40 bg-transparent px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
                    Coming Soon
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-16 text-center">
            <p className="text-sm italic text-cocoa/60">
              More thoughtfully crafted snacks will be introduced over time.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stay Close to the Maison — cinematic newsletter */}
      <section className="relative isolate w-full overflow-hidden bg-ivory">
        <div className="relative min-h-[560px] w-full md:min-h-[680px] lg:min-h-[760px]">
          <img
            src={stayCloseAsset.url}
            alt="A linen-covered breakfast table with Maison Hygia body wash on a stone tray, a bowl of rose saffron almond clusters, and fresh botanicals in soft morning light"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            width={1920}
            height={1088}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/70 to-transparent md:from-cream/90 md:via-cream/50"
          />
          <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-24 md:min-h-[680px] md:px-10 md:py-32 lg:min-h-[760px]">
            <FadeIn className="max-w-xl">
              <div aria-hidden className="h-px w-12 bg-gold/70" />
              <p className="mt-8 text-xs uppercase tracking-[0.42em] text-gold">
                Maison Hygia
              </p>
              <h2 className="mt-6 font-serif text-4xl leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
                Stay Close to the{" "}
                <span className="italic text-gold">Maison.</span>
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-muted-foreground md:text-lg">
                Be the first to discover new rituals, limited collections,
                thoughtful stories, and moments designed to inspire everyday
                living.
              </p>
              <div className="mt-10">
                <NewsletterInline source="ritual_nutrition_stay_close" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

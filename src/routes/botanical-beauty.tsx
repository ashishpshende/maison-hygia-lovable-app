import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart, parsePriceCents } from "@/lib/cart-context";
import bodyWashAsset from "@/assets/MH_Body_Wash-3.png.asset.json";
import bodyLotionAsset from "@/assets/MH_Body_Lotion.png.asset.json";
import faceWashAsset from "@/assets/MH_Face_Wash.png.asset.json";
import faceSerumAsset from "@/assets/MH_Face_Serem-2.png.asset.json";
import shampooAsset from "@/assets/MH_Shampoo.png.asset.json";
import conditionerAsset from "@/assets/MH_Hair_Conditioner.png.asset.json";
import collectionHero from "@/assets/mh-collection-hero.png.asset.json";
import stayCloseAsset from "@/assets/stay-close.jpg.asset.json";
import { NewsletterInline } from "@/components/NewsletterInline";
import { Sparkles } from "lucide-react";

const COMING_SOON = [
  { name: "Bath Salt", note: "Muscle relaxation + detox" },
  { name: "Bath Soak", note: "Skin-conditioning soak" },
  { name: "Body Scrub", note: "Oil-based Ayurvedic exfoliation" },
  { name: "Face Scrub", note: "Gentle daily exfoliation" },
  { name: "Face Mask", note: "Deep cleansing & glow revival" },
  { name: "Face Moisturizer", note: "Nourishing daily hydration" },
  { name: "Face Toner", note: "Hydrating botanical toner" },
  { name: "Hair Serum", note: "Lightweight anti-frizz care" },
  { name: "Hand Lotion", note: "Softening golden glow blend" },
  { name: "Body Oil", note: "Nourishing Ayurvedic blend" },
  { name: "Sheet Mask", note: "Intense hydration & radiance" },
];

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

type Ritual = "Body Care" | "Face Care" | "Hair Care";

type Product = {
  slug: string;
  name: string;
  size: string;
  blurb: string;
  priceLabel: string;
  img: string;
};

const RITUALS: Record<Ritual, Product[]> = {
  "Body Care": [
    {
      slug: "body-wash",
      name: "Body Wash",
      size: "300 ml",
      blurb: "A gentle botanical cleanser that refreshes without stripping the skin.",
      priceLabel: "$32",
      img: bodyWashAsset.url,
    },
    {
      slug: "body-lotion",
      name: "Body Lotion",
      size: "300 ml",
      blurb: "Lightweight daily hydration with a silky, nourishing finish.",
      priceLabel: "$36",
      img: bodyLotionAsset.url,
    },
  ],
  "Face Care": [
    {
      slug: "face-wash",
      name: "Face Wash",
      size: "150 ml",
      blurb: "Hydrating, non-stripping cleanser for a soft, balanced complexion.",
      priceLabel: "$34",
      img: faceWashAsset.url,
    },
    {
      slug: "face-serum",
      name: "Face Serum",
      size: "30 ml",
      blurb: "Barrier repair with even tone and quiet, radiant skin.",
      priceLabel: "$62",
      img: faceSerumAsset.url,
    },
  ],
  "Hair Care": [
    {
      slug: "shampoo",
      name: "Shampoo",
      size: "350 ml",
      blurb: "Gentle scalp cleanser for hair fall care and barrier repair.",
      priceLabel: "$28",
      img: shampooAsset.url,
    },
    {
      slug: "conditioner",
      name: "Conditioner",
      size: "350 ml",
      blurb: "Lightweight repair conditioner for scalp health and strand strength.",
      priceLabel: "$28",
      img: conditionerAsset.url,
    },
  ],
};

const RITUAL_ORDER: Ritual[] = ["Body Care", "Face Care", "Hair Care"];

function BotanicalBeautyPage() {
  const [active, setActive] = useState<Ritual>("Body Care");
  const cart = useCart();
  const products = RITUALS[active];

  const handleAdd = (p: Product) => {
    cart.add({
      productId: p.slug,
      slug: p.slug,
      name: p.name,
      priceCents: parsePriceCents(p.priceLabel),
      priceLabel: p.priceLabel,
      imageUrl: p.img,
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
                onClick={() => scrollToId("rituals")}
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

      {/* SECTION 2 — Shop by Ritual */}
      <section id="rituals" className="border-t border-border/50 bg-[#FBF7F0]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <FadeIn className="text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
              Explore the Collection
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Shop by Ritual
            </h2>
            <p className="mt-4 text-cocoa/75">
              Choose a ritual to explore the collection.
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
                    {r}
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
                    <img
                      src={p.img}
                      alt={`Maison Hygia ${p.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover mix-blend-multiply transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    />
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
                  <p className="mt-3 max-w-md text-cocoa/80 leading-relaxed">
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
    </div>
  );
}

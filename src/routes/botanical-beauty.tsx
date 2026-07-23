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
import bathSaltAsset from "@/assets/MH_Bath_Salt-2.png.asset.json";
import bodyOilAsset from "@/assets/MH_Body_Oil-2.png.asset.json";
import bodyScrubAsset from "@/assets/MH_Body_Scrub-2.png.asset.json";
import faceMaskAsset from "@/assets/MH_Face_Mask-2.png.asset.json";
import faceScrubAsset from "@/assets/MH_Face_Scrub-2.png.asset.json";
import faceTonerAsset from "@/assets/MH_Face_Toner-2.png.asset.json";
import handLotionAsset from "@/assets/MH_Hand_Lotion-2.png.asset.json";
import sheetMaskAsset from "@/assets/MH_Sheet_Mask-2.png.asset.json";
import faceMoisturizerAsset from "@/assets/MH_Face_Moisturizer.png.asset.json";
import nightCreamAsset from "@/assets/MH_Night_Cream.png.asset.json";
import { NewsletterInline } from "@/components/NewsletterInline";
import { Sparkles } from "lucide-react";

const COMING_SOON: { name: string; note: string; img?: string }[] = [
  { name: "Bath Salt", note: "Muscle relaxation + detox", img: bathSaltAsset.url },
  { name: "Body Scrub", note: "Oil-based Ayurvedic exfoliation", img: bodyScrubAsset.url },
  { name: "Body Oil", note: "Nourishing Ayurvedic blend", img: bodyOilAsset.url },
  { name: "Hand Lotion", note: "Softening golden glow blend", img: handLotionAsset.url },
  { name: "Face Scrub", note: "Gentle daily exfoliation", img: faceScrubAsset.url },
  { name: "Face Mask", note: "Deep cleansing & glow revival", img: faceMaskAsset.url },
  { name: "Face Toner", note: "Hydrating botanical toner", img: faceTonerAsset.url },
  { name: "Face Moisturizer", note: "Nourishing daily hydration", img: faceMoisturizerAsset.url },
  { name: "Night Cream", note: "Nourishing overnight repair", img: nightCreamAsset.url },
  { name: "Sheet Mask", note: "Intense hydration & radiance", img: sheetMaskAsset.url },
  { name: "Bath Soak", note: "Skin-conditioning soak" },
  { name: "Hair Serum", note: "Lightweight anti-frizz care" },
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
            <p className="mx-auto mt-6 max-w-2xl text-cocoa/75 leading-relaxed">
              Botanical Beauty is an evolving collection. We're thoughtfully
              developing new rituals to complement your everyday routine.
            </p>
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COMING_SOON.map((item, i) => (
              <FadeIn key={item.name} delay={i * 60}>
                <div className="group flex h-full flex-col items-center rounded-sm border border-cocoa/10 bg-[#FBF7F0] px-6 py-10 text-center transition-all duration-500 hover:border-gold/40 hover:shadow-[0_20px_50px_-30px_rgba(180,140,60,0.4)]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-cream text-gold transition-transform duration-500 group-hover:scale-105">
                    <Sparkles className="h-5 w-5" strokeWidth={1.4} />
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
              More thoughtfully crafted rituals will be introduced over time.
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
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                Be the first to discover new rituals, limited collections,
                thoughtful stories, and moments designed to inspire everyday
                living.
              </p>
              <div className="mt-10">
                <NewsletterInline source="botanical_beauty_stay_close" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

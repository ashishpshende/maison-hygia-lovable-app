import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, HeartHandshake, Sparkles, Sprout, Sun } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { NewsletterInline } from "@/components/NewsletterInline";
import stayCloseAsset from "@/assets/stay-close.jpg.asset.json";
import heroAsset from "@/assets/hero-products.png.asset.json";
import bodyWashAsset from "@/assets/body-wash.png.asset.json";
import sheetMaskAsset from "@/assets/sheet-mask.png.asset.json";
import catalogAsset from "@/assets/catalog.png.asset.json";
import lifestyleGlowAsset from "@/assets/lifestyle-glow.png.asset.json";
import lifestyleNourishAsset from "@/assets/lifestyle-nourish.png.asset.json";
import lifestyleCareAsset from "@/assets/lifestyle-care.png.asset.json";
import lifestyleGatherAsset from "@/assets/lifestyle-gather.png.asset.json";
import lifestylePauseAsset from "@/assets/lifestyle-pause.png.asset.json";
import worldBodyRitualsAsset from "@/assets/world-body-rituals.png.asset.json";
import worldSnacksAsset from "@/assets/world-snacks.png.asset.json";
import craftSourced from "@/assets/craft-sourced.jpg";
import craftCrafted from "@/assets/craft-crafted.jpg";
import craftDesigned from "@/assets/craft-designed.jpg";
import craftEveryday from "@/assets/craft-everyday.jpg";

const hero = heroAsset.url;
const bodyWash = bodyWashAsset.url;
const sheetMask = sheetMaskAsset.url;
const catalog = catalogAsset.url;
const lifestyleGlow = lifestyleGlowAsset.url;
const lifestyleNourish = lifestyleNourishAsset.url;
const lifestyleCare = lifestyleCareAsset.url;
const lifestyleGather = lifestyleGatherAsset.url;
const lifestylePause = lifestylePauseAsset.url;
const worldBodyRituals = worldBodyRitualsAsset.url;
const worldSnacks = worldSnacksAsset.url;

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
        <div className="relative w-full">
          <img
            src={hero}
            alt="Maison Hygia founder's collection — body wash, shampoo, face serum, ritual clusters, makhana and calm-filled dates on warm stone"
            className="block h-auto w-full object-contain animate-[fade-in_1.4s_ease-out_both] md:animate-[hero-float_14s_ease-in-out_infinite]"
            loading="eager"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/60 to-transparent md:from-cream/85 md:via-cream/25"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream to-transparent"
          />

          <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl items-center px-6 py-10 md:px-10">
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

      {/* Section 1: The Maison Hygia Ritual */}
      <section id="ritual" className="relative bg-ivory px-6 md:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cream to-ivory"
        />
        <FadeIn as="section" className="relative z-10 mx-auto flex max-w-3xl flex-col items-center py-28 text-center md:py-40 lg:py-48">
          <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
            The Maison Hygia Ritual
          </p>

          <h2 className="mt-8 font-serif text-3xl leading-[1.2] text-foreground md:text-5xl lg:text-[3.25rem]">
            More Than Products.
            <br />
            A Daily Ritual.
          </h2>

          <p className="mt-10 max-w-2xl text-base leading-[1.9] text-foreground/70 md:text-lg">
            At Maison Hygia, beauty doesn't begin with skincare alone. It begins
            with the rituals you choose every day—from what you nourish your
            body with to how you care for your skin. We believe wellness is most
            powerful when every moment becomes intentional.
          </p>
        </FadeIn>
      </section>

      {/* Lifestyle panels — Ritual moments */}
      <section className="relative bg-ivory px-6 md:px-10">
        <div className="mx-auto max-w-7xl py-28 md:py-40 lg:py-48">
          <FadeIn className="mx-auto mb-20 max-w-2xl text-center md:mb-28">
            <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
              The moments that make it
            </p>
            <h2 className="mt-8 font-serif text-3xl leading-[1.2] text-foreground md:text-5xl lg:text-[3.25rem]">
              Ritual is not a routine.
              <br />
              <span className="italic text-gold">It is a feeling.</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
            {/* Glow */}
            <FadeIn className="group relative col-span-1 overflow-hidden rounded-sm md:col-span-2 md:row-span-2">
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-full md:min-h-[720px]">
                <img
                  src={lifestyleGlow}
                  alt="Woman reading in golden morning light with tea and Golden Glow Makhana"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 via-cocoa/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                  <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-soft">Glow</p>
                  <h3 className="mt-4 font-serif text-3xl text-primary-foreground md:text-4xl lg:text-5xl">
                    Begin beautifully.
                  </h3>
                </div>
              </div>
            </FadeIn>

            {/* Nourish */}
            <FadeIn className="group relative col-span-1 overflow-hidden rounded-sm">
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4] lg:aspect-[4/5]">
                <img
                  src={lifestyleNourish}
                  alt="Breakfast table with Rose Saffron Almond Clusters, fresh flowers, and journal"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/55 via-cocoa/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-soft">Nourish</p>
                  <h3 className="mt-3 font-serif text-2xl text-primary-foreground md:text-3xl">
                    Feed your body with intention.
                  </h3>
                </div>
              </div>
            </FadeIn>

            {/* Care */}
            <FadeIn className="group relative col-span-1 overflow-hidden rounded-sm">
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4] lg:aspect-[4/5]">
                <img
                  src={lifestyleCare}
                  alt="Serene bathroom with Face Serum, linen towel, and stone basin"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/55 via-cocoa/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-soft">Care</p>
                  <h3 className="mt-3 font-serif text-2xl text-primary-foreground md:text-3xl">
                    Care for what carries you.
                  </h3>
                </div>
              </div>
            </FadeIn>

            {/* Gather */}
            <FadeIn className="group relative col-span-1 overflow-hidden rounded-sm md:col-span-2">
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/9]">
                <img
                  src={lifestyleGather}
                  alt="Friends sharing Heritage Cashew Clusters around a warm candlelit table"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 via-cocoa/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                  <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-soft">Gather</p>
                  <h3 className="mt-4 font-serif text-3xl text-primary-foreground md:text-4xl lg:text-5xl">
                    Rituals are better together.
                  </h3>
                </div>
              </div>
            </FadeIn>

            {/* Pause */}
            <FadeIn className="group relative col-span-1 overflow-hidden rounded-sm md:col-span-1">
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4] lg:aspect-[4/5]">
                <img
                  src={lifestylePause}
                  alt="Evening pause with Calm Filled Dates, tea, candle, and open book"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/55 via-cocoa/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-soft">Pause</p>
                  <h3 className="mt-3 font-serif text-2xl text-primary-foreground md:text-3xl">
                    Slow down beautifully.
                  </h3>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 2: The Founder Collection — two worlds */}
      <section className="relative bg-cream px-6 md:px-10">
        <div className="mx-auto max-w-7xl py-28 md:py-40 lg:py-48">
          <FadeIn className="mx-auto mb-20 max-w-2xl text-center md:mb-28">
            <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
              The Founder Collection
            </p>
            <h2 className="mt-8 font-serif text-3xl leading-[1.2] text-foreground md:text-5xl lg:text-[3.25rem]">
              Two worlds. One ritual.
            </h2>
          </FadeIn>

          {/* Botanical Beauty */}
          <FadeIn className="group grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
            <div className="relative overflow-hidden rounded-sm">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={worldBodyRituals}
                  alt="Maison Hygia Botanical Beauty — body wash in a serene bathroom setting"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="flex flex-col items-start md:py-12">
              <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
                Botanical Beauty
              </p>
              <h3 className="mt-6 font-serif text-3xl leading-[1.15] text-foreground md:text-4xl lg:text-5xl">
                Care, made into ritual.
              </h3>
              <p className="mt-8 max-w-md text-base leading-[1.9] text-foreground/70 md:text-lg">
                Slow-crafted cleansers and essentials that turn everyday moments into something intentional. For skin that feels nurtured, not stripped.
              </p>
              <Link
                to="/shop"
                className="mt-10 inline-flex items-center gap-3 border-b border-gold pb-1 text-xs uppercase tracking-[0.28em] text-cocoa transition-all duration-500 hover:text-gold"
              >
                Discover
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </FadeIn>

          {/* Next — Founder Ritual Snacks */}
          <FadeIn className="group mt-24 grid grid-cols-1 items-center gap-8 md:mt-32 md:grid-cols-2 md:gap-12 lg:mt-40 lg:gap-20">
            <div className="order-2 flex flex-col items-start md:order-1 md:py-12">
              <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
                Founder Ritual Snacks
              </p>
              <h3 className="mt-6 font-serif text-3xl leading-[1.15] text-foreground md:text-4xl lg:text-5xl">
                Nourishment, reimagined.
              </h3>
              <p className="mt-8 max-w-md text-base leading-[1.9] text-foreground/70 md:text-lg">
                Rose Saffron Almond Clusters and heritage-inspired bites made to accompany your rituals — beautiful enough to share, wholesome enough to savor.
              </p>
              <Link
                to="/shop"
                className="mt-10 inline-flex items-center gap-3 border-b border-gold pb-1 text-xs uppercase tracking-[0.28em] text-cocoa transition-all duration-500 hover:text-gold"
              >
                Discover
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div className="relative order-1 overflow-hidden rounded-sm md:order-2">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={worldSnacks}
                  alt="Maison Hygia Founder Ritual Snacks — Rose Saffron Almond Clusters"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 3: Crafted With Intention */}
      <section className="relative bg-ivory px-6 md:px-10">
        <div className="mx-auto max-w-7xl py-28 md:py-40 lg:py-48">
          <FadeIn className="mx-auto mb-20 max-w-2xl text-center md:mb-28">
            <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold">
              The Making
            </p>
            <h2 className="mt-8 font-serif text-3xl leading-[1.2] text-foreground md:text-5xl lg:text-[3.25rem]">
              Crafted With Intention
            </h2>
            <p className="mt-10 text-base leading-[1.9] text-foreground/70 md:text-lg">
              Every Maison Hygia ritual begins long before it reaches your home—from
              thoughtful sourcing and careful formulation to beautiful design and
              everyday usability.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
            {[
              {
                image: craftSourced,
                alt: "Premium almonds, saffron threads, makhana and fresh herbs on warm linen",
                title: "Thoughtfully Sourced",
                copy: "We carefully select ingredients for their quality, purity and character, creating rituals inspired by nature and designed for modern living.",
              },
              {
                image: craftCrafted,
                alt: "Artisan hands formulating luxury cream in glass beakers on a stainless steel surface",
                title: "Beautifully Crafted",
                copy: "Every formulation is designed to balance efficacy, sensory experience and timeless simplicity.",
              },
              {
                image: craftDesigned,
                alt: "Cream-colored premium packaging with gold foil monogram, ribbon and textured paper",
                title: "Designed to Delight",
                copy: "From the first touch to the final ritual, every detail is created to feel thoughtful, elegant and lasting.",
              },
              {
                image: craftEveryday,
                alt: "Bathroom counter with skincare bottle, morning tea, snack bowl and linen on a wooden tray",
                title: "Made for Everyday Rituals",
                copy: "Wellness becomes meaningful when beautiful products become part of everyday life.",
              },
            ].map((panel, i) => (
              <FadeIn
                key={panel.title}
                delay={i * 120}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <img
                    src={panel.image}
                    alt={panel.alt}
                    width={1024}
                    height={1280}
                    className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-8 font-serif text-2xl leading-[1.2] text-foreground md:text-[1.75rem]">
                  {panel.title}
                </h3>
                <p className="mt-4 text-sm leading-[1.9] text-foreground/70 md:text-base">
                  {panel.copy}
                </p>
              </FadeIn>
            ))}
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
                <NewsletterInline source="stay_close" />
              </div>
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

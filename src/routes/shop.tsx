import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/FadeIn";
import bodyWashAsset from "@/assets/body-wash.png.asset.json";
import sheetMaskAsset from "@/assets/sheet-mask.png.asset.json";
import catalogAsset from "@/assets/catalog.png.asset.json";

const bodyWash = bodyWashAsset.url;
const sheetMask = sheetMaskAsset.url;
const catalog = catalogAsset.url;

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Maison Hygia" },
      {
        name: "description",
        content:
          "The Maison Hygia collection — Ayurveda-rooted body wash, sheet masks, face and hair care. Slow-crafted in small batches.",
      },
      { property: "og:title", content: "Shop — Maison Hygia" },
      {
        property: "og:description",
        content:
          "Ayurveda-rooted body wash, sheet masks, face and hair care, slow-crafted in small batches.",
      },
      { property: "og:url", content: "/shop" },
      { property: "og:image", content: catalog },
      { name: "twitter:image", content: catalog },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

type Product = {
  slug: string;
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  notes: string;
  size: string;
  price: string;
  image: string;
  alt: string;
  comingSoon?: boolean;
};

const products: Product[] = [
  {
    slug: "body-wash",
    eyebrow: "Daily Cleanse",
    name: "Body Wash",
    tagline: "A Gentle Start",
    description:
      "A non-stripping Ayurvedic cleanser for daily barrier care. Lathers softly, rinses clean, leaves the skin breathing.",
    notes: "Ayurvedic Botanicals · Plant Surfactants · Barrier Care",
    size: "500 ml / 16 oz.",
    price: "$34",
    image: bodyWash,
    alt: "Maison Hygia Body Wash in an amber glass bottle with a gold pump and wood collar, on warm stone",
  },
  {
    slug: "sheet-mask-golden-glow",
    eyebrow: "Ritual Glow",
    name: "Sheet Mask — Golden Glow Blend",
    tagline: "A Slower Pause",
    description:
      "Fifteen quiet minutes for the skin. A single-use cotton mask saturated in the Golden Glow Blend — a warm, turmeric-led serum for luminous calm.",
    notes: "Turmeric · Saffron · Hyaluronic Acid",
    size: "1 mask · 25 ml serum",
    price: "$12",
    image: sheetMask,
    alt: "Maison Hygia Golden Glow Blend sheet mask in an amber-gold sachet beside a cotton sheet mask",
  },
  {
    slug: "the-collection",
    eyebrow: "The Full Ritual",
    name: "The Maison Hygia Collection",
    tagline: "A Quiet Shelf",
    description:
      "Eleven slow-crafted essentials — body wash, bath salt, bath soak, body scrub, face wash, face scrub, face serum, shampoo, conditioner, hair serum, and sheet mask. Available together as the full ritual, launching soon.",
    notes: "11 Pieces · Skin · Hair · Bath",
    size: "Full Collection",
    price: "—",
    image: catalog,
    alt: "Maison Hygia full product catalog — body wash, bath salt, bath soak, body scrub, face wash, face scrub, face serum, shampoo, conditioner, and hair serum",
    comingSoon: true,
  },
];

function ShopPage() {
  return (
    <div className="bg-cream">
      <FadeIn immediate as="section" className="px-6 md:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center pb-20 pt-32 text-center md:pt-40">
          <p className="text-xs uppercase tracking-[0.42em] text-gold md:text-sm">
            The Collection
          </p>
          <h1 className="mt-8 font-serif text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            A quiet shelf
            <br />
            of <span className="italic text-gold">rituals.</span>
          </h1>
          <div aria-hidden className="mx-auto my-10 h-px w-12 bg-gold/60" />
          <p className="max-w-xl text-base leading-[1.9] text-foreground/70 md:text-lg">
            Small-batch and slow-crafted — each piece in the Maison Hygia
            collection is rooted in{" "}
            <span className="text-gold">Ayurveda</span> and made for the rhythm
            of modern living.
          </p>
        </div>
      </FadeIn>

      <FadeIn as="section" className="px-6 md:px-10">
        <div className="mx-auto max-w-7xl pb-32 md:pb-40">
          <div className="space-y-32 md:space-y-40">
            {products.map((product, idx) => (
              <ProductRow key={product.slug} product={product} index={idx} />
            ))}
          </div>
        </div>
      </FadeIn>

      <section className="relative isolate overflow-hidden bg-cream">
        <div className="relative h-[60vh] min-h-[420px] w-full md:h-[70vh]">
          <img
            src={catalog}
            alt="The Maison Hygia collection on warm stone with dried botanicals"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-cream/30 via-cream/15 to-cream/40"
          />
          <div className="relative z-10 mx-auto flex h-full max-w-4xl items-center justify-center px-6 md:px-10">
            <FadeIn className="text-center">
              <div aria-hidden className="mx-auto h-px w-12 bg-gold/60" />
              <p className="mx-auto mt-10 max-w-2xl font-serif text-2xl leading-[1.4] text-foreground md:text-3xl lg:text-[2.25rem] lg:leading-[1.35]">
                Made slowly. In small batches.{" "}
                <span className="italic text-gold">With care.</span>
              </p>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                <Link
                  to="/story"
                  className="border-b border-gold/60 pb-1 text-xs uppercase tracking-[0.28em] text-foreground transition-colors hover:border-foreground"
                >
                  Our Story
                </Link>
                <Link
                  to="/contact"
                  className="border-b border-gold/60 pb-1 text-xs uppercase tracking-[0.28em] text-foreground transition-colors hover:border-foreground"
                >
                  Contact
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductRow({ product, index }: { product: Product; index: number }) {
  const imageFirst = index % 2 === 0;

  return (
    <article className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
      <div className={imageFirst ? "order-1" : "order-1 md:order-2"}>
        <div className="overflow-hidden bg-cream">
          <img
            src={product.image}
            alt={product.alt}
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div
        className={
          imageFirst ? "order-2 md:px-4" : "order-2 md:order-1 md:px-4"
        }
      >
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
          {product.eyebrow}
        </p>
        <h2 className="mt-5 font-serif text-3xl text-foreground md:text-4xl lg:text-[2.5rem]">
          {product.tagline}
        </h2>
        <p className="mt-3 font-serif text-lg italic text-foreground/60 md:text-xl">
          {product.name}
        </p>
        <div aria-hidden className="my-8 h-px w-12 bg-gold/50" />
        <p className="max-w-md text-sm leading-[1.9] text-foreground/70 md:text-base">
          {product.description}
        </p>

        <dl className="mt-8 max-w-md space-y-3 text-xs uppercase tracking-[0.2em] text-foreground/60">
          <div className="flex items-baseline justify-between gap-6 border-b border-gold/20 pb-3">
            <dt>Notes</dt>
            <dd className="text-right normal-case tracking-normal text-foreground/75">
              {product.notes}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-gold/20 pb-3">
            <dt>Size</dt>
            <dd className="text-right normal-case tracking-normal text-foreground/75">
              {product.size}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 pb-1">
            <dt>Price</dt>
            <dd className="font-serif text-lg normal-case tracking-normal text-foreground">
              {product.price}
            </dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          {product.comingSoon ? (
            <span
              aria-disabled="true"
              className="inline-flex cursor-default items-center gap-3 border border-gold/50 bg-transparent px-8 py-4 text-xs uppercase tracking-[0.28em] text-gold"
            >
              Launching Soon
            </span>
          ) : (
            <button
              type="button"
              className="group inline-flex items-center gap-3 border border-cocoa bg-cocoa px-8 py-4 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-all duration-500 hover:border-cocoa-soft hover:bg-cocoa-soft"
            >
              Add to Ritual
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

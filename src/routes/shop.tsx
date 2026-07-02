import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/FadeIn";
import { supabase } from "@/integrations/supabase/client";
import { isStorageRef, resolveImageUrls } from "@/lib/product-image";
import { useCart, parsePriceCents } from "@/lib/cart-context";
import catalogAsset from "@/assets/catalog.png.asset.json";

const catalogFallback = catalogAsset.url;

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
      { property: "og:image", content: catalogFallback },
      { name: "twitter:image", content: catalogFallback },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

type Product = {
  id: string;
  slug: string;
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  notes: string;
  size: string;
  price: string;
  image_url: string;
  alt: string;
  coming_soon: boolean;
};

function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    supabase
      .from("products")
      .select("id,slug,eyebrow,name,tagline,description,notes,size,price,image_url,alt,coming_soon")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(async ({ data }) => {
        if (!active || !data) return;
        const rows = data as Product[];
        setProducts(rows);
        const storageRows = rows.filter((p) => isStorageRef(p.image_url));
        if (storageRows.length) {
          const urls = await resolveImageUrls(storageRows.map((p) => p.image_url));
          if (!active) return;
          const next: Record<string, string> = {};
          storageRows.forEach((p, i) => { next[p.id] = urls[i]; });
          setResolvedUrls(next);
        }
      });
    return () => {
      active = false;
    };
  }, []);

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
              <ProductRow
                key={product.id}
                product={product}
                index={idx}
                displayUrl={resolvedUrls[product.id] ?? (isStorageRef(product.image_url) ? "" : product.image_url)}
              />
            ))}
          </div>
        </div>
      </FadeIn>

      <section className="relative isolate overflow-hidden bg-cream">
        <div className="relative h-[60vh] min-h-[420px] w-full md:h-[70vh]">
          <img
            src={catalogFallback}
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

function ProductRow({ product, index, displayUrl }: { product: Product; index: number; displayUrl: string }) {
  const imageFirst = index % 2 === 0;

  return (
    <article className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
      <div className={imageFirst ? "order-1" : "order-1 md:order-2"}>
        <div className="overflow-hidden bg-cream">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={product.alt}
              className="h-auto w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="aspect-square w-full animate-pulse bg-muted/40" />
          )}
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
          {product.coming_soon ? (
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

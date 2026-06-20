import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/FadeIn";
import heroAsset from "@/assets/hero.png.asset.json";
import bodyWashAsset from "@/assets/body-wash.png.asset.json";
import catalogAsset from "@/assets/catalog.png.asset.json";

const storyHero = heroAsset.url;
const storyCraft = bodyWashAsset.url;
const ingredientBg = catalogAsset.url;

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Maison Hygia" },
      {
        name: "description",
        content:
          "Maison Hygia is rooted in Ayurveda and made for modern living — a return to instinctive, slow-crafted care.",
      },
      { property: "og:title", content: "Our Story — Maison Hygia" },
      {
        property: "og:description",
        content:
          "Rooted in Ayurveda. Made for modern living. Care that returns to its roots.",
      },
      { property: "og:url", content: "/story" },
      { property: "og:image", content: storyHero },
      { name: "twitter:image", content: storyHero },
    ],
    links: [{ rel: "canonical", href: "/story" }],
  }),
  component: StoryPage,
});

function GoldOrnament() {
  return (
    <div
      aria-hidden
      className="mx-auto flex items-center justify-center gap-3 py-2"
    >
      <span className="h-px w-10 bg-gold/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
      <span className="h-px w-10 bg-gold/50" />
    </div>
  );
}

function StoryPage() {
  return (
    <div className="bg-cream">
      <section className="relative isolate overflow-hidden bg-cream">
        <div className="relative h-[88vh] min-h-[600px] w-full md:h-[92vh]">
          <img
            src={storyHero}
            alt="Maison Hygia Golden Glow sheet mask on travertine stone with eucalyptus and pampas"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            width={1920}
            height={1080}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/40 to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent"
          />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
            <FadeIn immediate className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.42em] text-gold md:text-sm">
                Our Story
              </p>
              <h1 className="mt-8 font-serif text-5xl leading-[1.05] text-foreground md:text-7xl">
                Where care
                <br />
                returns to
                <br />
                <span className="italic text-cocoa">its roots.</span>
              </h1>
              <div className="mt-10 h-px w-16 bg-gold/70" />
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                Maison Hygia was born from a quiet understanding — that as we
                move forward, we are also drawn to return.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-32 md:px-10 md:py-40">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">
            A Quiet Understanding
          </p>
          <GoldOrnament />
          <div className="mt-10 space-y-8 font-serif text-2xl leading-[1.5] text-foreground md:text-[1.85rem]">
            <p>
              In a world that speaks of self-care in excess, we found ourselves
              seeking something simpler.
            </p>
            <p className="italic text-cocoa-soft">Something more instinctive.</p>
            <p>
              A way of caring that feels natural, unforced, and deeply familiar.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="bg-cream px-6 pb-32 md:px-10 md:pb-40">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-12 md:gap-24">
          <FadeIn className="md:col-span-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gold">
              Rooted in Ayurveda
            </p>
            <h2 className="mt-8 font-serif text-4xl leading-[1.15] text-foreground md:text-5xl">
              A tradition
              <br />
              that began in <span className="italic text-cocoa">India.</span>
            </h2>
            <div className="mt-8 h-px w-12 bg-gold/60" />
            <div className="mt-10 space-y-6 text-base leading-[1.85] text-muted-foreground md:text-lg">
              <p>
                Our formulas lie in the enduring principles of Ayurveda — a
                tradition that has long honored the balance between body, mind,
                and nature.
              </p>
              <p>
                These practices were never about routine. They were about{" "}
                <span className="text-cocoa">rhythm</span> — moving in harmony
                with the world around us, and within us.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={120} className="md:col-span-6">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -left-3 -top-3 hidden h-24 w-24 border-l border-t border-gold/50 md:block"
              />
              <div
                aria-hidden
                className="absolute -bottom-3 -right-3 hidden h-24 w-24 border-b border-r border-gold/50 md:block"
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  src={storyCraft}
                  alt="Maison Hygia Body Wash in an amber glass bottle with brass pump on warm stone"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={1080}
                  height={1350}
                />
              </div>
              <p className="mt-5 text-center text-xs uppercase tracking-[0.32em] text-gold">
                Slow-crafted · Rooted in Ayurveda
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-cream px-6 pb-32 md:px-10 md:pb-40">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">
            An Invitation
          </p>
          <h2 className="mt-8 font-serif text-4xl leading-[1.15] text-foreground md:text-5xl">
            Maison Hygia is an invitation
            <br />
            to return to that
            <br />
            <span className="italic text-cocoa">way of being.</span>
          </h2>
          <GoldOrnament />
          <div className="mt-8 grid gap-10 text-center md:mt-12 md:grid-cols-3">
            <div>
              <p className="font-serif text-2xl text-cocoa md:text-3xl">
                Slow down.
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.28em] text-muted-foreground">
                Pause
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl text-cocoa md:text-3xl">
                Engage the senses.
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.28em] text-muted-foreground">
                Feel
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl text-cocoa md:text-3xl">
                Return.
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.28em] text-muted-foreground">
                Remember
              </p>
            </div>
          </div>
          <p className="mx-auto mt-12 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            To transform everyday acts into moments of care — not out of
            obligation, but because they are worth returning to.
          </p>
        </FadeIn>
      </section>

      <section className="relative isolate overflow-hidden">
        <div className="relative min-h-[80vh] w-full">
          <img
            src={ingredientBg}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/55 to-cream/85"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent"
          />

          <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-6 py-32 text-center md:px-10">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.4em] text-gold">
                Made for modern living
              </p>
              <GoldOrnament />
              <h2 className="mt-6 font-serif text-4xl leading-[1.15] text-foreground md:text-5xl">
                Tradition, precision,
                <br />
                <span className="italic text-cocoa">
                  and the quiet of detail.
                </span>
              </h2>
              <div className="mx-auto mt-10 h-px w-12 bg-gold/70" />
              <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Our products are thoughtfully formulated and made in small
                batches with skilled partners who bring together tradition,
                precision, and an understanding that care is found in the
                details.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-32 md:px-10 md:py-40">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">
            At its essence
          </p>
          <h2 className="mt-10 font-serif text-4xl leading-[1.2] text-foreground md:text-5xl">
            Maison Hygia is not about
            <br />
            doing more.
          </h2>
          <p className="mt-8 font-serif text-2xl italic leading-[1.4] text-cocoa md:text-3xl">
            It is about remembering
            <br />
            what has always been enough.
          </p>

          <div className="mx-auto my-16 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gold/60" />
            <span className="font-serif text-xl tracking-[0.3em] text-gold">
              MAISON HYGIA
            </span>
            <span className="h-px w-16 bg-gold/60" />
          </div>

          <p className="font-serif text-lg italic text-muted-foreground md:text-xl">
            Rooted in Ayurveda. Made for modern living.
          </p>

          <div className="mt-14">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-cocoa px-10 py-4 text-xs uppercase tracking-[0.3em] text-cream transition-colors hover:bg-cocoa-soft"
            >
              Begin the Ritual
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

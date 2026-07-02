import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WelcomePopup } from "@/components/WelcomePopup";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/CartDrawer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="font-serif text-6xl text-foreground">404</p>
        <div className="mx-auto my-6 h-px w-12 bg-gold/60" />
        <h2 className="font-serif text-2xl text-foreground">
          This page is not here
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has wandered off. Let's get you back.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 border-b border-gold/60 pb-1 text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-foreground">
          This page didn't load
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong on our end. Try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center border border-cocoa bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-colors hover:bg-cocoa-soft"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border-b border-gold/60 pb-1 text-xs uppercase tracking-[0.22em] text-foreground hover:border-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Maison Hygia — Rooted in Ayurveda. Made for Modern Living." },
      {
        name: "description",
        content:
          "Maison Hygia — slow-crafted, Ayurveda-rooted skin, hair, and body care for everyday rituals.",
      },
      { name: "author", content: "Maison Hygia" },
      { property: "og:title", content: "Maison Hygia — Rooted in Ayurveda. Made for Modern Living." },
      {
        property: "og:description",
        content:
          "Slow-crafted, Ayurveda-rooted skin, hair, and body care for everyday rituals.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Maison Hygia" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Maison Hygia — Rooted in Ayurveda. Made for Modern Living." },
      { name: "description", content: "Maison Hygia Refresh is a website replicating an existing online presence with a new brand identity." },
      { property: "og:description", content: "Maison Hygia Refresh is a website replicating an existing online presence with a new brand identity." },
      { name: "twitter:description", content: "Maison Hygia Refresh is a website replicating an existing online presence with a new brand identity." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/886ed23d-78a2-461b-9bfb-5d5108d08398/id-preview-fe1cfdc4--b3d54e98-76b9-48d2-a015-b01686845069.lovable.app-1781928335517.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/886ed23d-78a2-461b-9bfb-5d5108d08398/id-preview-fe1cfdc4--b3d54e98-76b9-48d2-a015-b01686845069.lovable.app-1781928335517.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
          <WelcomePopup />
          <CartDrawer />
          <Toaster position="top-center" />
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}

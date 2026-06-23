import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.svg.asset.json";

const footerLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/story", label: "Story" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="flex flex-col items-center gap-10 text-center">
          <Link to="/" aria-label="Maison Hygia">
            <img src={logoAsset.url} alt="Maison Hygia" className="h-16 w-auto md:h-20" />
          </Link>

          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Modern Rituals Rooted in Nature. Slow-crafted skin and hair care,
            blended with botanicals you can name.
          </p>

          <div className="h-px w-16 bg-gold/50" />

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="pt-6 text-xs tracking-wider text-muted-foreground">
            © {new Date().getFullYear()} Maison Hygia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

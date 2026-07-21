import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.svg.asset.json";

const footerGroups = [
  {
    title: "Collections",
    links: [
      { label: "Botanical Beauty", to: "/shop" },
      { label: "Founder Collection", to: "/shop" },
      { label: "Gift Sets", to: "/shop" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", to: "/story" },
      { label: "Journal", to: "/" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Shipping", to: "/" },
      { label: "Returns", to: "/" },
      { label: "FAQ", to: "/" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28">
        <div className="flex flex-col items-center text-center">
          <Link to="/" aria-label="Maison Hygia">
            <img
              src={logoAsset.url}
              alt="Maison Hygia"
              className="h-14 w-auto md:h-16"
            />
          </Link>

          <p className="mt-6 font-serif text-lg text-foreground md:text-xl">
            Modern Rituals
            <br />
            <span className="italic text-gold">Rooted in Nature.</span>
          </p>

          <div className="mt-12 h-px w-16 bg-gold/50" />

          <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-8 sm:text-left">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
                  {group.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 h-px w-16 bg-gold/50" />

          <div className="mt-10 flex items-center gap-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-10 h-px w-16 bg-gold/50" />

          <p className="mt-10 text-xs tracking-wider text-muted-foreground">
            © 2026 Maison Hygia
          </p>
        </div>
      </div>
    </footer>
  );
}

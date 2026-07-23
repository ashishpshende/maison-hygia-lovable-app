import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Package, Shield, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart-context";
import logoAsset from "@/assets/logo.svg.asset.json";

const shopItems = [
  { to: "/botanical-beauty", label: "Botanical Beauty Collection" },
  { to: "/ritual-nutrition", label: "Ritual Snacks Collection" },
];

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop", children: shopItems },
  { to: "/story", label: "Story" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const cart = useCart();
  const shopRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let active = true;
    const check = async (userId: string | undefined) => {
      if (!userId) {
        if (active) setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (active) setIsAdmin(!!data);
    };
    supabase.auth.getUser().then(({ data }) => check(data.user?.id));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user?.id);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!shopRef.current?.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    if (shopOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [shopOpen]);

  const isShopActive = pathname === "/shop" || shopItems.some((i) => pathname === i.to);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 md:px-10">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 text-foreground transition-opacity hover:opacity-70"
        >
          <img src={logoAsset.url} alt="Maison Hygia" className="h-12 w-auto md:h-14" />
          <span className="sr-only">Maison Hygia</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) =>
            "children" in link ? (
              <div
                key={link.to}
                ref={shopRef}
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setShopOpen((v) => !v)}
                  className={cn(
                    "group relative flex items-center gap-1 text-xs uppercase tracking-[0.22em] text-foreground/75 transition-colors duration-300 hover:text-foreground",
                    isShopActive && "text-foreground",
                  )}
                >
                  {link.label}
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-300",
                      shopOpen && "rotate-180",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute -bottom-2 left-0 h-px bg-gold transition-all duration-500",
                      isShopActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "absolute left-1/2 top-full min-w-[16rem] -translate-x-1/2 pt-4 transition-all duration-300",
                    shopOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0",
                  )}
                >
                  <div className="overflow-hidden rounded-lg border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur-md">
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="block px-4 py-3 text-xs uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:bg-gold/10 hover:text-foreground"
                        activeProps={{ className: "bg-gold/10 text-foreground" }}
                        activeOptions={{ exact: true }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className="group relative text-xs uppercase tracking-[0.22em] text-foreground/75 transition-colors duration-300 hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full group-data-[status=active]:w-full" />
              </Link>
            ),
          )}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-gold/20"
                activeProps={{ className: "bg-gold/25" }}
              >
                <Shield className="h-3 w-3" /> Admin
              </Link>
              <Link
                to="/admin-products"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-gold/20"
                activeProps={{ className: "bg-gold/25" }}
              >
                <Package className="h-3 w-3" /> Products
              </Link>
              <Link
                to="/admin-applications"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-gold/20"
                activeProps={{ className: "bg-gold/25" }}
              >
                <Shield className="h-3 w-3" /> Applications
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/account"
            aria-label="Account"
            className="hidden md:inline-flex items-center justify-center rounded-full p-2 text-foreground/70 transition-colors hover:text-foreground"
          >
            <User className="h-4 w-4" />
          </Link>
          <button
            type="button"
            aria-label={`Cart (${cart.itemCount} items)`}
            onClick={cart.openCart}
            className="relative inline-flex items-center justify-center rounded-full p-2 text-foreground/70 transition-colors hover:text-foreground"
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold px-1 text-[9px] font-medium text-cocoa">
                {cart.itemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-foreground/80 transition-colors hover:text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>



      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md transition-[max-height,opacity] duration-500 ease-out md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col px-6 py-6">
          {navLinks.map((link) =>
            "children" in link ? (
              <div key={link.to} className="border-b border-border/40 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setMobileShopOpen((v) => !v)}
                  className={cn(
                    "flex w-full items-center justify-between py-4 text-xs uppercase tracking-[0.22em] text-foreground/75 transition-colors hover:text-foreground",
                    isShopActive && "text-foreground",
                  )}
                >
                  {link.label}
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-300",
                      mobileShopOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
                    mobileShopOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      onClick={() => setOpen(false)}
                      className="block py-3 pl-4 text-[11px] uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
                      activeProps={{ className: "text-foreground" }}
                      activeOptions={{ exact: true }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: link.to === "/" }}
                className="border-b border-border/40 py-4 text-xs uppercase tracking-[0.22em] text-foreground/75 transition-colors hover:text-foreground last:border-b-0"
                activeProps={{ className: "text-foreground" }}
              >
                {link.label}
              </Link>
            ),
          )}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border-b border-border/40 py-4 text-xs uppercase tracking-[0.22em] text-foreground"
              >
                <Shield className="h-3 w-3" /> Admin dashboard
              </Link>
              <Link
                to="/admin-products"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border-b border-border/40 py-4 text-xs uppercase tracking-[0.22em] text-foreground"
              >
                <Package className="h-3 w-3" /> Admin products
              </Link>
              <Link
                to="/admin-applications"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-4 text-xs uppercase tracking-[0.22em] text-foreground"
              >
                <Shield className="h-3 w-3" /> Applications
              </Link>
            </>
          )}
          <Link
            to="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 border-t border-border/40 py-4 text-xs uppercase tracking-[0.22em] text-foreground"
          >
            <User className="h-3 w-3" /> Account
          </Link>
        </nav>
      </div>
    </header>
  );
}

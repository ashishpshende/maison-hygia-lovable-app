import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart, formatCents, CART_DISCOUNT_PCT } from "@/lib/cart-context";
import { supabase } from "@/integrations/supabase/client";

export function CartDrawer() {
  const cart = useCart();
  const [placing, setPlacing] = useState(false);

  const handleCheckout = async () => {
    if (!cart.isSignedIn) {
      toast.info("Sign in to unlock your discounts and check out.");
      cart.closeCart();
      return;
    }
    if (!cart.items.length) return;
    setPlacing(true);
    const { error } = await supabase.from("orders").insert({
      user_id: cart.userId!,
      status: "pending",
      subtotal_cents: cart.subtotalCents,
      discount_cents: cart.discountCents,
      total_cents: cart.totalCents,
      signup_discount_applied: cart.signupDiscountApplied,
      first_buyer_discount_applied: cart.firstBuyerDiscountApplied,
      items: cart.items,
    });
    setPlacing(false);
    if (error) {
      toast.error("Couldn't place your order. Please try again.");
      return;
    }
    toast.success("Order reserved. Payment will be enabled soon.");
    cart.clear();
    cart.closeCart();
  };

  return (
    <>
      {cart.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={cart.closeCart}
          aria-hidden
        />
      )}
      <aside
        role="dialog"
        aria-label="Ritual cart"
        aria-hidden={!cart.isOpen}
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out ${cart.isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-gold">Your Ritual</p>
              <h2 className="mt-1 font-serif text-xl text-foreground">Cart</h2>
            </div>
            <button
              type="button"
              aria-label="Close cart"
              onClick={cart.closeCart}
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {cart.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="font-serif text-lg text-foreground">Your ritual is empty.</p>
                <p className="mt-2 text-sm text-muted-foreground">Add a piece from the collection.</p>
                <Link
                  to="/shop"
                  onClick={cart.closeCart}
                  className="mt-8 border-b border-gold/60 pb-1 text-xs uppercase tracking-[0.28em] text-foreground hover:border-foreground"
                >
                  Browse the shop
                </Link>
              </div>
            ) : (
              <ul className="space-y-6">
                {cart.items.map((i) => (
                  <li key={i.productId} className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden bg-cream">
                      {i.imageUrl ? (
                        <img src={i.imageUrl} alt={i.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-base text-foreground">{i.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatCents(i.priceCents)}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => cart.setQty(i.productId, i.quantity - 1)}
                            className="px-2 py-1 text-foreground/70 hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[2ch] text-center text-sm">{i.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => cart.setQty(i.productId, i.quantity + 1)}
                            className="px-2 py-1 text-foreground/70 hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove"
                          onClick={() => cart.remove(i.productId)}
                          className="text-foreground/50 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-serif text-base text-foreground">
                      {formatCents(i.priceCents * i.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.items.length > 0 && (
            <footer className="border-t border-border px-6 py-5 space-y-3">
              <div className="flex justify-between text-sm text-foreground/75">
                <span>Subtotal</span>
                <span>{formatCents(cart.subtotalCents)}</span>
              </div>

              {cart.signupDiscountApplied && (
                <div className="flex justify-between text-xs text-gold">
                  <span>Signup discount ({CART_DISCOUNT_PCT.signup}%)</span>
                  <span>−{formatCents(Math.round(cart.subtotalCents * CART_DISCOUNT_PCT.signup / 100))}</span>
                </div>
              )}
              {cart.firstBuyerDiscountApplied && (
                <div className="flex justify-between text-xs text-gold">
                  <span>First-time buyer ({CART_DISCOUNT_PCT.firstBuyer}%)</span>
                  <span>−{formatCents(Math.round(cart.subtotalCents * CART_DISCOUNT_PCT.firstBuyer / 100))}</span>
                </div>
              )}

              {!cart.isSignedIn && (
                <div className="border border-gold/30 bg-gold/5 p-3 text-xs leading-relaxed text-foreground/80">
                  <p>
                    <Link
                      to="/account"
                      onClick={cart.closeCart}
                      className="font-medium text-foreground underline underline-offset-4"
                    >
                      Sign in or create an account
                    </Link>{" "}
                    to unlock {CART_DISCOUNT_PCT.signup}% signup + {CART_DISCOUNT_PCT.firstBuyer}% first-time buyer.
                  </p>
                </div>
              )}

              <div className="flex justify-between border-t border-border pt-3 font-serif text-lg text-foreground">
                <span>Total</span>
                <span>{formatCents(cart.totalCents)}</span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={placing}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 bg-cocoa px-6 py-4 text-xs uppercase tracking-[0.28em] text-primary-foreground transition-colors hover:bg-cocoa-soft disabled:opacity-60"
              >
                {placing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {cart.isSignedIn ? "Checkout" : "Sign in to check out"}
              </button>
            </footer>
          )}
        </div>
      </aside>
    </>
  );
}

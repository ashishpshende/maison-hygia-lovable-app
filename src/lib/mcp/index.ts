import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import listMyOrders from "./tools/list-my-orders";
import listSubscribers from "./tools/list-subscribers";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "maison-hygia-mcp",
  title: "Maison Hygia",
  version: "0.1.0",
  instructions:
    "Tools for the Maison Hygia storefront. Use `list_products` to browse the catalog, `list_my_orders` to see the signed-in user's orders, and `list_subscribers` (admin only) to view newsletter signups.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, listMyOrders, listSubscribers],
});

import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_subscribers",
  title: "List newsletter subscribers",
  description:
    "List email newsletter subscribers. Requires the signed-in user to have the admin role; RLS blocks non-admins.",
  inputSchema: {
    limit: z.number().int().min(1).max(500).default(100).describe("Maximum subscribers to return."),
    search: z.string().trim().optional().describe("Optional case-insensitive email substring filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, search }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    let query = sb
      .from("newsletter_subscribers")
      .select("id, email, source, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (search) query = query.ilike("email", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { subscribers: data ?? [] },
    };
  },
});

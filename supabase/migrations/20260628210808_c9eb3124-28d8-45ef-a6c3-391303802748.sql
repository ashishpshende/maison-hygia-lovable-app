
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  eyebrow text NOT NULL DEFAULT '',
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  size text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  alt text NOT NULL DEFAULT '',
  coming_soon boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (slug, eyebrow, name, tagline, description, notes, size, price, image_url, alt, coming_soon, sort_order) VALUES
('body-wash', 'Daily Cleanse', 'Body Wash', 'A Gentle Start',
 'A non-stripping Ayurvedic cleanser for daily barrier care. Lathers softly, rinses clean, leaves the skin breathing.',
 'Ayurvedic Botanicals · Plant Surfactants · Barrier Care', '500 ml / 16 oz.', '$34', '',
 'Maison Hygia Body Wash in an amber glass bottle with a gold pump and wood collar, on warm stone', false, 10),
('sheet-mask-golden-glow', 'Ritual Glow', 'Sheet Mask — Golden Glow Blend', 'A Slower Pause',
 'Fifteen quiet minutes for the skin. A single-use cotton mask saturated in the Golden Glow Blend — a warm, turmeric-led serum for luminous calm.',
 'Turmeric · Saffron · Hyaluronic Acid', '1 mask · 25 ml serum', '$12', '',
 'Maison Hygia Golden Glow Blend sheet mask in an amber-gold sachet beside a cotton sheet mask', false, 20),
('the-collection', 'The Full Ritual', 'The Maison Hygia Collection', 'A Quiet Shelf',
 'Eleven slow-crafted essentials — body wash, bath salt, bath soak, body scrub, face wash, face scrub, face serum, shampoo, conditioner, hair serum, and sheet mask. Available together as the full ritual, launching soon.',
 '11 Pieces · Skin · Hair · Bath', 'Full Collection', '—', '',
 'Maison Hygia full product catalog', true, 30);

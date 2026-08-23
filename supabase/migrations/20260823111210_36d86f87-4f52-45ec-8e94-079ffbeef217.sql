CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'coast_member',
  active boolean NOT NULL DEFAULT true,
  joined_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.memberships TO authenticated;
GRANT ALL ON public.memberships TO service_role;

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Memberships own select" ON public.memberships FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Memberships own insert" ON public.memberships FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Memberships own update" ON public.memberships FOR UPDATE TO authenticated USING (auth.uid() = user_id);

INSERT INTO public.memberships (user_id)
SELECT id FROM auth.users ON CONFLICT (user_id) DO NOTHING;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS subtotal_kes integer,
  ADD COLUMN IF NOT EXISTS discount_percent integer NOT NULL DEFAULT 0;

UPDATE public.bookings SET subtotal_kes = total_kes WHERE subtotal_kes IS NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email), NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO public.memberships (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.apply_member_discount()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  is_member boolean;
  paid_count integer;
  pct integer := 0;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.memberships m WHERE m.user_id = NEW.user_id AND m.active) INTO is_member;
  SELECT count(*) INTO paid_count FROM public.bookings b WHERE b.user_id = NEW.user_id AND b.payment_status = 'paid';
  IF is_member AND paid_count > 0 THEN
    pct := 10;
  END IF;
  NEW.subtotal_kes := NEW.total_kes;
  NEW.discount_percent := pct;
  NEW.total_kes := round(NEW.total_kes * (100 - pct) / 100.0);
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_booking_discount ON public.bookings;
CREATE TRIGGER on_booking_discount BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.apply_member_discount();
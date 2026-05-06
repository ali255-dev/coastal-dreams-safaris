
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by owner" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tours
CREATE TABLE public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  price_kes INTEGER NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  rating NUMERIC(2,1) DEFAULT 4.8,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tours public read" ON public.tours FOR SELECT USING (true);

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  travel_date DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_kes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bookings own select" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Bookings own insert" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Bookings own update" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications own select" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifications own update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Notifications own insert" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notify on booking insert
CREATE OR REPLACE FUNCTION public.notify_on_booking()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE tour_title TEXT;
BEGIN
  SELECT title INTO tour_title FROM public.tours WHERE id = NEW.tour_id;
  INSERT INTO public.notifications (user_id, title, body)
  VALUES (NEW.user_id, 'Booking confirmed', 'Your booking for ' || COALESCE(tour_title, 'a tour') || ' on ' || NEW.travel_date || ' has been received.');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_booking_created AFTER INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_booking();

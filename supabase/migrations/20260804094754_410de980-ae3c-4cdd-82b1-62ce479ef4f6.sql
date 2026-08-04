ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS highlights jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.tours SET featured = false WHERE slug = 'lamu-cultural-walk';

UPDATE public.tours SET highlights = '[
 {"name":"Wasini Island","image_url":"/src/assets/place-wasini.jpg","description":"Dhow sail to Wasini for coral gardens, boardwalks and a Swahili seafood lunch."},
 {"name":"Diani white sands","image_url":"/src/assets/tour-diani.jpg","description":"Powder-soft sand and warm turquoise water along Kenya''s most loved beach."}
]'::jsonb WHERE slug = 'diani-beach-escape';

INSERT INTO public.tours (title, slug, description, location, category, price_kes, duration_days, image_url, rating, featured, highlights)
VALUES (
 'Kilifi Creek Discovery',
 'kilifi-creek-discovery',
 'Baobabs, Swahili ruins, quiet beaches and a floating restaurant — Kilifi at its most relaxed.',
 'Kilifi', 'Nature', 7500, 2, '/src/assets/tour-kilifi.jpg', 4.8, true,
 '[
  {"name":"Mnarani Ruins","image_url":"/src/assets/place-mnarani-ruins.jpg","description":"15th-century Swahili mosque ruins and pillar tombs beneath giant baobabs."},
  {"name":"Vidazini Beach","image_url":"/src/assets/place-vidazini-beach.jpg","description":"A quiet stretch of white sand and glassy shallow water."},
  {"name":"Mnarani Beach","image_url":"/src/assets/place-mnarani-beach.jpg","description":"Sheltered creek-side cove with jetties and local fishing boats."},
  {"name":"Salty''s on the Creek","image_url":"/src/assets/place-saltys-creek.jpg","description":"Floating restaurant on Kilifi Creek — sundowners over the water."},
  {"name":"Boat riding","image_url":"/src/assets/place-kilifi-boat.jpg","description":"Cruise the creek between green cliffs and mangrove channels."},
  {"name":"Mazingira Park","image_url":"/src/assets/place-mazingira-park.jpg","description":"Shaded indigenous woodland park in the heart of Kilifi town."}
 ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
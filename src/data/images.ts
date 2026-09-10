/**
 * Centralised seafood imagery (spec §61). Remote commercial stock photos;
 * swap for backend-hosted assets in V2.
 */
export const FISH_IMAGES: Record<string, string> = {
  hamour: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=1000&q=70',
  kingfish: 'https://images.unsplash.com/photo-1611171711791-b34fa42e9fc4?w=1000&q=70',
  sardine: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1000&q=70',
  mackerel: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=1000&q=70',
  seabream: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=1000&q=70',
  grouper: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=1000&q=70',
  tilapia: 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?w=1000&q=70',
  shrimp: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1000&q=70',
  generic: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=1000&q=70',
};

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=1600&q=70';

export const fishImage = (key: string): string => FISH_IMAGES[key] ?? FISH_IMAGES.generic;

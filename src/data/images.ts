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
  seabass: 'https://images.unsplash.com/photo-1784043436637-ab9f19bcfcc1?w=1000&q=70',
  sheri: 'https://images.unsplash.com/photo-1611214774777-3d997a9d0e35?w=1000&q=70',
  safi: 'https://images.unsplash.com/photo-1576330383200-2bf325cfec52?w=1000&q=70',
  tuna: 'https://images.unsplash.com/photo-1772155657429-bf1f7d64934b?w=1000&q=70',
  pomfret: 'https://images.unsplash.com/photo-1784043436638-642448d60010?w=1000&q=70',
  snapper: 'https://images.unsplash.com/photo-1560765873-104de74f2939?w=1000&q=70',
  sole: 'https://images.unsplash.com/photo-1594213720148-aa800db9378c?w=1000&q=70',
  squid: 'https://images.unsplash.com/photo-1749522714946-c39b846c2dac?w=1000&q=70',
  crab: 'https://images.unsplash.com/photo-1566541661558-b3f81e7b5cce?w=1000&q=70',
  salmon: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=1000&q=70',
  pangasius: 'https://images.unsplash.com/photo-1633244092661-4519a1ffc67e?w=1000&q=70',
  generic: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=1000&q=70',
};

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=1600&q=70';

export const fishImage = (key: string): string => FISH_IMAGES[key] ?? FISH_IMAGES.generic;

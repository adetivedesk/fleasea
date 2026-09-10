/**
 * Centralised seafood imagery (spec §61). Images are vendored into
 * public/images/fish/ so the prototype has no external image dependency;
 * swap for backend-hosted assets in V2.
 */
const asset = (file: string): string => `${import.meta.env.BASE_URL}images/fish/${file}`;

export const FISH_IMAGES: Record<string, string> = {
  hamour: asset('hamour.jpg'),
  kingfish: asset('kingfish.jpg'),
  sardine: asset('sardine.jpg'),
  mackerel: asset('mackerel.jpg'),
  seabream: asset('seabream.jpg'),
  grouper: asset('grouper.jpg'),
  tilapia: asset('tilapia.jpg'),
  shrimp: asset('shrimp.jpg'),
  seabass: asset('seabass.jpg'),
  sheri: asset('sheri.jpg'),
  safi: asset('safi.jpg'),
  tuna: asset('tuna.jpg'),
  pomfret: asset('pomfret.jpg'),
  snapper: asset('snapper.jpg'),
  sole: asset('sole.jpg'),
  squid: asset('squid.jpg'),
  crab: asset('crab.jpg'),
  salmon: asset('salmon.jpg'),
  pangasius: asset('pangasius.jpg'),
  generic: asset('generic.jpg'),
};

export const HERO_IMAGE = asset('hero.jpg');

export const fishImage = (key: string): string => FISH_IMAGES[key] ?? FISH_IMAGES.generic;

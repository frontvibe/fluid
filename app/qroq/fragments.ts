import type {Selection} from 'groqd';

import {q, z} from 'groqd';

import {LINK_REFERENCE_FRAGMENT, LINKS_LIST_SELECTION} from './links';

export const aspectRatioValues = ['square', 'video', 'auto'] as const;

/*
|--------------------------------------------------------------------------
| Image Fragment
|--------------------------------------------------------------------------
*/
export const IMAGE_FRAGMENT = {
  _ref: q('asset').grabOne('_ref', q.string()),
  _type: q.literal('image'),
  altText: q('asset').deref().grabOne('altText', q.string()).nullable(),
  asset: q.object({
    _ref: q.string(),
    _type: q.literal('reference'),
  }),
  crop: q
    .object({
      bottom: q.number(),
      left: q.number(),
      right: q.number(),
      top: q.number(),
    })
    .nullable(),
  hotspot: q.object({
    height: q.number(),
    width: q.number(),
    x: q.number(),
    y: q.number(),
  }),
} as const;

/*
|--------------------------------------------------------------------------
| Border and Shadow Fragment
|--------------------------------------------------------------------------
*/
export const BORDER_FRAGMENT = {
  cornerRadius: q.number().nullable(),
  opacity: q.number().nullable(),
  thickness: q.number().nullable(),
} as const;

export const SHADOW_FRAGMENT = {
  blur: q.number().nullable(),
  horizontalOffset: q.number().nullable(),
  opacity: q.number().nullable(),
  verticalOffset: q.number().nullable(),
} as const;

/*
|--------------------------------------------------------------------------
| Menu Fragment
|--------------------------------------------------------------------------
*/
export const MENU_FRAGMENT = q(
  `coalesce(
    menu[_key == $language][0].value[],
    menu[_key == $defaultLanguage][0].value[],
  )[]`,
  {isArray: true},
)
  .select(LINKS_LIST_SELECTION)
  .nullable();

/*
|--------------------------------------------------------------------------
| Color Fragments
|--------------------------------------------------------------------------
*/
export const COLOR_FRAGMENT = {
  alpha: q.number(),
  hex: q.string(),
  hsl: q('hsl').grab({
    h: q.number(),
    l: q.number(),
    s: q.number(),
  }),
  rgb: q('rgb').grab({
    b: q.number(),
    g: q.number(),
    r: q.number(),
  }),
} satisfies Selection;

export const COLOR_SCHEME_FRAGMENT = {
  background: q('background').grab(COLOR_FRAGMENT).nullable(),
  border: q('border').grab(COLOR_FRAGMENT).nullable(),
  card: q('card').grab(COLOR_FRAGMENT).nullable(),
  cardForeground: q('cardForeground').grab(COLOR_FRAGMENT).nullable(),
  foreground: q('foreground').grab(COLOR_FRAGMENT).nullable(),
  primary: q('primary').grab(COLOR_FRAGMENT).nullable(),
  primaryForeground: q('primaryForeground').grab(COLOR_FRAGMENT).nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Annoucement Bar Fragment
|--------------------------------------------------------------------------
*/
export const ANNOUCEMENT_BAR_FRAGMENT = {
  _key: q.string(),
  externalLink: q.string().nullable(),
  link: LINK_REFERENCE_FRAGMENT,
  openInNewTab: q.boolean().nullable(),
  text: q.string().nullable(),
} satisfies Selection;

export const ANNOUCEMENT_BAR_ARRAY_FRAGMENT = q(
  `coalesce(
    annoucementBar[_key == $language][0].value[],
    annoucementBar[_key == $defaultLanguage][0].value[],
  )[]`,
  {isArray: true},
)
  .select({
    '_type == "announcement"': ANNOUCEMENT_BAR_FRAGMENT,
  })
  .nullable();

/*
|--------------------------------------------------------------------------
| Settings Fragments
|--------------------------------------------------------------------------
*/
export const SETTINGS_FRAGMENT = {
  badgesCornerRadius: q.number().nullable(),
  badgesPosition: z
    .enum(['bottom_left', 'bottom_right', 'top_left', 'top_right'])
    .nullable(),
  badgesSaleColorScheme: q('badgesSaleColorScheme')
    .deref()
    .grab(COLOR_SCHEME_FRAGMENT)
    .nullable(),
  badgesSoldOutColorScheme: q('badgesSoldOutColorScheme')
    .deref()
    .grab(COLOR_SCHEME_FRAGMENT)
    .nullable(),
  blogCards: q
    .object({
      border: q.object(BORDER_FRAGMENT).nullable(),
      imageAspectRatio: z.enum(aspectRatioValues).nullable(),
      shadow: q.object(SHADOW_FRAGMENT).nullable(),
      style: z.enum(['standard', 'card']).nullable(),
      textAlignment: z.enum(['left', 'center', 'right']).nullable(),
    })
    .nullable(),
  buttonsBorder: q.object(BORDER_FRAGMENT).nullable(),
  buttonsShadow: q.object(SHADOW_FRAGMENT).nullable(),
  cartCollection: q('cartCollection')
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
        title: q.string(),
      }),
    })
    .nullable(),
  cartColorScheme: q('cartColorScheme')
    .deref()
    .grab(COLOR_SCHEME_FRAGMENT)
    .nullable(),
  collectionCards: q
    .object({
      border: q.object(BORDER_FRAGMENT).nullable(),
      imageAspectRatio: z.enum(aspectRatioValues).nullable(),
      shadow: q.object(SHADOW_FRAGMENT).nullable(),
      style: z.enum(['standard', 'card']).nullable(),
      textAlignment: z.enum(['left', 'center', 'right']).nullable(),
    })
    .nullable(),
  description: q.string().nullable(),
  dropdownsAndPopupsBorder: q.object(BORDER_FRAGMENT).nullable(),
  dropdownsAndPopupsShadow: q.object(SHADOW_FRAGMENT).nullable(),
  facebook: q.string().nullable(),
  favicon: q('favicon').grab(IMAGE_FRAGMENT).nullable(),
  grid: q
    .object({
      horizontalSpace: q.number(),
      verticalSpace: q.number(),
    })
    .nullable(),
  inputsBorder: q.object(BORDER_FRAGMENT).nullable(),
  inputsShadow: q.object(SHADOW_FRAGMENT).nullable(),
  instagram: q.string().nullable(),
  linkedin: q.string().nullable(),
  logo: q('logo').grab(IMAGE_FRAGMENT).nullable(),
  mediaBorder: q.object(BORDER_FRAGMENT).nullable(),
  mediaShadow: q.object(SHADOW_FRAGMENT).nullable(),
  pinterest: q.string().nullable(),
  productCards: q
    .object({
      border: q.object(BORDER_FRAGMENT).nullable(),
      imageAspectRatio: z.enum(aspectRatioValues).nullable(),
      shadow: q.object(SHADOW_FRAGMENT).nullable(),
      style: z.enum(['standard', 'card']).nullable(),
      textAlignment: z.enum(['left', 'center', 'right']).nullable(),
    })
    .nullable(),
  showCurrencyCodes: q.boolean().nullable(),
  showTrailingZeros: q.array(q.string()).nullable(),
  siteName: q.string().nullable(),
  snapchat: q.string().nullable(),
  socialSharingImagePreview: q('socialSharingImagePreview')
    .grab(IMAGE_FRAGMENT)
    .nullable(),
  spaceBetweenTemplateSections: q.number().nullable(),
  tiktok: q.string().nullable(),
  tumblr: q.string().nullable(),
  twitter: q.string().nullable(),
  vimeo: q.string().nullable(),
  youtube: q.string().nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Fonts Fragments
|--------------------------------------------------------------------------
*/
const FONT_ASSET_FRAGMENT = {
  extension: q('asset').deref().grabOne('extension', q.string()),
  mimeType: q('asset').deref().grabOne('mimeType', q.string()),
  url: q('asset').deref().grabOne('url', q.string()),
} satisfies Selection;

export const FONT_CATEGORY_FRAGMENT = {
  antialiased: q.boolean().nullable(),
  fontAssets: q('fontAssets[]', {isArray: true}).grab({
    fontName: ['^.fontName', q.string()],
    fontStyle: q.string(),
    fontWeight: q.number(),
    ttf: q('ttf').grab(FONT_ASSET_FRAGMENT).nullable(),
    woff: q('woff').grab(FONT_ASSET_FRAGMENT).nullable(),
    woff2: q('woff2').grab(FONT_ASSET_FRAGMENT).nullable(),
  }),
  fontName: q.string(),
  fontType: q.string(),
} satisfies Selection;

export const FONT_FRAGMENT = {
  baseSize: q.number().nullable(),
  capitalize: q.boolean().nullable(),
  font: q('font[]', {isArray: true}).grab(FONT_CATEGORY_FRAGMENT).nullable(),
  letterSpacing: q.number().nullable(),
  lineHeight: q.number().nullable(),
} satisfies Selection;

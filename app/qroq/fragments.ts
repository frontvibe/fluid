import type {Selection} from 'groqd';

import {q} from 'groqd';

import {LINKS_LIST_SELECTION} from './links';

/*
|--------------------------------------------------------------------------
| Image Fragment
|--------------------------------------------------------------------------
*/
export const IMAGE_FRAGMENT = {
  _ref: q('asset').grabOne('_ref', q.string()),
  altText: q('asset').deref().grabOne('altText', q.string()).nullable(),
  blurDataURL: q('asset').deref().grabOne('metadata.lqip', q.string()),
  crop: q('crop')
    .grab({
      bottom: q.number(),
      left: q.number(),
      right: q.number(),
      top: q.number(),
    })
    .nullable(),
  height: q('asset').deref().grabOne('metadata.dimensions.height', q.number()),
  hotspot: q('hotspot')
    .grab({
      height: q.number(),
      width: q.number(),
      x: q.number(),
      y: q.number(),
    })
    .nullable(),
  url: q('asset').deref().grabOne('url', q.string()),
  width: q('asset').deref().grabOne('metadata.dimensions.width', q.number()),
};

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
  outlineButton: q('outlineButton').grab(COLOR_FRAGMENT).nullable(),
  primaryButtonBackground: q('primaryButtonBackground')
    .grab(COLOR_FRAGMENT)
    .nullable(),
  primaryButtonLabel: q('primaryButtonLabel').grab(COLOR_FRAGMENT).nullable(),
  text: q('text').grab(COLOR_FRAGMENT).nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Settings Fragments
|--------------------------------------------------------------------------
*/
export const SETTINGS_FRAGMENT = {
  favicon: q('favicon').grab(IMAGE_FRAGMENT).nullable(),
  logo: q('logo').grab(IMAGE_FRAGMENT).nullable(),
  socialMedia: q('socialMedia').grab({
    facebook: q.string().nullable(),
    instagram: q.string().nullable(),
    twitter: q.string().nullable(),
    youtube: q.string().nullable(),
  }),
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

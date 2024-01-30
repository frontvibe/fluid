import type {Selection} from 'groqd';

import {q} from 'groqd';

import {COLOR_SCHEME_FRAGMENT} from './fragments';
import {getIntValue} from './utils';

/*
|--------------------------------------------------------------------------
| Footer Settings
|--------------------------------------------------------------------------
*/
export const FOOTER_SETTINGS_FRAGMENT = q('settings').grab({
  colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
  customCss: q
    .object({
      code: q.string().optional(),
    })
    .nullable(),
  hide: q.boolean().nullable(),
  padding: q
    .object({
      bottom: q.number().nullable(),
      top: q.number().nullable(),
    })
    .nullable(),
});

/*
|--------------------------------------------------------------------------
| Social Links Only
|--------------------------------------------------------------------------
*/
export const FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('socialLinksOnly'),
  copyright: [getIntValue('copyright'), q.string()],
  settings: FOOTER_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| List of footer
|--------------------------------------------------------------------------
*/
export const FOOTERS_LIST_SELECTION = {
  "_type == 'socialLinksOnly'": FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT,
};

/*
|--------------------------------------------------------------------------
| Footers Fragment
|--------------------------------------------------------------------------
*/
export const FOOTERS_FRAGMENT = q('footers[]', {isArray: true})
  .select(FOOTERS_LIST_SELECTION)
  .slice(0)
  .nullable();

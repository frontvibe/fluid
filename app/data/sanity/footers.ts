import {defineQuery} from 'groq';

import {COLOR_SCHEME_FRAGMENT} from './fragments';
import {getIntValue} from './utils';

export const FOOTER_SETTINGS_FRAGMENT = defineQuery(`{
  colorScheme -> ${COLOR_SCHEME_FRAGMENT},
  customCss,
  hide,
  padding
}`);

export const FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT = defineQuery(`{
  _key,
  _type,
  "copyright": ${getIntValue('copyright')},
  "settings": ${FOOTER_SETTINGS_FRAGMENT},
}`);

export const FOOTERS_FRAGMENT = () =>
  defineQuery(`
    _type == 'socialLinksOnly' => ${FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT},
  `);

import {defineQuery} from 'groq';

import {SECTION_SETTINGS_FRAGMENT} from './sections';
import {getIntValue} from './utils';

export const FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT = defineQuery(`{
  _key,
  _type,
  "copyright": ${getIntValue('copyright')},
  settings ${SECTION_SETTINGS_FRAGMENT},
}`);

export const FOOTERS_FRAGMENT = () =>
  defineQuery(`
    _type == 'socialLinksOnly' => ${FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT},
  `);

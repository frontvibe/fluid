import {defineQuery} from 'groq';

import {
  COLOR_SCHEME_FRAGMENT,
  HEADER_FRAGMENT,
  SETTINGS_FRAGMENT,
  THEME_CONTENT_FRAGMENT,
} from './fragments';

export const ROOT_QUERY = defineQuery(`{
  '_type': 'root',
  "defaultColorScheme": *[_type == "colorScheme" && default == true][0] ${COLOR_SCHEME_FRAGMENT},
  "fonts": *[_type == "typography"][0] | order(_createdAt asc) {
    body,
    extra,
    heading,
  },
  "header": *[_type == "header"][0] ${HEADER_FRAGMENT},
  "settings": *[_type == "settings"][0] ${SETTINGS_FRAGMENT},
  "themeContent": *[_type == "themeContent"][0] ${THEME_CONTENT_FRAGMENT},
}`);

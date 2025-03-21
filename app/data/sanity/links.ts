import {defineQuery} from 'groq';

export const LINK_REFERENCE_FRAGMENT = defineQuery(`{
  'documentType': _type,
  'slug': coalesce(
    slug,
    store.slug
  ) {
    _type,
    current
  },
}`);

export const INTERNAL_LINK_FRAGMENT = defineQuery(`{
  _key,
  _type,
  anchor,
  link -> ${LINK_REFERENCE_FRAGMENT},
  name,
}`);

export const EXTERNAL_LINK_FRAGMENT = defineQuery(`{
  _key,
  _type,
  link,
  name,
  openInNewTab,
}`);

export const NESTED_NAVIGATION_FRAGMENT = defineQuery(`{
  _key,
  _type,
  childLinks[] {
    _type == "externalLink" => ${EXTERNAL_LINK_FRAGMENT},
    _type == "internalLink" => ${INTERNAL_LINK_FRAGMENT},
  },
  link -> {
    'documentType': _type,
    'slug': coalesce(
      slug,
      store.slug
    ) {
      _type,
      current
    },
  },
  name,
}`);

export const LINKS_LIST_SELECTION = defineQuery(`{
  _type == "externalLink" => ${EXTERNAL_LINK_FRAGMENT},
  _type == "internalLink" => ${INTERNAL_LINK_FRAGMENT},
  _type == "nestedNavigation" => ${NESTED_NAVIGATION_FRAGMENT},
}`);

import {defineQuery} from 'groq';

import {FOOTERS_FRAGMENT} from './footers';
import {
  COLOR_SCHEME_FRAGMENT,
  FONT_FRAGMENT,
  HEADER_FRAGMENT,
  IMAGE_FRAGMENT,
  SETTINGS_FRAGMENT,
  THEME_CONTENT_FRAGMENT,
} from './fragments';
import {
  COLLECTION_SECTIONS_FRAGMENT,
  PRODUCT_SECTIONS_FRAGMENT,
  SECTIONS_FRAGMENT,
} from './sections';
import {getIntValue} from './utils';

export const DEFAULT_PRODUCT_TEMPLATE =
  defineQuery(`*[_type == 'productTemplate' && default == true][0] {
    _type,
    name,
    sections[] {
      _key,
      _type,
      ${SECTIONS_FRAGMENT()}
      ${PRODUCT_SECTIONS_FRAGMENT()}
    },
  }`);

export const DEFAULT_COLLECTION_TEMPLATE =
  defineQuery(`*[_type == 'collectionTemplate' && default == true][0] {
    _type,
    name,
    sections[] {
      _key,
      _type,
      ${SECTIONS_FRAGMENT()}
      ${COLLECTION_SECTIONS_FRAGMENT()}
    },
  }`);

export const ROOT_QUERY = defineQuery(`{
  '_type': 'root',
  "defaultColorScheme": *[_type == "colorScheme" && default == true][0] ${COLOR_SCHEME_FRAGMENT},
  "fonts": *[_type == "typography"][0] {
    body ${FONT_FRAGMENT},
    heading ${FONT_FRAGMENT},
    extra ${FONT_FRAGMENT},
  },
  "footer": *[_type == 'footer'][0] {
    "footer": footers[0] {
      _key,
      _type,
      ${FOOTERS_FRAGMENT()}
    },
    sections[] {
      _key,
      _type,
      ${SECTIONS_FRAGMENT()}
    },
  },
  "header": *[_type == "header"][0] ${HEADER_FRAGMENT},
  "settings": *[_type == "settings"][0] ${SETTINGS_FRAGMENT},
  "themeContent": *[_type == "themeContent"][0] ${THEME_CONTENT_FRAGMENT},
}`);

export const COLLECTION_QUERY = defineQuery(`{
  '_type': 'collection',
  "collection": *[_type == "collection" && store.slug.current == $collectionHandle][0] {
    store {
      gid,
    },
    template -> {
      sections[] {
        _key,
        _type,
        ${SECTIONS_FRAGMENT()}
        ${COLLECTION_SECTIONS_FRAGMENT()}
      },
    },
  },
  "defaultCollectionTemplate": ${DEFAULT_COLLECTION_TEMPLATE},
}`);

export const PAGE_QUERY =
  defineQuery(`*[(_type == "page" && ($handle != "home" && slug.current == $handle)) || (
    _type == "home" && $handle == "home"
  )][0] {
    _type,
    sections[] {
      _key,
      _type,
      ${SECTIONS_FRAGMENT()}
    },
    seo {
      "title": ${getIntValue('title')},
      "description": ${getIntValue('description')},
      image ${IMAGE_FRAGMENT},
    },
  }`);

export const PRODUCT_QUERY = defineQuery(`{
  "_type": "product",
  'product': *[_type == "product" && store.slug.current == $productHandle][0] {
    store {
      gid,
    },
    template -> {
      sections[] {
        _key,
        _type,
        ${SECTIONS_FRAGMENT()}
        ${PRODUCT_SECTIONS_FRAGMENT()}
      },
    },
  },
  "defaultProductTemplate": ${DEFAULT_PRODUCT_TEMPLATE},
}`);

/**
 * Used by Typegen to generate the ALL_SECTIONS_QUERYResult type.
 * This query is used to generate the `SectionOfType` type.
 */
export const ALL_SECTIONS_QUERY = defineQuery(`*[][0] {
  sections[] {
    _key,
    _type,
    ${SECTIONS_FRAGMENT()}
    ${PRODUCT_SECTIONS_FRAGMENT()}
    ${COLLECTION_SECTIONS_FRAGMENT()}
  },
  footers[] {
    _key,
    _type,
    ${FOOTERS_FRAGMENT()}
  },
}`);

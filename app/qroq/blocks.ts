import type {Selection} from 'groqd';

import {q, z} from 'groqd';

import {IMAGE_FRAGMENT} from './fragments';
import {LINK_REFERENCE_FRAGMENT} from './links';
import {contentAlignmentValues} from './sections';

/*
|--------------------------------------------------------------------------
| Base Blocks
|--------------------------------------------------------------------------
*/
export const INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('internalLink'),
  anchor: q.string().nullable(),
  link: LINK_REFERENCE_FRAGMENT,
} satisfies Selection;

export const EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('externalLink'),
  link: q.string().nullable(),
  openInNewTab: q.boolean().nullable(),
} satisfies Selection;

export const BASE_BLOCK_FRAGMENT = {
  _key: q.string().optional(),
  _type: q.string(),
  children: q.array(
    q.object({
      _key: q.string(),
      _type: q.string(),
      marks: q.array(q.string()),
      text: q.string(),
    }),
  ),
  level: q.number().optional(),
  listItem: q.string().optional(),
  markDefs: q('markDefs[]', {isArray: true})
    .filter()
    .select({
      '_type == "externalLink"': EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT,
      '_type == "internalLink"': INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT,
      default: ['{...}', q.object({})],
    }),
  style: q.string().optional(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Product Custom Blocks
|--------------------------------------------------------------------------
*/
export const SHOPIFY_TITLE_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('shopifyTitle'),
} satisfies Selection;

export const SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('shopifyDescription'),
} satisfies Selection;

export const ADD_TO_CART_BUTTON_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('addToCartButton'),
  quantitySelector: q.boolean().nullable(),
  shopPayButton: q.boolean().nullable(),
} satisfies Selection;

export const PRICE_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('price'),
} satisfies Selection;

export const PRODUCT_RICHTEXT_BLOCKS = q.select({
  '_type == "addToCartButton"': ADD_TO_CART_BUTTON_BLOCK_FRAGMENT,
  '_type == "block"': BASE_BLOCK_FRAGMENT,
  '_type == "price"': PRICE_BLOCK_FRAGMENT,
  '_type == "shopifyDescription"': SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT,
  '_type == "shopifyTitle"': SHOPIFY_TITLE_BLOCK_FRAGMENT,
});

/*
|--------------------------------------------------------------------------
| Richtext Blocks
|--------------------------------------------------------------------------
*/
export const BUTTON_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('button'),
  anchor: q.string().nullable(),
  label: q.string().nullable(),
  link: LINK_REFERENCE_FRAGMENT,
} satisfies Selection;

export const IMAGE_BLOCK_FRAGMENT = {
  _key: q.string(),
  ...IMAGE_FRAGMENT,
  alignment: z.enum(contentAlignmentValues).nullable(),
  maxWidth: q.number().nullable(),
} satisfies Selection;

export const RICHTEXT_BLOCKS = q.select({
  '_type == "block"': BASE_BLOCK_FRAGMENT,
  '_type == "button"': BUTTON_BLOCK_FRAGMENT,
  '_type == "image"': IMAGE_BLOCK_FRAGMENT,
});

/*
|--------------------------------------------------------------------------
| Banner Richtext Blocks
|--------------------------------------------------------------------------
*/
export const BANNER_RICHTEXT_BLOCKS = q.select({
  '_type == "block"': BASE_BLOCK_FRAGMENT,
  '_type == "button"': BUTTON_BLOCK_FRAGMENT,
});

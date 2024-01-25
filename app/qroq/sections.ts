import type {Selection} from 'groqd';

import {q, z} from 'groqd';

import {PRODUCT_RICHTEXT_BLOCKS, RICHTEXT_BLOCKS} from './blocks';
import {COLOR_SCHEME_FRAGMENT, IMAGE_FRAGMENT} from './fragments';
import {getIntValue} from './utils';

export const contentAlignmentValues = [
  'top_left',
  'top_center',
  'top_right',
  'middle_left',
  'middle_center',
  'middle_right',
  'bottom_left',
  'bottom_center',
  'bottom_right',
] as const;

export const simpleContentAlignmentValues = [
  'left',
  'center',
  'right',
] as const;

/*
|--------------------------------------------------------------------------
| Section Settings
|--------------------------------------------------------------------------
*/
export const SECTION_SETTINGS_FRAGMENT = q('settings').grab({
  colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
  customCss: q
    .object({
      code: q.string().optional(),
    })
    .nullable(),
  padding: q
    .object({
      bottom: q.number().nullable(),
      top: q.number().nullable(),
    })
    .nullable(),
});

/*
|--------------------------------------------------------------------------
| Image Banner Section
|--------------------------------------------------------------------------
*/
export const IMAGE_BANNER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('imageBannerSection'),
  animateContent: q.boolean().nullable(),
  backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
  bannerHeight: q.number().nullable(),
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  overlayOpacity: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  title: [getIntValue('title'), q.string()],
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Featured Collection Section
|--------------------------------------------------------------------------
*/
export const FEATURED_COLLECTION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('featuredCollectionSection'),
  collection: q('collection')
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
        title: q.string(),
      }),
    })
    .nullable(),
  desktopColumns: q.number().nullable(),
  maxProducts: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Featured Product Section
|--------------------------------------------------------------------------
*/
export const FEATURED_PRODUCT_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('featuredProductSection'),
  product: q('product')
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
        title: q.string(),
      }),
    })
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Product Information Section
|--------------------------------------------------------------------------
*/
export const PRODUCT_INFORMATION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('productInformationSection'),
  richtext: q(
    `coalesce(
      richtext[_key == $language][0].value[],
      richtext[_key == $defaultLanguage][0].value[],
    )[]`,
    {isArray: true},
  )
    .filter()
    .select(PRODUCT_RICHTEXT_BLOCKS)
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Related Products Section
|--------------------------------------------------------------------------
*/
export const RELATED_PRODUCTS_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('relatedProductsSection'),
  desktopColumns: q.number().nullable(),
  heading: [getIntValue('heading'), q.string()],
  maxProducts: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection List Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_LIST_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionListSection'),
  collections: q('collections[]', {isArray: true})
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
    })
    .nullable(),
  desktopColumns: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| CTA Section
|--------------------------------------------------------------------------
*/
export const CTA_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('ctaSection'),
  settings: SECTION_SETTINGS_FRAGMENT,
  title: [getIntValue('title'), q.string()],
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Carousel Section
|--------------------------------------------------------------------------
*/
export const CAROUSEL_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('carouselSection'),
  arrows: q.boolean().nullable(),
  autoplay: q.boolean().nullable(),
  loop: q.boolean().nullable(),
  pagination: q.boolean().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  slides: q('slides[]', {isArray: true})
    .grab({
      _key: q.string(),
      image: q('image').grab(IMAGE_FRAGMENT).nullable(),
    })
    .nullable(),
  slidesPerViewDesktop: q.number().nullable(),
  title: [getIntValue('title'), q.string()],
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Richtext Section
|--------------------------------------------------------------------------
*/
export const RICHTEXT_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('richtextSection'),
  contentAlignment: z.enum(simpleContentAlignmentValues).nullable(),
  desktopContentPosition: z.enum(simpleContentAlignmentValues).nullable(),
  maxWidth: q.number().nullable(),
  richtext: q(
    `coalesce(
      richtext[_key == $language][0].value[],
      richtext[_key == $defaultLanguage][0].value[],
    )[]`,
    {isArray: true},
  )
    .filter()
    .select(RICHTEXT_BLOCKS)
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection Banner Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_BANNER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionBannerSection'),
  settings: SECTION_SETTINGS_FRAGMENT,
  showDescription: q.boolean().nullable(),
  showImage: q.boolean().nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection Banner Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionProductGridSection'),
  desktopColumns: q.number().nullable(),
  enableFiltering: q.boolean().nullable(),
  enableSorting: q.boolean().nullable(),
  mobileColumns: q.number().nullable(),
  productsPerPage: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| List of sections
|--------------------------------------------------------------------------
*/
export const SECTIONS_LIST_SELECTION = {
  "_type == 'carouselSection'": CAROUSEL_SECTION_FRAGMENT,
  "_type == 'collectionListSection'": COLLECTION_LIST_SECTION_FRAGMENT,
  "_type == 'ctaSection'": CTA_SECTION_FRAGMENT,
  "_type == 'featuredCollectionSection'": FEATURED_COLLECTION_SECTION_FRAGMENT,
  "_type == 'featuredProductSection'": FEATURED_PRODUCT_SECTION_FRAGMENT,
  "_type == 'imageBannerSection'": IMAGE_BANNER_SECTION_FRAGMENT,
  "_type == 'richtextSection'": RICHTEXT_SECTION_FRAGMENT,
};

export const SECTIONS_FRAGMENT = q('sections[]', {isArray: true})
  .select(SECTIONS_LIST_SELECTION)
  .nullable();

/*
|--------------------------------------------------------------------------
| Product Sections Fragment
|--------------------------------------------------------------------------
*/
export const PRODUCT_SECTIONS_FRAGMENT = q('sections[]', {isArray: true})
  .select({
    "_type == 'productInformationSection'":
      PRODUCT_INFORMATION_SECTION_FRAGMENT,
    "_type == 'relatedProductsSection'": RELATED_PRODUCTS_SECTION_FRAGMENT,
    ...SECTIONS_LIST_SELECTION,
  })
  .nullable();

/*
|--------------------------------------------------------------------------
| Collection Sections Fragment
|--------------------------------------------------------------------------
*/
export const COLLECTION_SECTIONS_FRAGMENT = q('sections[]', {isArray: true})
  .select({
    "_type == 'collectionBannerSection'": COLLECTION_BANNER_SECTION_FRAGMENT,
    "_type == 'collectionProductGridSection'":
      COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT,
    ...SECTIONS_LIST_SELECTION,
  })
  .nullable();

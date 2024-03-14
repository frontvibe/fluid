import type {Selection} from 'groqd';

import {q} from 'groqd';

import {getIntValue} from './utils';

/*
|--------------------------------------------------------------------------
| Theme Content Fragment
|--------------------------------------------------------------------------
*/
export const THEME_CONTENT_FRAGMENT = {
  cart: q('cart')
    .grab({
      applyDiscount: [getIntValue('applyDiscount'), q.string().nullable()],
      continueShopping: [
        getIntValue('continueShopping'),
        q.string().nullable(),
      ],
      discountCode: [getIntValue('discountCode'), q.string().nullable()],
      discounts: [getIntValue('discounts'), q.string().nullable()],
      emptyMessage: [getIntValue('emptyMessage'), q.string().nullable()],
      heading: [getIntValue('heading'), q.string().nullable()],
      orderSummary: [getIntValue('orderSummary'), q.string().nullable()],
      proceedToCheckout: [
        getIntValue('proceedToCheckout'),
        q.string().nullable(),
      ],
      quantity: [getIntValue('quantity'), q.string().nullable()],
      remove: [getIntValue('remove'), q.string().nullable()],
      subtotal: [getIntValue('subtotal'), q.string().nullable()],
    })
    .nullable(),
  collection: q('collection')
    .grab({
      apply: [getIntValue('apply'), q.string().nullable()],
      clear: [getIntValue('clear'), q.string().nullable()],
      clearFilters: [getIntValue('clearFilters'), q.string().nullable()],
      filterAndSort: [getIntValue('filterAndSort'), q.string().nullable()],
      filterInStock: [getIntValue('filterInStock'), q.string().nullable()],
      filterOutOfStock: [
        getIntValue('filterOutOfStock'),
        q.string().nullable(),
      ],
      from: [getIntValue('from'), q.string().nullable()],
      loadMoreProducts: [
        getIntValue('loadMoreProducts'),
        q.string().nullable(),
      ],
      loadPrevious: [getIntValue('loadPrevious'), q.string().nullable()],
      loading: [getIntValue('loading'), q.string().nullable()],
      noCollectionFound: [
        getIntValue('noCollectionFound'),
        q.string().nullable(),
      ],
      noProductFound: [getIntValue('noProductFound'), q.string().nullable()],
      sortBestSelling: [getIntValue('sortBestSelling'), q.string().nullable()],
      sortBy: [getIntValue('sortBy'), q.string().nullable()],
      sortFeatured: [getIntValue('sortFeatured'), q.string().nullable()],
      sortHighLow: [getIntValue('sortHighLow'), q.string().nullable()],
      sortLowHigh: [getIntValue('sortLowHigh'), q.string().nullable()],
      sortNewest: [getIntValue('sortNewest'), q.string().nullable()],
      to: [getIntValue('to'), q.string().nullable()],
      viewAll: [getIntValue('viewAll'), q.string().nullable()],
    })
    .nullable(),
  error: q('error')
    .grab({
      pageNotFound: [getIntValue('pageNotFound'), q.string().nullable()],
      reloadPage: [getIntValue('reloadPage'), q.string().nullable()],
      sectionError: [getIntValue('sectionError'), q.string().nullable()],
      serverError: [getIntValue('serverError'), q.string().nullable()],
    })
    .nullable(),
  product: q('product')
    .grab({
      addToCart: [getIntValue('addToCart'), q.string().nullable()],
      quantitySelector: [
        getIntValue('quantitySelector'),
        q.boolean().nullable(),
      ],
      sale: [getIntValue('sale'), q.string().nullable()],
      soldOut: [getIntValue('soldOut'), q.string().nullable()],
    })
    .nullable(),
} satisfies Selection;

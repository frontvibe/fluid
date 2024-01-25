import type {Selection} from 'groqd';

import {q} from 'groqd';

import {getIntValue} from './utils';

/*
|--------------------------------------------------------------------------
| Theme Content Fragment
|--------------------------------------------------------------------------
*/
export const THEME_CONTENT_FRAGMENT = {
  cart: q('cart').grab({
    heading: [getIntValue('heading'), q.string().nullable()],
  }),
  product: q('product')
    .grab({
      addToCart: [getIntValue('addToCart'), q.string().nullable()],
      quantitySelector: [
        getIntValue('quantitySelector'),
        q.boolean().nullable(),
      ],
      soldOut: [getIntValue('soldOut'), q.string().nullable()],
    })
    .nullable(),
} satisfies Selection;

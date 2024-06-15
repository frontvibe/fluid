import type {Selection} from 'groqd';

import {q} from 'groqd';

import {getIntValue} from './utils';

/*
|--------------------------------------------------------------------------
| Theme Content Fragment
|--------------------------------------------------------------------------
*/
export const THEME_CONTENT_FRAGMENT = {
  account: q('account').grab({
    accountDetails: [getIntValue('accountDetails'), q.string().nullable()],
    addAddress: [getIntValue('addAddress'), q.string().nullable()],
    addName: [getIntValue('addName'), q.string().nullable()],
    addressBook: [getIntValue('addressBook'), q.string().nullable()],
    addressLine1: [getIntValue('addressLine1'), q.string().nullable()],
    addressLine2: [getIntValue('addressLine2'), q.string().nullable()],
    cancel: [getIntValue('cancel'), q.string().nullable()],
    city: [getIntValue('city'), q.string().nullable()],
    company: [getIntValue('company'), q.string().nullable()],
    country: [getIntValue('country'), q.string().nullable()],
    default: [getIntValue('default'), q.string().nullable()],
    defaultAddress: [getIntValue('defaultAddress'), q.string().nullable()],
    discounts: [getIntValue('discounts'), q.string().nullable()],
    discountsOff: [getIntValue('discountsOff'), q.string().nullable()],
    edit: [getIntValue('edit'), q.string().nullable()],
    editAddress: [getIntValue('editAddress'), q.string().nullable()],
    emailAddress: [getIntValue('emailAddress'), q.string().nullable()],
    firstName: [getIntValue('firstName'), q.string().nullable()],
    fulfillmentStatus: [
      getIntValue('fulfillmentStatus'),
      q.string().nullable(),
    ],
    lastName: [getIntValue('lastName'), q.string().nullable()],
    name: [getIntValue('name'), q.string().nullable()],
    noAddress: [getIntValue('noAddress'), q.string().nullable()],
    noOrdersMessage: [getIntValue('noOrdersMessage'), q.string().nullable()],
    noShippingAddress: [
      getIntValue('noShippingAddress'),
      q.string().nullable(),
    ],
    orderDate: [getIntValue('orderDate'), q.string().nullable()],
    orderDetail: [getIntValue('orderDetail'), q.string().nullable()],
    orderHistory: [getIntValue('orderHistory'), q.string().nullable()],
    orderId: [getIntValue('orderId'), q.string().nullable()],
    orderNumber: [getIntValue('orderNumber'), q.string().nullable()],
    orderStatusCancelled: [
      getIntValue('orderStatusCancelled'),
      q.string().nullable(),
    ],
    orderStatusError: [getIntValue('orderStatusError'), q.string().nullable()],
    orderStatusFailure: [
      getIntValue('orderStatusFailure'),
      q.string().nullable(),
    ],
    orderStatusOpen: [getIntValue('orderStatusOpen'), q.string().nullable()],
    orderStatusPending: [
      getIntValue('orderStatusPending'),
      q.string().nullable(),
    ],
    orderStatusSuccess: [
      getIntValue('orderStatusSuccess'),
      q.string().nullable(),
    ],
    phone: [getIntValue('phone'), q.string().nullable()],
    phoneNumber: [getIntValue('phoneNumber'), q.string().nullable()],
    placedOn: [getIntValue('placedOn'), q.string().nullable()],
    postalCode: [getIntValue('postalCode'), q.string().nullable()],
    price: [getIntValue('price'), q.string().nullable()],
    product: [getIntValue('product'), q.string().nullable()],
    profile: [getIntValue('profile'), q.string().nullable()],
    quantity: [getIntValue('quantity'), q.string().nullable()],
    remove: [getIntValue('remove'), q.string().nullable()],
    returnToAccount: [getIntValue('returnToAccount'), q.string().nullable()],
    save: [getIntValue('save'), q.string().nullable()],
    saving: [getIntValue('saving'), q.string().nullable()],
    shippingAddress: [getIntValue('shippingAddress'), q.string().nullable()],
    signOut: [getIntValue('signOut'), q.string().nullable()],
    startShopping: [getIntValue('startShopping'), q.string().nullable()],
    stateProvince: [getIntValue('stateProvince'), q.string().nullable()],
    status: [getIntValue('status'), q.string().nullable()],
    subtotal: [getIntValue('subtotal'), q.string().nullable()],
    tax: [getIntValue('tax'), q.string().nullable()],
    total: [getIntValue('total'), q.string().nullable()],
    updateYourProfile: [
      getIntValue('updateYourProfile'),
      q.string().nullable(),
    ],
    viewDetails: [getIntValue('viewDetails'), q.string().nullable()],
    welcome: [getIntValue('welcome'), q.string().nullable()],
    welcomeToYourAccount: [
      getIntValue('welcomeToYourAccount'),
      q.string().nullable(),
    ],
  }),
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
      addressCreation: [getIntValue('addressCreation'), q.string().nullable()],
      missingAddressId: [
        getIntValue('missingAddressId'),
        q.string().nullable(),
      ],
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

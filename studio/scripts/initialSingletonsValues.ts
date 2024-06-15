import {nanoid} from 'nanoid';
import {DEFAULT_LOCALE} from '../../countries';
import {setShowTrailingZeroKeyValue} from '../../app/lib/utils';

const initialBorderValues = {
  cornerRadius: 8,
  opacity: 100,
  thickness: 1,
};
const initialShadowValues = {
  blur: 0,
  horizontalOffset: 0,
  opacity: 0,
  verticalOffset: 0,
};

export const initialSingletonsValues = {
  home: {
    sections: [
      {
        _key: nanoid(),
        _type: 'richtextSection',
        contentAlignment: 'center',
        desktopContentPosition: 'center',
        maxWidth: 450,
        richtext: [
          {
            _key: DEFAULT_LOCALE.language.toLowerCase(),
            _type: 'internationalizedArrayRichtextValue',
            value: [
              {
                _key: nanoid(),
                _type: 'block',
                children: [
                  {
                    _key: nanoid(),
                    _type: 'span',
                    text: 'Welcome aboard!',
                    marks: [],
                  },
                ],
                markDefs: [],
                style: 'h1',
              },
              {
                _key: nanoid(),
                _type: 'block',
                children: [
                  {
                    _key: nanoid(),
                    _type: 'span',
                    marks: [],
                    text: "Let's start by adding some content. You can toggle Sanity preview mode with the keyboard shortcut ",
                  },
                  {
                    _key: nanoid(),
                    _type: 'span',
                    marks: ['strong'],
                    text: 'cmd + ctrl + p',
                  },
                  {
                    _key: nanoid(),
                    _type: 'span',
                    marks: [],
                    text: ', or navigate to ',
                  },
                  {
                    _key: nanoid(),
                    _type: 'span',
                    marks: ['em'],
                    text: '/sanity/preview',
                  },
                  {
                    _key: nanoid(),
                    _type: 'span',
                    marks: [],
                    text: '.',
                  },
                ],
                markDefs: [],
                style: 'normal',
              },
            ],
          },
        ],
        settings: {
          _type: 'sectionSettings',
          hide: false,
          padding: {
            _type: 'padding',
            bottom: 80,
            top: 80,
          },
        },
      },
    ],
  },
  typography: {
    heading: {
      baseSize: 50,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    body: {
      baseSize: 16,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    extra: {
      baseSize: 16,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
  },
  settings: {
    siteName: 'Fluid',
    grid: {
      horizontalSpace: 20,
      verticalSpace: 20,
    },
    badgesCornerRadius: 50,
    badgesPosition: 'bottom_left',
    badgesSaleColorScheme: {
      _ref: 'sale-badge-color-scheme',
      _type: 'reference',
    },
    badgesSoldOutColorScheme: {
      _ref: 'sold-out-badge-color-scheme',
      _type: 'reference',
    },
    buttonsBorder: initialBorderValues,
    buttonsShadow: initialShadowValues,
    blogCards: {
      border: {
        cornerRadius: 8,
        opacity: 100,
        thickness: 0,
      },
      shadow: initialShadowValues,
      style: 'standard',
      textAlignment: 'left',
    },
    collectionCards: {
      border: {
        cornerRadius: 8,
        opacity: 100,
        thickness: 0,
      },
      shadow: initialShadowValues,
      style: 'standard',
      textAlignment: 'left',
    },
    dropdownsAndPopupsBorder: initialBorderValues,
    dropdownsAndPopupsShadow: initialShadowValues,
    inputsBorder: initialBorderValues,
    inputsShadow: initialShadowValues,
    mediaBorder: {
      cornerRadius: 8,
      opacity: 100,
      thickness: 0,
    },
    mediaShadow: initialShadowValues,
    productCards: {
      border: {
        cornerRadius: 8,
        opacity: 100,
        thickness: 0,
      },
      shadow: initialShadowValues,
      style: 'standard',
      textAlignment: 'left',
    },
    showCurrencyCodes: true,
    showTrailingZeros: [setShowTrailingZeroKeyValue(DEFAULT_LOCALE)],
    facebook: 'https://facebook.com/shopify',
    instagram: 'https://instagram.com/shopify',
    linkedin: 'https://linkedin.com/company/shopify',
    pinterest: 'https://pinterest.com/shopify',
    snapchat: 'https://snapchat.com/add/shopify',
    tiktok: 'https://tiktok.com/@shopify',
    tumblr: 'https://shopify.tumblr.com',
    twitter: 'https://twitter.com/shopify',
    vimeo: 'https://vimeo.com/shopify',
    youtube: 'https://www.youtube.com/shopify',
  },
  header: {
    showSeparatorLine: true,
    sticky: 'onScrollUp',
    desktopLogoWidth: 90,
    blur: true,
    padding: {
      _type: 'padding',
      top: 10,
      bottom: 10,
    },
    annoucementBar: [
      {
        _key: DEFAULT_LOCALE.language.toLowerCase(),
        _type: 'internationalizedArrayAnnouncementBarValue',
        value: [
          {
            _key: nanoid(),
            _type: 'announcement',
            externalLink: 'https://github.com/frontvibe/fluid',
            openInNewTab: true,
            text: '🐙 Give us a star ⭐️',
          },
        ],
      },
    ],
    annoucementBarColorScheme: {
      _ref: 'dark-color-scheme',
      _type: 'reference',
    },
    menu: [
      {
        _key: DEFAULT_LOCALE.language.toLowerCase(),
        _type: 'internationalizedArrayHeaderNavigationValue',
        value: [
          {
            _key: nanoid(),
            _type: 'internalLink',
            link: {
              _ref: 'collections-page',
              _type: 'reference',
            },
            name: 'Collections',
          },
          {
            _key: nanoid(),
            _type: 'internalLink',
            link: {
              _ref: 'products-page',
              _type: 'reference',
            },
            name: 'Products',
          },
        ],
      },
    ],
  },
  footer: {
    footers: [
      {
        _key: nanoid(),
        _type: 'socialLinksOnly',
        copyright: [
          {
            _key: DEFAULT_LOCALE.language.toLowerCase(),
            _type: 'internationalizedArrayStringValue',
            value: '© 2024 Fluid, Inc. All rights reserved.',
          },
        ],
        settings: {
          _type: 'sectionSettings',
          colorScheme: {
            _ref: 'dark-color-scheme',
            _type: 'reference',
          },
          hide: false,
          padding: {
            _type: 'padding',
            bottom: 100,
            top: 100,
          },
        },
      },
    ],
  },
  themeContent: {
    account: {
      welcome: generateIntString('Welcome, {firstName}.'),
      welcomeToYourAccount: generateIntString('Welcome to your account'),
      accountDetails: generateIntString('Account details'),
      signOut: generateIntString('Sign out'),
      orderHistory: generateIntString('Order history'),
      noOrdersMessage: generateIntString("You haven't placed any orders yet."),
      startShopping: generateIntString('Start shopping'),
      orderDetail: generateIntString('Order detail'),
      returnToAccount: generateIntString('Return to account'),
      orderNumber: generateIntString('Order number'),
      placedOn: generateIntString('Placed on'),
      product: generateIntString('Product'),
      price: generateIntString('Price'),
      quantity: generateIntString('Quantity'),
      total: generateIntString('Total'),
      subtotal: generateIntString('Subtotal'),
      discounts: generateIntString('Discounts'),
      discountsOff: generateIntString('-{discount}% OFF'),
      tax: generateIntString('Tax'),
      shippingAddress: generateIntString('Shipping address'),
      noShippingAddress: generateIntString('No shipping address'),
      status: generateIntString('Status'),
      updateYourProfile: generateIntString('Update your profile'),
      firstName: generateIntString('First name'),
      lastName: generateIntString('Last name'),
      company: generateIntString('Company'),
      addressLine1: generateIntString('Address line 1'),
      addressLine2: generateIntString('Address line 2'),
      city: generateIntString('City'),
      stateProvince: generateIntString('State / Province (zoneCode)'),
      postalCode: generateIntString('Zip / Postal Code'),
      country: generateIntString('Country'),
      phone: generateIntString('Phone'),
      defaultAddress: generateIntString('Default address'),
      saving: generateIntString('Saving'),
      save: generateIntString('Save'),
      cancel: generateIntString('Cancel'),
      addName: generateIntString('Add name'),
      addAddress: generateIntString('Add address'),
      editAddress: generateIntString('Edit address'),
      addressBook: generateIntString('Address book'),
      noAddress: generateIntString('No address'),
      default: generateIntString('Default'),
      edit: generateIntString('Edit'),
      remove: generateIntString('Remove'),
      profile: generateIntString('Profile'),
      name: generateIntString('Name'),
      phoneNumber: generateIntString('Phone number'),
      emailAddress: generateIntString('Email address'),
      orderId: generateIntString('Order ID'),
      orderDate: generateIntString('Order date'),
      fulfillmentStatus: generateIntString('Fulfillment status'),
      viewDetails: generateIntString('View details'),
      orderStatusCancelled: generateIntString('Cancelled'),
      orderStatusError: generateIntString('Error'),
      orderStatusFailure: generateIntString('Failure'),
      orderStatusOpen: generateIntString('Open'),
      orderStatusPending: generateIntString('Pending'),
      orderStatusSuccess: generateIntString('Success'),
    },
    cart: {
      applyDiscount: generateIntString('Apply discount'),
      discountCode: generateIntString('Discount code'),
      discounts: generateIntString('Discount(s)'),
      orderSummary: generateIntString('Order summary'),
      proceedToCheckout: generateIntString('Continue to checkout'),
      quantity: generateIntString('Quantity'),
      remove: generateIntString('Remove'),
      subtotal: generateIntString('Subtotal'),
      heading: generateIntString('Your Cart'),
      continueShopping: generateIntString('Continue shopping'),
      emptyMessage: generateIntString(
        "Looks like you haven't added anything yet, let's get you started!",
      ),
    },
    collection: {
      apply: generateIntString('Apply'),
      clear: generateIntString('Clear'),
      clearFilters: generateIntString('Clear all filters'),
      filterAndSort: generateIntString('Filter and sort'),
      loadMoreProducts: generateIntString('Load more products'),
      loadPrevious: generateIntString('Load previous'),
      loading: generateIntString('Loading...'),
      filterInStock: generateIntString('In stock'),
      filterOutOfStock: generateIntString('Out of stock'),
      noProductFound: generateIntString('No product found'),
      noCollectionFound: generateIntString('No collection found'),
      from: generateIntString('From'),
      to: generateIntString('To'),
      sortBestSelling: generateIntString('Best selling'),
      sortBy: generateIntString('Sort by:'),
      sortFeatured: generateIntString('Featured'),
      sortHighLow: generateIntString('Price: High - Low'),
      sortLowHigh: generateIntString('Price: Low - High'),
      sortNewest: generateIntString('Newest'),
      viewAll: generateIntString('View all'),
    },
    error: {
      pageNotFound: generateIntString('Page not found'),
      reloadPage: generateIntString('Reload page'),
      sectionError: generateIntString(
        'An error occurred while loading this section.',
      ),
      serverError: generateIntString('An error occurred'),
      missingAddressId: generateIntString('You must provide an address id.'),
      addressCreation: generateIntString(
        'Expected customer address to be created.',
      ),
    },
    product: {
      addToCart: generateIntString('Add to cart'),
      quantitySelector: generateIntString('Quantity selector'),
      sale: generateIntString('Sale'),
      soldOut: generateIntString('Sold out'),
    },
  },
} as const;

function generateIntString(value: string) {
  const locale = DEFAULT_LOCALE;
  return [
    {
      _key: locale.language.toLowerCase(),
      _type: 'internationalizedArrayStringValue',
      value: value,
    },
  ];
}

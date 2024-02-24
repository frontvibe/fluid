import {nanoid} from 'nanoid';
import {DEFAULT_LOCALE} from '../../countries';

export const initialDocumentsValues = [
  // Product template
  {
    _id: 'defaultProductTemplate',
    _type: 'productTemplate',
    default: true,
    name: 'Default',
    sections: [
      {
        _key: nanoid(),
        _type: 'productInformationSection',
        desktopMediaPosition: 'left',
        desktopMediaWidth: 'large',
        mediaAspectRatio: 'square',
        richtext: [
          {
            _key: 'en',
            _type: 'internationalizedArrayProductRichtextValue',
            value: [
              {
                _key: nanoid(),
                _type: 'shopifyTitle',
              },
              {
                _key: nanoid(),
                _type: 'price',
              },
              {
                _key: nanoid(),
                _type: 'shopifyDescription',
              },
              {
                _key: nanoid(),
                _type: 'addToCartButton',
                quantitySelector: true,
                shopPayButton: true,
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
            top: 25,
          },
        },
      },
      {
        _type: 'relatedProductsSection',
        _key: nanoid(),
        settings: {
          hide: false,
          padding: {
            top: 80,
            bottom: 80,
            _type: 'padding',
          },
          _type: 'sectionSettings',
        },
        maxProducts: 6,
        desktopColumns: 3,
        heading: [
          {
            _type: 'internationalizedArrayStringValue',
            _key: DEFAULT_LOCALE.language.toLowerCase(),
            value: 'Related products',
          },
        ],
      },
    ],
  },
  // Collection Template
  {
    _id: 'defaultCollectionTemplate',
    _type: 'collectionTemplate',
    default: true,
    name: 'Default',
    sections: [
      {
        _key: nanoid(),
        _type: 'collectionProductGridSection',
        desktopColumns: 3,
        enableFiltering: true,
        enableSorting: true,
        mobileColumns: 2,
        productsPerPage: 8,
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
  // Collections page
  {
    _id: 'collections-page',
    _type: 'page',
    slug: {
      _type: 'slug',
      current: 'collections',
    },
    title: [
      {
        _key: DEFAULT_LOCALE.language.toLowerCase(),
        _type: 'internationalizedArrayStringValue',
        value: 'Collections',
      },
    ],
  },
  // Products page
  {
    _id: 'products-page',
    _type: 'page',
    slug: {
      _type: 'slug',
      current: 'products',
    },
    title: [
      {
        _key: DEFAULT_LOCALE.language.toLowerCase(),
        _type: 'internationalizedArrayStringValue',
        value: 'Products',
      },
    ],
  },
  // Light Color Scheme
  {
    _id: 'light-color-scheme',
    _type: 'colorScheme',
    background: {
      hex: '#F9FEFD',
      hsl: {
        h: 168,
        l: 0.9961,
        s: 0.0197,
      },
      rgb: {
        b: 253,
        g: 254,
        r: 249,
      },
    },
    border: {
      hex: '#4CBBA5',
      hsl: {
        h: 168.11,
        l: 0.7333,
        s: 0.5936,
      },
      rgb: {
        b: 165,
        g: 187,
        r: 76,
      },
    },
    card: {
      hex: '#F9FEFD',
      hsl: {
        h: 168,
        l: 0.9961,
        s: 0.0197,
      },
      rgb: {
        b: 253,
        g: 254,
        r: 249,
      },
    },
    cardForeground: {
      hex: '#16433C',
      hsl: {
        h: 170.67,
        l: 0.2627,
        s: 0.6716,
      },
      rgb: {
        b: 60,
        g: 67,
        r: 22,
      },
    },
    default: true,
    foreground: {
      hex: '#16433C',
      hsl: {
        h: 170.67,
        l: 0.2627,
        s: 0.6716,
      },
      rgb: {
        b: 60,
        g: 67,
        r: 22,
      },
    },
    name: 'Light',
    primary: {
      hex: '#027864',
      hsl: {
        h: 169.83,
        l: 0.4706,
        s: 0.9833,
      },
      rgb: {
        b: 100,
        g: 120,
        r: 2,
      },
    },
    primaryForeground: {
      hex: '#F9FEFD',
      hsl: {
        h: 168,
        l: 0.9961,
        s: 0.0197,
      },
      rgb: {
        b: 253,
        g: 254,
        r: 249,
      },
    },
  },
  // Dark Color Scheme
  {
    _id: 'dark-color-scheme',
    _type: 'colorScheme',
    background: {
      hex: '#0E1515',
      hsl: {
        h: 180,
        l: 0.0824,
        s: 0.3333,
      },
      rgb: {
        b: 21,
        g: 21,
        r: 14,
      },
    },
    border: {
      hex: '#092C2B',
      hsl: {
        h: 178.29,
        l: 0.1725,
        s: 0.7955,
      },
      rgb: {
        b: 43,
        g: 44,
        r: 9,
      },
    },
    card: {
      alpha: 1,
      hex: '#0E1515',
      hsl: {
        h: 180,
        l: 0.0824,
        s: 0.3333,
      },
      rgb: {
        b: 21,
        g: 21,
        r: 14,
      },
    },
    cardForeground: {
      hex: '#C4F5E1',
      hsl: {
        h: 155.51,
        l: 0.9608,
        s: 0.2,
      },
      rgb: {
        b: 225,
        g: 245,
        r: 196,
      },
    },
    default: false,
    foreground: {
      hex: '#C4F5E1',
      hsl: {
        h: 155.51,
        l: 0.9608,
        s: 0.2,
      },
      rgb: {
        b: 225,
        g: 245,
        r: 196,
      },
    },
    name: 'Dark',
    primary: {
      hex: '#86EAD4',
      hsl: {
        h: 166.8,
        l: 0.9176,
        s: 0.4274,
      },
      rgb: {
        b: 212,
        g: 234,
        r: 134,
      },
    },
    primaryForeground: {
      alpha: 1,
      hex: '#0E1515',
      hsl: {
        h: 180,
        l: 0.0824,
        s: 0.3333,
      },
      rgb: {
        b: 21,
        g: 21,
        r: 14,
      },
    },
  },
  // Sale badge color scheme
  {
    _id: 'sale-badge-color-scheme',
    _type: 'colorScheme',
    background: {
      hex: '#0588F0',
      hsl: {
        h: 206.55,
        l: 0.9412,
        s: 0.9792,
      },
      rgb: {
        b: 240,
        g: 136,
        r: 5,
      },
    },
    border: {
      hex: '#C2E5FF',
      hsl: {
        h: 205.57,
        l: 1,
        s: 0.2392,
      },
      rgb: {
        b: 255,
        g: 229,
        r: 194,
      },
    },
    card: {
      hex: '#0588F0',
      hsl: {
        h: 206.55,
        l: 0.9412,
        s: 0.9792,
      },
      rgb: {
        b: 240,
        g: 136,
        r: 5,
      },
    },
    cardForeground: {
      hex: '#FBFDFF',
      hsl: {
        h: 210,
        l: 1,
        s: 0.0157,
      },
      rgb: {
        b: 255,
        g: 253,
        r: 251,
      },
    },
    default: false,
    foreground: {
      hex: '#FBFDFF',
      hsl: {
        h: 210,
        l: 1,
        s: 0.0157,
      },
      rgb: {
        b: 255,
        g: 253,
        r: 251,
      },
    },
    name: 'Sale badge',
    primary: {
      hex: '#FBFDFF',
      hsl: {
        h: 210,
        l: 1,
        s: 0.0157,
      },
      rgb: {
        b: 255,
        g: 253,
        r: 251,
      },
    },
    primaryForeground: {
      hex: '#0588F0',
      hsl: {
        h: 206.55,
        l: 0.9412,
        s: 0.9792,
      },
      rgb: {
        b: 240,
        g: 136,
        r: 5,
      },
    },
  },
  // Sold out badge color scheme
  {
    _id: 'sold-out-badge-color-scheme',
    _type: 'colorScheme',
    background: {
      hex: '#DCBC9F',
      hsl: {
        h: 28.52,
        l: 0.8627,
        s: 0.2773,
      },
      rgb: {
        b: 159,
        g: 188,
        r: 220,
      },
    },
    border: {
      hex: '#F0E4D9',
      hsl: {
        h: 28.7,
        l: 0.9412,
        s: 0.0958,
      },
      rgb: {
        b: 217,
        g: 228,
        r: 240,
      },
    },
    card: {
      hex: '#DCBC9F',
      hsl: {
        h: 28.52,
        l: 0.8627,
        s: 0.2773,
      },
      rgb: {
        b: 159,
        g: 188,
        r: 220,
      },
    },
    cardForeground: {
      hex: '#3E332E',
      hsl: {
        h: 18.75,
        l: 0.2431,
        s: 0.2581,
      },
      rgb: {
        b: 46,
        g: 51,
        r: 62,
      },
    },
    default: false,
    foreground: {
      hex: '#3E332E',
      hsl: {
        h: 18.75,
        l: 0.2431,
        s: 0.2581,
      },
      rgb: {
        b: 46,
        g: 51,
        r: 62,
      },
    },
    name: 'Sold out badge',
    primary: {
      hex: '#3E332E',
      hsl: {
        h: 18.75,
        l: 0.2431,
        s: 0.2581,
      },
      rgb: {
        b: 46,
        g: 51,
        r: 62,
      },
    },
    primaryForeground: {
      hex: '#DCBC9F',
      hsl: {
        h: 28.52,
        l: 0.8627,
        s: 0.2773,
      },
      rgb: {
        b: 159,
        g: 188,
        r: 220,
      },
    },
  },
];

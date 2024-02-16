import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'themeContent',
  type: 'document',
  __experimental_formPreviewTitle: false,
  groups: [
    {name: 'general'},
    {name: 'cart'},
    {name: 'product'},
    {name: 'collection'},
  ],
  fields: [
    defineField({
      title: 'Cart',
      name: 'cart',
      type: 'object',
      group: 'cart',
      fields: [
        defineField({
          name: 'heading',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'proceedToCheckout',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'orderSummary',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'subtotal',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'discounts',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'applyDiscount',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'discountCode',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'remove',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'quantity',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'continueShopping',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'emptyMessage',
          type: 'internationalizedArrayString',
        }),
      ],
    }),
    defineField({
      name: 'collection',
      type: 'object',
      group: 'collection',
      fields: [
        defineField({
          title: 'Sort by',
          name: 'sortBy',
          type: 'internationalizedArrayString',
        }),
        defineField({
          title: 'Sort by - Featured',
          name: 'sortFeatured',
          type: 'internationalizedArrayString',
        }),
        defineField({
          title: 'Sort by - Price Low to High',
          name: 'sortLowHigh',
          type: 'internationalizedArrayString',
        }),
        defineField({
          title: 'Sort by - Price High to Low',
          name: 'sortHighLow',
          type: 'internationalizedArrayString',
        }),
        defineField({
          title: 'Sort by - Best selling',
          name: 'sortBestSelling',
          type: 'internationalizedArrayString',
        }),
        defineField({
          title: 'Sort by - Newest',
          name: 'sortNewest',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'filterAndSort',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'clearFilters',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'clear',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'apply',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'loading',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'loadPrevious',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'loadMoreProducts',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'noProductFound',
          type: 'internationalizedArrayString',
        }),
      ],
    }),
    defineField({
      name: 'product',
      type: 'object',
      group: 'product',
      fields: [
        defineField({
          title: 'Add to cart',
          name: 'addToCart',
          type: 'internationalizedArrayString',
        }),
        defineField({
          title: 'Sold out',
          name: 'soldOut',
          type: 'internationalizedArrayString',
        }),
        defineField({
          title: 'Quantity Selector Label',
          name: 'quantitySelector',
          type: 'internationalizedArrayString',
        }),
      ],
    }),
  ],
  initialValue: {
    cart: {
      view: [
        {
          _key: 'en',
          value: 'View cart',
        },
      ],
      heading: [
        {
          _key: 'en',
          value: 'Your Cart',
        },
      ],
    },
    product: {
      addToCart: [
        {
          _key: 'en',
          value: 'Add to cart',
        },
      ],
      souldOut: [
        {
          _key: 'en',
          value: 'Sold out',
        },
      ],
      quantitySelector: [
        {
          _key: 'en',
          value: 'Quantity selector',
        },
      ],
    },
  },
  preview: {
    prepare: () => ({title: 'Theme Content'}),
  },
});

import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'themeContent',
  type: 'document',
  __experimental_formPreviewTitle: false,
  groups: [
    {name: 'general', title: 'General'},
    {name: 'products', title: 'Products'},
  ],
  fields: [
    defineField({
      title: 'Cart',
      name: 'cart',
      type: 'object',
      group: 'general',
      fields: [
        defineField({
          title: 'View',
          name: 'view',
          type: 'internationalizedArrayString',
        }),
        defineField({
          title: 'Heading',
          name: 'heading',
          type: 'internationalizedArrayString',
        }),
      ],
    }),
    defineField({
      title: 'Product',
      name: 'product',
      type: 'object',
      group: 'products',
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

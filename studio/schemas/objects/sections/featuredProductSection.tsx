import {defineField} from 'sanity';

export default defineField({
  name: 'featuredProductSection',
  title: 'Featured Product',
  type: 'object',
  fields: [
    defineField({
      name: 'product',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  preview: {
    select: {
      product: 'product.store',
    },
    prepare({product}: any) {
      return {
        title: product.title,
        subtitle: 'Featured Product',
        media: () => <img src={product.previewImageUrl} alt={product.title} />,
      };
    },
  },
});

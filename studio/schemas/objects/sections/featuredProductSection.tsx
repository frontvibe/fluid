import {EyeOff} from 'lucide-react';
import {ImageIcon} from '@sanity/icons';
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
      name: 'richtext',
      type: 'internationalizedArrayProductRichtext',
    }),
    defineField({
      type: 'aspectRatios',
      name: 'mediaAspectRatio',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  preview: {
    select: {
      product: 'product.store',
      settings: 'settings',
    },
    prepare({product, settings}: any) {
      return {
        title: product.title,
        subtitle: 'Featured Product',
        media: () =>
          settings.hide ? (
            <EyeOff />
          ) : product.previewImageUrl ? (
            <img src={product.previewImageUrl} alt={product.title} />
          ) : (
            <ImageIcon />
          ),
      };
    },
  },
});

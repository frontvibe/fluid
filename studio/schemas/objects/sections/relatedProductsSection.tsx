import {defineField} from 'sanity';
import {IconCollectionTag} from '../../../components/icons/CollectionTag';
import {EyeOff} from 'lucide-react';

export default defineField({
  name: 'relatedProductsSection',
  title: 'Related Products',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'maxProducts',
      title: 'Maximum products to show',
      type: 'rangeSlider',
      options: {
        min: 1,
        max: 25,
      },
      validation: (Rule: any) => Rule.required().min(1).max(25),
    }),
    defineField({
      name: 'desktopColumns',
      title: 'Number of columns on desktop',
      type: 'rangeSlider',
      options: {
        min: 1,
        max: 5,
      },
      validation: (Rule: any) => Rule.required().min(1).max(5),
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    maxProducts: 6,
    desktopColumns: 3,
  },
  preview: {
    select: {
      settings: 'settings',
    },
    prepare({settings}: any) {
      return {
        title: 'Related Products',
        media: () => (settings?.hide ? <EyeOff /> : <IconCollectionTag />),
      };
    },
  },
});

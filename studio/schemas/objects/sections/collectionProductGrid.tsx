import {defineField} from 'sanity';
import {EyeOff, LayoutGrid} from 'lucide-react';

export default defineField({
  name: 'collectionProductGridSection',
  title: 'Product Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'productsPerPage',
      type: 'rangeSlider',
      options: {
        min: 6,
        max: 20,
      },
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
      name: 'mobileColumns',
      title: 'Number of columns on mobile',
      type: 'rangeSlider',
      options: {
        min: 1,
        max: 2,
      },
      validation: (Rule: any) => Rule.required().min(1).max(2),
    }),
    defineField({
      name: 'enableFiltering',
      description: 'Customize filters with the Search & Discovery Shopify app.',
      type: 'boolean',
    }),
    defineField({
      name: 'enableSorting',
      type: 'boolean',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    productsPerPage: 8,
    desktopColumns: 4,
    mobileColumns: 2,
    enableFiltering: true,
    enableSorting: true,
  },
  preview: {
    select: {
      settings: 'settings',
    },
    prepare({settings}: any) {
      return {
        title: 'Collection Product Grid',
        media: () => (settings?.hide ? <EyeOff /> : <LayoutGrid />),
      };
    },
  },
});

import {ImageIcon} from '@sanity/icons';
import {EyeOff} from 'lucide-react';
import {defineField} from 'sanity';

export default defineField({
  name: 'featuredCollectionSection',
  title: 'Featured Collection',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      description:
        'Collection title from Shopify will be used if no heading is provided.',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'collection',
      type: 'reference',
      to: [{type: 'collection'}],
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
      name: 'viewAll',
      type: 'boolean',
      title: 'View all button',
      description: 'Show a button to view all products in the collection.',
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
      collection: 'collection.store',
      settings: 'settings',
    },
    prepare({collection, settings}: any) {
      return {
        title: collection.title,
        subtitle: 'Featured Collection',
        media: () =>
          settings?.hide ? (
            <EyeOff />
          ) : collection.imageUrl ? (
            <img src={collection.imageUrl} alt={collection.title} />
          ) : (
            <ImageIcon />
          ),
      };
    },
  },
});

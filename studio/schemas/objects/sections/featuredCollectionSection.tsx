import {defineField} from 'sanity';

export default defineField({
  name: 'featuredCollectionSection',
  title: 'Featured Collection',
  type: 'object',
  fields: [
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
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    maxProducts: 6,
  },
  preview: {
    select: {
      collection: 'collection.store',
    },
    prepare({collection}: any) {
      return {
        title: collection.title,
        subtitle: 'Featured Collection',
        media: () => <img src={collection.imageUrl} alt={collection.title} />,
      };
    },
  },
});

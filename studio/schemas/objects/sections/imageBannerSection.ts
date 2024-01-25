import {defineField} from 'sanity';

export default defineField({
  name: 'imageBannerSection',
  title: 'Image Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      type: 'contentAlignment',
      name: 'contentAlignment',
    }),
    defineField({
      type: 'boolean',
      name: 'animateContent',
      initialValue: false,
    }),
    defineField({
      type: 'image',
      name: 'backgroundImage',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bannerHeight',
      type: 'rangeSlider',
      options: {
        min: 0,
        max: 2000,
        suffix: 'px',
      },
      validation: (Rule: any) => Rule.min(0).max(2000),
    }),
    defineField({
      name: 'overlayOpacity',
      type: 'overlayOpacity',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    overlayOpacity: 0,
    contentAlignment: 'middle_center',
    bannerHeight: 450,
  },
  preview: {
    select: {
      title: 'title',
      media: 'backgroundImage',
    },
    prepare({title, media}: any) {
      return {
        title: title?.[0]?.value || 'Missing title',
        subtitle: 'Image Banner',
        media: media,
      };
    },
  },
});

import {EyeOff} from 'lucide-react';
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
      type: 'rangeSlider',
      options: {
        min: 0,
        max: 100,
        suffix: '%',
      },
      validation: (Rule: any) => Rule.min(0).max(100),
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
    settings: {
      padding: {
        top: 0,
        bottom: 0,
      },
    },
  },
  preview: {
    select: {
      title: 'title',
      media: 'backgroundImage',
      settings: 'settings',
    },
    prepare({title, media, settings}: any) {
      return {
        title: title?.[0]?.value || 'Missing title',
        subtitle: 'Image Banner',
        media: settings.hide ? EyeOff : media,
      };
    },
  },
});

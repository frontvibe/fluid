import {defineField} from 'sanity';
import {EyeOff, Image} from 'lucide-react';

export default defineField({
  name: 'collectionBannerSection',
  title: 'Collection Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'showImage',
      title: 'Show collection image',
      description: 'For best results, use an image with a 16:9 aspect ratio.',
      type: 'boolean',
    }),
    defineField({
      name: 'showDescription',
      title: 'Show collection description',
      type: 'boolean',
    }),
    defineField({
      type: 'contentPosition',
      name: 'contentPosition',
    }),
    defineField({
      name: 'contentAlignment',
      type: 'string',
      options: {
        list: [
          {
            title: 'Left',
            value: 'left',
          },
          {
            title: 'Center',
            value: 'center',
          },
          {
            title: 'Right',
            value: 'right',
          },
        ],
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
    contentPosition: 'middle_center',
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
      settings: 'settings',
    },
    prepare({settings}: any) {
      return {
        title: 'Collection Banner',
        media: () => (settings?.hide ? <EyeOff /> : <Image />),
      };
    },
  },
});

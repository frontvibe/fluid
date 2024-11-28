import {EyeOff, GalleryHorizontal} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';

export default defineField({
  name: 'carouselSection',
  title: 'Carousel',
  type: 'object',
  preview: {
    select: {
      title: 'title',
      settings: 'settings',
    },
    prepare({title, settings}: any) {
      return {
        title: title?.[0]?.value || 'Missing title',
        media: settings.hide ? EyeOff : GalleryHorizontal,
      };
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'pagination',
      title: 'Enable dot pagination',
      type: 'boolean',
    }),
    defineField({
      name: 'arrows',
      title: 'Enable arrows navigation',
      type: 'boolean',
    }),
    defineField({
      name: 'autoplay',
      title: 'Enable autoplay',
      type: 'boolean',
    }),
    defineField({
      name: 'loop',
      title: 'Enable infinite looping',
      type: 'boolean',
    }),
    defineField({
      name: 'slidesPerViewDesktop',
      type: 'rangeSlider',
      options: {
        min: 1,
        max: 10,
      },
    }),
    defineField({
      name: 'slides',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'slide',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
            }),
          ],
          preview: {
            select: {
              media: 'image',
            },
            prepare(context) {
              return {
                title: 'Slide',
                media: context.media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    pagination: true,
    arrows: true,
    autoplay: false,
    loop: false,
    slidesPerViewDesktop: 3,
  },
});

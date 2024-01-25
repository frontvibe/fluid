import {TextSelect} from 'lucide-react';
import {defineField} from 'sanity';

export default defineField({
  name: 'richtextSection',
  title: 'Richtext',
  type: 'object',
  fields: [
    defineField({
      name: 'richtext',
      type: 'internationalizedArrayRichtext',
    }),
    defineField({
      name: 'desktopContentPosition',
      description: 'Position is automatically optimized for mobile.',
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
      name: 'contentAlignment',
      title: 'Content Alignment',
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
      name: 'maxWidth',
      title: 'Content Max Width',
      type: 'rangeSlider',
      options: {
        min: 0,
        max: 1920,
        suffix: 'px',
      },
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    desktopContentPosition: 'center',
    contentAlignment: 'left',
    maxWidth: 900,
  },
  preview: {
    prepare() {
      return {
        title: 'Richtext',
        media: () => <TextSelect />,
      };
    },
  },
});

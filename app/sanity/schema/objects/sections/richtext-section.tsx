import {EyeOff, TextSelect} from 'lucide-react';
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
      type: 'contentAlignment',
    }),
    defineField({
      name: 'contentAlignment',
      type: 'contentAlignment',
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
    select: {
      settings: 'settings',
    },
    prepare({settings}) {
      return {
        title: 'Richtext',
        media: () => (settings?.hide ? <EyeOff /> : <TextSelect />),
      };
    },
  },
});

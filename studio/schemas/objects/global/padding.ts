import {defineField} from 'sanity';

export default defineField({
  name: 'padding',
  title: 'Padding',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'top',
      title: 'Top padding',
      type: 'rangeSlider',
      options: {
        min: 0,
        max: 200,
        suffix: 'px',
      },
      validation: (Rule: any) => Rule.min(0).max(200),
    }),
    defineField({
      name: 'bottom',
      title: 'Bottom padding',
      type: 'rangeSlider',
      options: {
        min: 0,
        max: 200,
        suffix: 'px',
      },
      validation: (Rule: any) => Rule.min(0).max(200),
    }),
  ],
  initialValue: {
    top: 80,
    bottom: 80,
  },
});

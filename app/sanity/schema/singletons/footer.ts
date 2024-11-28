import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'footer',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'sections',
      type: 'sections',
      description:
        'Sections you add here will be displayed above the footer and will appear on all pages. Useful if you need to display a Newsletter signup form or a CTA.',
    }),
    defineField({
      name: 'footers',
      title: 'Footer section',
      type: 'footers',
      description: 'Select a footer design you want to use (max 1).',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Footer'}),
  },
});

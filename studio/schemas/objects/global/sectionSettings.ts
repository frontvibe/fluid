import {defineField} from 'sanity';

export default defineField({
  type: 'object',
  name: 'sectionSettings',
  fields: [
    defineField({
      name: 'hide',
      title: 'Hide section',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'colorScheme',
      title: 'Color scheme',
      type: 'reference',
      to: [{type: 'colorScheme'}],
    }),
    defineField({
      name: 'padding',
      title: 'Padding',
      type: 'padding',
      initialValue: {
        top: 80,
        bottom: 80,
      },
    }),
    defineField({
      type: 'code',
      name: 'customCss',
      title: 'Custom CSS',
      options: {
        language: 'css',
        languageAlternatives: [
          {
            title: 'CSS',
            value: 'css',
          },
        ],
      },
    }),
  ],
});

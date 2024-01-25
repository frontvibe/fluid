import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'home',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'sections',
      type: 'sections',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Home'}),
  },
});

import {defineField} from 'sanity';

export default defineField({
  name: 'socialLinksOnly',
  title: 'Social Links Only',
  type: 'object',
  fields: [
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'internationalizedArrayString',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  preview: {
    select: {
      title: 'copyright',
    },
    prepare({title}: any) {
      return {
        title: title?.[0]?.value || 'Missing title',
      };
    },
  },
});

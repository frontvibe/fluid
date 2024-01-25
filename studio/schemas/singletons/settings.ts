import {defineField, defineType} from 'sanity';

export default defineType({
  title: 'Settings',
  name: 'settings',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      title: 'Logo',
      name: 'logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      title: 'Favicon',
      description: 'Will be scaled down to 32 x 32px',
      name: 'favicon',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      title: 'Social media',
      name: 'socialMedia',
      type: 'object',
      fields: [
        defineField({
          title: 'Facebook',
          name: 'facebook',
          type: 'url',
        }),
        defineField({
          title: 'Instagram',
          name: 'instagram',
          type: 'url',
        }),
        defineField({
          title: 'Twitter',
          name: 'twitter',
          type: 'url',
        }),
        defineField({
          title: 'YouTube',
          name: 'youtube',
          type: 'url',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    prepare: () => ({title: 'Settings'}),
  },
});

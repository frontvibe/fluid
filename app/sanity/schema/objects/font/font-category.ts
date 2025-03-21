import {StringIcon} from '@sanity/icons';
import {defineArrayMember, defineField} from 'sanity';

export default defineField({
  type: 'object',
  name: 'fontCategory',
  icon: StringIcon,
  fields: [
    defineField({
      type: 'string',
      name: 'fontName',
      title: 'Font name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: 'string',
      name: 'fontType',
      title: 'Font type',
      description:
        'Select a font type (will be used to display a fallback stystem font while loading the font assets).',
      options: {
        list: [
          {
            title: 'Serif',
            value: 'serif',
          },
          {
            title: 'Sans-serif',
            value: 'sans-serif',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'sans-serif',
    }),
    defineField({
      type: 'boolean',
      name: 'antialiased',
      title: 'Antialiasing',
      description: 'Enable antialiasing to smooth the font.',
    }),
    defineField({
      name: 'fontAssets',
      title: 'Font assets',
      type: 'array',
      of: [defineArrayMember({type: 'fontAsset'})],
      validation: (Rule) =>
        Rule.custom(
          (value) =>
            (value && value?.length > 0) ||
            'At least one font asset is required.',
        ),
    }),
  ],
});

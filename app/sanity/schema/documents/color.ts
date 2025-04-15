import type {StringRule, ValidationContext} from 'sanity';

import {defineField, defineType} from 'sanity';

import IconPalette from '~/sanity/components/icons/palette-icon';

import ColorSchemeMedia from '../../components/color-scheme';
import {validateDefaultStatus} from '../../utils/set-as-default-validation';

export default defineType({
  name: 'colorScheme',
  title: 'Color schemes',
  type: 'document',
  __experimental_formPreviewTitle: false,
  icon: IconPalette,
  fields: [
    defineField({
      name: 'name',
      title: 'Scheme name',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required(),
    }),
    defineField({
      name: 'default',
      title: 'Set as default color scheme',
      type: 'boolean',
      validation: (Rule) =>
        Rule.required().custom(
          async (value, context: ValidationContext) =>
            await validateDefaultStatus(value, context),
        ),
      initialValue: false,
    }),
    defineField({
      name: 'background',
      type: 'colorPicker',
    }),
    defineField({
      name: 'foreground',
      type: 'colorPicker',
    }),
    defineField({
      name: 'primary',
      type: 'colorPicker',
    }),
    defineField({
      name: 'primaryForeground',
      type: 'colorPicker',
    }),
    defineField({
      name: 'border',
      title: 'Lines, borders and inputs',
      type: 'colorPicker',
    }),
    defineField({
      name: 'card',
      title: 'Card background',
      type: 'colorPicker',
    }),
    defineField({
      name: 'cardForeground',
      type: 'colorPicker',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'default',
      background: 'background',
      foreground: 'foreground',
    },
    prepare({title, subtitle, background, foreground}) {
      return {
        title,
        subtitle: subtitle ? 'Default color scheme' : undefined,
        media: ColorSchemeMedia({background, foreground}),
      };
    },
  },
});

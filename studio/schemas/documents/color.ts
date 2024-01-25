import {StringRule, ValidationContext, defineField, defineType} from 'sanity';
import {IconPalette} from '../../components/icons/Palette';
import {ColorSchemeMedia} from '../../components/ColorScheme';
import {validateDefaultStatus} from '../../utils/setAsDefaultValidation';

export default defineType({
  name: 'colorScheme',
  title: 'Color schemes',
  type: 'document',
  __experimental_formPreviewTitle: false,
  icon: IconPalette,
  preview: {
    select: {
      title: 'name',
      subtitle: 'default',
      background: 'background',
      text: 'text',
    },
    prepare({title, subtitle, background, text}: any) {
      return {
        title,
        subtitle: subtitle ? 'Default template' : undefined,
        media: ColorSchemeMedia({background, text}),
      };
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Scheme name',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required(),
    }),
    defineField({
      name: 'default',
      title: 'Set as default template',
      type: 'boolean',
      validation: (Rule) =>
        Rule.required().custom(async (value, context: ValidationContext) =>
          validateDefaultStatus(value, context),
        ),
      initialValue: false,
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'colorPicker',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'colorPicker',
    }),
    defineField({
      name: 'primaryButtonBackground',
      type: 'colorPicker',
    }),
    defineField({
      name: 'primaryButtonLabel',
      type: 'colorPicker',
    }),
    defineField({
      name: 'outlineButton',
      type: 'colorPicker',
    }),
  ],
});

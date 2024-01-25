import {StringRule, ValidationContext, defineField, defineType} from 'sanity';
import {validateDefaultStatus} from '../../utils/setAsDefaultValidation';
import {LayoutTemplate} from 'lucide-react';

export default defineType({
  name: 'collectionTemplate',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'name',
      title: 'Template name',
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
      name: 'sections',
      type: 'collectionSections',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'default',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle ? 'Default template' : undefined,
        media: LayoutTemplate,
      };
    },
  },
});

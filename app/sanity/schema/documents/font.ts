import {StringIcon} from '@sanity/icons';
import {defineArrayMember, defineField, defineType} from 'sanity';

import ArrayMaxItems from '~/sanity/components/array-max-items';

export default defineType({
  name: 'typography',
  type: 'document',
  icon: StringIcon,
  title: 'Typography',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'heading',
      type: 'object',
      fields: [
        defineField({
          name: 'font',
          type: 'array',
          of: [defineArrayMember({type: 'fontCategory'})],
          components: {input: ArrayMaxItems},
          validation: (Rule) => Rule.max(1),
        }),
        defineField({
          type: 'boolean',
          name: 'capitalize',
        }),
        defineField({
          type: 'rangeSlider',
          name: 'baseSize',
          options: {
            suffix: 'px',
            min: 20,
            max: 90,
          },
          initialValue: 50,
        }),
        defineField({
          type: 'rangeSlider',
          name: 'letterSpacing',
          options: {
            suffix: 'px',
            min: -20,
            max: 50,
          },
          initialValue: 0,
        }),
        defineField({
          type: 'rangeSlider',
          name: 'lineHeight',
          options: {
            min: 0.8,
            max: 2,
            step: 0.025,
          },
          initialValue: 1.2,
        }),
      ],
      options: {
        collapsible: true,
      },
      initialValue: {
        baseSize: 50,
        letterSpacing: 0,
        lineHeight: 1.2,
      },
    }),
    defineField({
      type: 'object',
      name: 'body',
      fields: [
        defineField({
          name: 'font',
          type: 'array',
          of: [defineArrayMember({type: 'fontCategory'})],
          components: {input: ArrayMaxItems},
          validation: (Rule) => Rule.max(1),
        }),
        defineField({
          type: 'rangeSlider',
          name: 'baseSize',
          options: {
            suffix: 'px',
            min: 12,
            max: 38,
          },
          initialValue: 16,
        }),
        defineField({
          type: 'rangeSlider',
          name: 'letterSpacing',
          options: {
            suffix: 'px',
            min: -20,
            max: 50,
          },
          initialValue: 0,
        }),
        defineField({
          type: 'rangeSlider',
          name: 'lineHeight',
          options: {
            min: 0.8,
            max: 2,
            step: 0.2,
          },
          initialValue: 1.2,
        }),
      ],
      options: {
        collapsible: true,
      },
      initialValue: {
        baseSize: 16,
        letterSpacing: 0,
        lineHeight: 1.2,
      },
    }),
    defineField({
      type: 'object',
      name: 'extra',
      fields: [
        defineField({
          name: 'font',
          type: 'array',
          of: [defineArrayMember({type: 'fontCategory'})],
          components: {input: ArrayMaxItems},
          validation: (Rule) => Rule.max(1),
        }),
        defineField({
          type: 'boolean',
          name: 'capitalize',
        }),
        defineField({
          type: 'rangeSlider',
          name: 'baseSize',
          options: {
            suffix: 'px',
            min: 12,
            max: 150,
          },
        }),
        defineField({
          type: 'rangeSlider',
          name: 'letterSpacing',
          options: {
            suffix: 'px',
            min: -20,
            max: 50,
          },
        }),
        defineField({
          type: 'rangeSlider',
          name: 'lineHeight',
          options: {
            min: 0.8,
            max: 2,
            step: 0.2,
          },
        }),
      ],
      initialValue: {
        baseSize: 16,
        letterSpacing: 0,
        lineHeight: 1.2,
      },
      options: {
        collapsible: true,
      },
    }),
  ],
  preview: {
    prepare: () => ({title: 'Typography'}),
  },
});

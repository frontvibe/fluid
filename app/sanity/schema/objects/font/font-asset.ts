import type {File, FileRule} from 'sanity';

import {StringIcon} from '@sanity/icons';
import {defineField} from 'sanity';

const fontWeights = [
  {title: 'Thin - 100', value: 100},
  {title: 'Extralight - 200', value: 200},
  {title: 'Light - 300', value: 300},
  {title: 'Normal - 400', value: 400},
  {title: 'Medium - 500', value: 500},
  {title: 'Semibold - 600', value: 600},
  {title: 'Bold - 700', value: 700},
  {title: 'Extrabold - 800', value: 800},
  {title: 'Black - 900', value: 900},
];

function validateFont(args: {
  mimeType: 'ttf' | 'woff2' | 'woff';
  Rule: FileRule;
}) {
  const {Rule, mimeType} = args;

  return Rule.custom((file) => {
    if (!file || !file.asset) {
      return true;
    }

    const ref = file.asset?._ref;

    if (ref?.endsWith(`-${mimeType}`)) {
      return true;
    }

    return `Only .${mimeType} files are allowed.`;
  });
}

export default defineField({
  name: 'fontAsset',
  type: 'object',
  icon: StringIcon,
  fields: [
    defineField({
      type: 'file',
      name: 'woff2',
      title: 'WOFF2 file',
      description:
        'Used in priority, it is the most modern font format, lighter and faster to load.',
      validation: (Rule) =>
        validateFont({
          mimeType: 'woff2',
          Rule,
        }),
    }),
    defineField({
      type: 'file',
      name: 'woff',
      title: 'WOFF file',
      description:
        "Used as a fallback for older browsers that don't support WOFF2.",
      validation: (Rule) =>
        validateFont({
          mimeType: 'woff',
          Rule,
        }),
    }),
    defineField({
      type: 'file',
      name: 'ttf',
      title: 'TTF file',
      description:
        'TTF can be useful for extending support to some older browsers, especially on mobile, if you need it.',
      validation: (Rule) =>
        validateFont({
          mimeType: 'ttf',
          Rule,
        }),
    }),
    defineField({
      type: 'string',
      name: 'fontStyle',
      title: 'Font style',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Normal', value: 'normal'},
          {title: 'Italic', value: 'italic'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      type: 'number',
      name: 'fontWeight',
      title: 'Font weight',
      validation: (Rule) => Rule.required(),
      options: {
        list: fontWeights,
        layout: 'dropdown',
      },
    }),
  ],
  preview: {
    select: {
      title: 'fontWeight',
      subtitle: 'fontStyle',
    },
    prepare(selection: Record<string, any>) {
      const fontWeight = fontWeights.find(
        (item) => item.value === parseFloat(selection.title),
      );
      return {
        title: fontWeight?.title,
        subtitle: `Font style: ${selection.subtitle}`,
      };
    },
  },
});

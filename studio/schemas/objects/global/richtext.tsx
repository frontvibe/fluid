import {defineArrayMember, defineField} from 'sanity';
import {internalLinkField} from './headerNavigation';
import {ExternalLink, Link, SquareMousePointer} from 'lucide-react';

export const internalLinkFields = [
  internalLinkField,
  defineField({
    name: 'anchor',
    description: 'The ID of the element to scroll to, without the #.',
    type: 'string',
  }),
];

export default defineField({
  name: 'richtext',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike-through', value: 'strike-through'},
        ],
        annotations: [
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            icon: () => <Link size="1em" strokeWidth={1} />,
            fields: [...internalLinkFields],
          },
          {
            name: 'externalLink',
            type: 'object',
            title: 'External link',
            icon: () => <ExternalLink size="1em" strokeWidth={1} />,
            fields: [
              defineField({
                name: 'link',
                type: 'url',
              }),
              defineField({
                name: 'openInNewTab',
                type: 'boolean',
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      fields: [
        {
          name: 'maxWidth',
          type: 'rangeSlider',
          options: {
            min: 0,
            max: 3840,
            suffix: 'px',
          },
        },
        {
          name: 'alignment',
          type: 'string',
          options: {
            list: [
              {
                title: 'Left',
                value: 'left',
              },
              {
                title: 'Center',
                value: 'center',
              },
              {
                title: 'Right',
                value: 'right',
              },
            ],
          },
        },
      ],
      options: {
        hotspot: true,
      },
      initialValue: {
        maxWidth: 900,
        alignment: 'center',
      },
    }),
    defineArrayMember({
      name: 'button',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          type: 'string',
        }),
        ...internalLinkFields,
      ],
      icon: () => <SquareMousePointer size="1em" />,
      preview: {
        select: {
          title: 'label',
        },
        prepare: ({title}) => {
          return {
            title: title ? title : 'Button',
          };
        },
      },
    }),
  ],
});

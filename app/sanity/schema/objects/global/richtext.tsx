import {ExternalLink, Link, SquareMousePointer} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';

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
            icon: () => (
              <Link
                aria-label="Internal link icon"
                size="1em"
                strokeWidth={1}
              />
            ),
            fields: [
              defineField({
                name: 'link',
                type: 'link',
              }),
              defineField({
                name: 'anchor',
                type: 'anchor',
              }),
            ],
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
        defineField({
          name: 'maxWidth',
          type: 'rangeSlider',
          options: {
            min: 0,
            max: 3840,
            suffix: 'px',
          },
        }),
        defineField({
          name: 'alignment',
          type: 'contentAlignment',
        }),
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
      type: 'button',
    }),
  ],
});

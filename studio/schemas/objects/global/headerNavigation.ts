import {defineArrayMember, defineField} from 'sanity';
import {ExternalLink, Link, MenuSquare} from 'lucide-react';

export const internalLinkField = defineField({
  name: 'link',
  title: 'Internal link',
  type: 'reference',
  to: [
    {type: 'home'},
    {type: 'page'},
    {type: 'product'},
    {type: 'collection'},
    {type: 'blogPost'},
  ],
});

export const internalLinkObject = {
  type: 'object',
  name: 'internalLink',
  icon: Link,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    internalLinkField,
    defineField({
      name: 'anchor',
      description: 'The ID of the element to scroll to, without the #.',
      type: 'string',
    }),
  ],
};

export const externalLinkObject = {
  type: 'object',
  name: 'externalLink',
  icon: ExternalLink,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'link',
      type: 'url',
    }),
    defineField({
      name: 'openInNewTab',
      type: 'boolean',
    }),
  ],
};

export const nestedNav = {
  type: 'object',
  name: 'nestedNavigation',
  icon: MenuSquare,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    internalLinkField,
    defineField({
      name: 'childLinks',
      type: 'array',
      of: [
        defineArrayMember(internalLinkObject),
        defineArrayMember(externalLinkObject),
      ],
    }),
  ],
};

export default defineField({
  name: 'headerNavigation',
  type: 'array',
  of: [
    defineArrayMember(internalLinkObject),
    defineArrayMember(externalLinkObject),
    defineArrayMember(nestedNav),
  ],
});

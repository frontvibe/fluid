import {Megaphone} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';
import {internalLinkField} from './headerNavigation';

export default defineField({
  type: 'array',
  name: 'announcementBar',
  of: [
    defineArrayMember({
      type: 'object',
      name: 'announcement',
      icon: Megaphone,
      fields: [
        defineField({
          name: 'text',
          type: 'string',
        }),
        internalLinkField,
        defineField({
          name: 'externalLink',
          description: "Will be used if internal link isn't provided.",
          type: 'url',
        }),
        defineField({
          name: 'openInNewTab',
          title: 'Open external link in new tab',
          type: 'boolean',
        }),
      ],
    }),
  ],
});

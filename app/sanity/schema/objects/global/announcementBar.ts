import {Megaphone} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';

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
        defineField({
          name: 'link',
          type: 'link',
        }),
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

import {Megaphone} from 'lucide-react';
import {defineField} from 'sanity';
import {internalLinkField} from './headerNavigation';

export default defineField({
  type: 'array',
  name: 'announcementBar',
  of: [
    {
      type: 'object',
      name: 'announcement',
      icon: Megaphone,
      fields: [
        defineField({
          name: 'text',
          type: 'string',
        }),
        internalLinkField,
      ],
    },
  ],
});

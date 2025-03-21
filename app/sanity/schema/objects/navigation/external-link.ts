import {ExternalLink} from 'lucide-react';
import {defineField} from 'sanity';

export default defineField({
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
});

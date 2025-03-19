import {Link} from 'lucide-react';
import {defineField} from 'sanity';

export default defineField({
  type: 'object',
  name: 'internalLink',
  icon: Link,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'link',
      type: 'link',
    }),
    defineField({
      name: 'anchor',
      type: 'anchor',
    }),
  ],
});

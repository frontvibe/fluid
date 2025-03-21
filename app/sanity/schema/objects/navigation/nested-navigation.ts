import {MenuSquare} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';

export default defineField({
  type: 'object',
  name: 'nestedNavigation',
  icon: MenuSquare,
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
      name: 'childLinks',
      type: 'array',
      of: [
        defineArrayMember({type: 'internalLink'}),
        defineArrayMember({type: 'externalLink'}),
      ],
    }),
  ],
});

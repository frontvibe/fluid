import {defineArrayMember, defineField} from 'sanity';

export default defineField({
  name: 'headerNavigation',
  type: 'array',
  of: [
    defineArrayMember({type: 'internalLink'}),
    defineArrayMember({type: 'externalLink'}),
    defineArrayMember({type: 'nestedNavigation'}),
  ],
});

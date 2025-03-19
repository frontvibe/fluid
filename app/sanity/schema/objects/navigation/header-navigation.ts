import {defineArrayMember, defineField} from 'sanity';

export default defineField({
  name: 'headerNavigation',
  type: 'array',
  of: [
    defineArrayMember({type: 'internalLink', name: 'internalLink'}),
    defineArrayMember({type: 'externalLink', name: 'externalLink'}),
    defineArrayMember({type: 'nestedNavigation', name: 'nestedNavigation'}),
  ],
});

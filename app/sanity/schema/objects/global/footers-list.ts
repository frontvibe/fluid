import {defineArrayMember, defineField} from 'sanity';

import ArrayMaxRule from '../../../components/array-max-rule';
import {sectionOptionInsertMenu} from './sections-list';
export default defineField({
  title: 'Footers',
  name: 'footers',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'socialLinksOnly',
    }),
  ],
  options: {
    ...sectionOptionInsertMenu,
  },
  components: {
    input: ArrayMaxRule,
  },
  validation: (Rule) => Rule.min(0).max(1),
});

import {defineArrayMember, defineField} from 'sanity';

import {ArrayMaxRule} from '../../../components/ArrayMaxRule';
import {sectionOptionInsertMenu} from './sectionsList';
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
  validation: (Rule: any) => Rule.min(0).max(1),
});

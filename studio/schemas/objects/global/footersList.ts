import {defineArrayMember, defineField} from 'sanity';
import {sectionOptionInsertMenu} from './sectionsList';
import {ArrayMaxRule} from '../../../components/ArrayMaxRule';
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

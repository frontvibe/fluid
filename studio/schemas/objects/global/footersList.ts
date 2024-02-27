import {ArrayOfObjectsInputProps, defineArrayMember, defineField} from 'sanity';

import SectionsListInput from '../../../components/SectionsListInput';

export default defineField({
  title: 'Footers',
  name: 'footers',
  type: 'array',
  group: 'pagebuilder',
  of: [
    defineArrayMember({
      type: 'socialLinksOnly',
    }),
  ],
  components: {
    input: (props: ArrayOfObjectsInputProps) =>
      SectionsListInput({type: 'footer', ...props}),
  },
  validation: (Rule: any) => Rule.max(1),
});

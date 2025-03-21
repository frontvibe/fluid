import {SunIcon} from '@sanity/icons';
import {defineArrayMember, defineField} from 'sanity';

export default defineField({
  title: 'Product option',
  name: 'option',
  type: 'object',
  icon: SunIcon,
  readOnly: true,
  fields: [
    // Name
    defineField({
      title: 'Name',
      name: 'name',
      type: 'string',
    }),
    // Values
    defineField({
      title: 'Values',
      name: 'values',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare(selection) {
      const {name} = selection;

      return {
        title: name,
      };
    },
  },
});

import {SquareMousePointer} from 'lucide-react';
import {defineField} from 'sanity';

export default defineField({
  name: 'button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
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
  icon: () => <SquareMousePointer size="1em" />,
  preview: {
    select: {
      title: 'label',
    },
    prepare: ({title}) => {
      return {
        title: title ? title : 'Button',
      };
    },
  },
});

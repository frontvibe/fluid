import {defineField} from 'sanity';

export default defineField({
  name: 'contentAlignment',
  type: 'string',
  options: {
    list: [
      {
        title: 'Left',
        value: 'left',
      },
      {
        title: 'Center',
        value: 'center',
      },
      {
        title: 'Right',
        value: 'right',
      },
    ],
  },
});

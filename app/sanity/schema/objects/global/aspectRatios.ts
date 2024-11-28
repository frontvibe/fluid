import {defineField} from 'sanity';

export default defineField({
  type: 'string',
  name: 'aspectRatios',
  options: {
    list: [
      {
        title: 'Square (1/1)',
        value: 'square',
      },
      {
        title: 'Video (16/9)',
        value: 'video',
      },
      {
        title: 'Original',
        value: 'auto',
      },
    ],
    layout: 'radio',
  },
  initialValue: 'video',
});

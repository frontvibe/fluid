import {defineField} from 'sanity';

export default defineField({
  name: 'contentPosition',
  type: 'string',
  options: {
    list: [
      {
        title: 'Top Left',
        value: 'top_left',
      },
      {
        title: 'Top Center',
        value: 'top_center',
      },
      {
        title: 'Top Right',
        value: 'top_right',
      },
      {
        title: 'Middle Left',
        value: 'middle_left',
      },
      {
        title: 'Middle Center',
        value: 'middle_center',
      },
      {
        title: 'Middle Right',
        value: 'middle_right',
      },
      {
        title: 'Bottom Left',
        value: 'bottom_left',
      },
      {
        title: 'Bottom Center',
        value: 'bottom_center',
      },
      {
        title: 'Bottom Right',
        value: 'bottom_right',
      },
    ],
  },
  initialValue: 'middle_center',
});

import {defineField, defineType} from 'sanity';

import {ColorPickerInput} from '../components/color-picker-input';

export default defineType({
  name: 'colorPicker',
  type: 'object',
  title: 'Color',
  components: {input: ColorPickerInput},
  fields: [
    defineField({
      name: 'hex',
      type: 'string',
      title: 'Hex',
    }),
    defineField({
      name: 'hsl',
      type: 'object',
      title: 'HSL',
      fields: [
        defineField({
          name: 'h',
          type: 'number',
          title: 'H',
        }),
        defineField({
          name: 's',
          type: 'number',
          title: 'S',
        }),
        defineField({
          name: 'l',
          type: 'number',
          title: 'L',
        }),
      ],
    }),
    {
      name: 'rgb',
      type: 'object',
      title: 'RGB',
      fields: [
        defineField({
          name: 'r',
          type: 'number',
          title: 'R',
        }),
        defineField({
          name: 'g',
          type: 'number',
          title: 'G',
        }),
        defineField({
          name: 'b',
          type: 'number',
          title: 'B',
        }),
      ],
    },
  ],
});

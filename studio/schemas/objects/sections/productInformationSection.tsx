import {defineField} from 'sanity';
import {IconTag} from '../../../components/icons/Tag';
import {EyeOff} from 'lucide-react';

export default defineField({
  name: 'productInformationSection',
  title: 'Product Information',
  type: 'object',
  fields: [
    defineField({
      name: 'richtext',
      type: 'internationalizedArrayProductRichtext',
    }),
    defineField({
      type: 'string',
      name: 'desktopMediaWidth',
      options: {
        list: [
          {
            title: 'Small',
            value: 'small',
          },
          {
            title: 'Medium',
            value: 'medium',
          },
          {
            title: 'Large',
            value: 'large',
          },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      type: 'string',
      name: 'desktopMediaPosition',
      options: {
        list: [
          {
            title: 'Left',
            value: 'left',
          },
          {
            title: 'Right',
            value: 'right',
          },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      type: 'aspectRatios',
      name: 'mediaAspectRatio',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  preview: {
    select: {
      settings: 'settings',
    },
    prepare({settings}: any) {
      return {
        title: 'Product Information',
        media: () => (settings?.hide ? <EyeOff /> : <IconTag />),
      };
    },
  },
});

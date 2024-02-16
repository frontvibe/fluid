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

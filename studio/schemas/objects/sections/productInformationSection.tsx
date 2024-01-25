import {defineField} from 'sanity';
import {IconTag} from '../../../components/icons/Tag';

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
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Product Information',
        media: () => <IconTag />,
      };
    },
  },
});

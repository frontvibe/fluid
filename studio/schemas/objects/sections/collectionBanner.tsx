import {defineField} from 'sanity';
import {EyeOff, Image} from 'lucide-react';

export default defineField({
  name: 'collectionBannerSection',
  title: 'Collection Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'showImage',
      title: 'Show collection image',
      description: 'For best results, use an image with a 16:9 aspect ratio.',
      type: 'boolean',
    }),
    defineField({
      name: 'showDescription',
      title: 'Show collection description',
      type: 'boolean',
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
        title: 'Collection Banner',
        media: () => settings.hide ? <EyeOff/> : <Image />,
      };
    },
  },
});

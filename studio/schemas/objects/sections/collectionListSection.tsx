import {EyeOff, LayoutGrid} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';

export default defineField({
  name: 'collectionListSection',
  title: 'Collection List',
  type: 'object',
  fields: [
    defineField({
      name: 'collections',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [
        defineArrayMember({
          name: 'collection',
          type: 'reference',
          to: [{type: 'collection'}],
        }),
      ],
      validation: (Rule: any) =>
        Rule.custom((array: any) => {
          return checkForDuplicates(array);
        }),
    }),
    defineField({
      name: 'desktopColumns',
      title: 'Number of columns on desktop',
      type: 'rangeSlider',
      options: {
        min: 1,
        max: 5,
      },
      validation: (Rule: any) => Rule.required().min(1).max(5),
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
        title: 'Collection List',
        media: () => (settings?.hide ? <EyeOff /> : <LayoutGrid />),
      };
    },
  },
});

function checkForDuplicates<T>(array?: T[]): string | true {
  const uniqueSet = new Set<T>();

  if (!array || array.length === 0) {
    return 'Please add at least one collection.';
  }

  for (const item of array as any) {
    if (uniqueSet.has(item._ref)) {
      return 'Duplicate collection found. Please remove it from the list.';
    }

    uniqueSet.add(item._ref);
  }

  return true;
}

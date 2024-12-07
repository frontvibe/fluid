import type {InsertMenuOptions} from 'sanity';

import {defineField} from 'sanity';

const globalSections = [
  {
    type: 'imageBannerSection',
  },
  {
    type: 'featuredCollectionSection',
  },
  {
    type: 'featuredProductSection',
  },
  {
    type: 'collectionListSection',
  },
  {
    type: 'carouselSection',
  },
  {
    type: 'richtextSection',
  },
];

const pdpSections = [
  {
    type: 'productInformationSection',
  },
  {
    type: 'relatedProductsSection',
  },
  ...globalSections,
];

const collectionSectionsList = [
  {
    type: 'collectionBannerSection',
  },
  {
    type: 'collectionProductGridSection',
  },
  ...globalSections,
];

export const sectionOptionInsertMenu: {insertMenu: InsertMenuOptions} = {
  insertMenu: {
    views: [
      {
        name: 'grid',
        previewImageUrl: (schemaTypeName) =>
          `/sanity/assets/${schemaTypeName}.jpg`,
      },
    ],
  },
};

export default defineField({
  title: 'Sections',
  name: 'sections',
  type: 'array',
  group: 'pagebuilder',
  of: globalSections,
  options: {
    ...sectionOptionInsertMenu,
  },
});

export const productSections = defineField({
  title: 'Sections',
  name: 'productSections',
  type: 'array',
  group: 'pagebuilder',
  of: pdpSections,
  options: {
    ...sectionOptionInsertMenu,
  },
});

export const collectionSections = defineField({
  title: 'Sections',
  name: 'collectionSections',
  type: 'array',
  group: 'pagebuilder',
  of: collectionSectionsList,
  options: {
    ...sectionOptionInsertMenu,
  },
});

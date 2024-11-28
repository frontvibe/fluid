import type {ListItemBuilder} from 'sanity/structure';

import {IconCollectionTag} from '../components/icons/CollectionTag';
import defineStructure from '../utils/defineStructure';

export const collections = defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Collections')
    .schemaType('collection')
    .icon(IconCollectionTag)
    .child(S.documentTypeList('collection')),
);

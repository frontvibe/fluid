import type {ListItemBuilder} from 'sanity/structure';

import IconCollectionTag from '../components/icons/collection-tag-icon';
import defineStructure from '../utils/define-structure';

export const collections = defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Collections')
    .schemaType('collection')
    .icon(IconCollectionTag)
    .child(S.documentTypeList('collection')),
);

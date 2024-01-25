import type {CSSProperties} from 'react';
import type {CollectionsQuery} from 'storefrontapi.generated';

import {flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import {CollectionCard} from './CollectionCard';

export function CollectionListGrid(props: {
  collections?: CollectionsQuery['collections'];
  columns?: null | number;
}) {
  const collections = props.collections?.nodes.length
    ? flattenConnection(props.collections)
    : [];
  const columnsVar = {
    '--columns': props.columns ?? 3,
  } as CSSProperties;

  return collections?.length > 0 ? (
    <ul
      className={cx([
        'grid gap-6',
        'lg:grid-cols-[repeat(var(--columns),_minmax(0,_1fr))]',
      ])}
      style={columnsVar}
    >
      {collections.map((collection) => (
        <li key={collection.id}>
          <CollectionCard collection={collection} columns={props.columns} />
        </li>
      ))}
    </ul>
  ) : null;
}

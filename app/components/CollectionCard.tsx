import type {CollectionsQuery} from 'storefrontapi.generated';

import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import {cardClassName} from './product/ProductCard';

export function CollectionCard(props: {
  className?: string;
  collection: CollectionsQuery['collections']['nodes'][0];
  columns?: null | number;
}) {
  const {collection} = props;
  const sizes = cx([
    '(min-width: 1024px)',
    props.columns ? `${100 / props.columns}vw,` : '33vw,',
    '100vw',
  ]);

  return (
    <Link prefetch="intent" to={`/collections/${collection.handle}`}>
      <div className={cardClassName}>
        {collection.image && (
          <Image
            aspectRatio="16/9"
            className="h-auto w-full object-cover"
            data={collection.image}
            sizes={sizes}
          />
        )}
        <div className="p-3">
          <div className="text-lg">{collection.title}</div>
        </div>
      </div>
    </Link>
  );
}

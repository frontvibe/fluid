import type {CollectionsQuery} from 'storefrontapi.generated';

import {Link} from '@remix-run/react';
import {cx} from 'class-variance-authority';

import {useLocalePath} from '~/hooks/useLocalePath';

import {ShopifyImage} from './ShopifyImage';
import {IconArrowRight} from './icons/IconArrowRight';
import {Card, CardContent, CardMedia} from './ui/Card';

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

  const path = useLocalePath({path: `/collections/${collection?.handle}`});

  return (
    <Link prefetch="intent" to={path}>
      <Card className="overflow-hidden">
        {collection.image && (
          <CardMedia>
            <ShopifyImage
              aspectRatio="16/9"
              crop="center"
              data={collection.image}
              sizes={sizes}
            />
          </CardMedia>
        )}
        <CardContent className="py-4">
          <div className="flex items-center text-lg">
            <span className="relative z-[2] block bg-background pr-2">
              {collection.title}
            </span>
            <span className="-translate-x-[2px] transition-transform group-hover/card:translate-x-[-0.15px]">
              <IconArrowRight />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

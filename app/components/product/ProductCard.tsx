import type {ProductCardFragment} from 'storefrontapi.generated';

import {Link} from '@remix-run/react';
import {Money, flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import {useLocalePath} from '~/hooks/useLocalePath';
import {cn} from '~/lib/utils';

import {ShopifyImage} from '../ShopifyImage';
import {Card, CardContent, CardMedia} from '../ui/Card';

export function ProductCard(props: {
  className?: string;
  columns?: {
    desktop?: null | number;
    mobile?: null | number;
  };
  product?: ProductCardFragment;
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const {columns, product, skeleton} = props;
  const firstVariant = product?.variants?.nodes.length
    ? flattenConnection(product?.variants)[0]
    : null;
  const sizes = cx([
    '(min-width: 1024px)',
    columns?.desktop ? `${100 / columns.desktop}vw,` : '33vw,',
    columns?.mobile ? `${100 / columns.mobile}vw` : '100vw',
  ]);

  const path = useLocalePath({path: `/products/${product?.handle}`});
  const cardMediaAspectRatio = 'aspect-video';

  return (
    <>
      {!skeleton && product && firstVariant ? (
        <Link prefetch="intent" to={path}>
          <Card className="overflow-hidden">
            {firstVariant?.image && (
              <CardMedia>
                <ShopifyImage
                  aspectRatio={
                    cardMediaAspectRatio === 'aspect-video' ? '16/9' : '1/1'
                  }
                  crop="center"
                  data={firstVariant.image}
                  sizes={sizes}
                />
              </CardMedia>
            )}
            <CardContent className="p-3 md:px-6 md:py-4">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap underline-offset-4 group-hover/card:underline md:text-lg">
                {product.title}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-3 [&>*]:overflow-hidden [&>*]:text-ellipsis [&>*]:whitespace-nowrap">
                {firstVariant.compareAtPrice && (
                  <Money
                    className="text-xs text-muted-foreground line-through md:text-sm"
                    data={firstVariant.compareAtPrice}
                  />
                )}
                <Money
                  className="text-sm md:text-base"
                  data={firstVariant.price}
                />
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : skeleton ? (
        <Card className="animate-pulse overflow-hidden">
          <Skeleton aspectRatio={cardMediaAspectRatio} />
        </Card>
      ) : null}
    </>
  );
}

function Skeleton({aspectRatio}: {aspectRatio: string}) {
  return (
    <>
      <div className={cn('w-full bg-muted', aspectRatio)} />
      <div className="p-3 text-muted-foreground/0">
        <div className="text-lg">
          <span className="rounded bg-muted">Skeleton product title</span>
        </div>
        <div>
          <span className="rounded bg-muted">Skeleton price</span>
        </div>
      </div>
    </>
  );
}

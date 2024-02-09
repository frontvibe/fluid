import type {ProductCardFragment} from 'storefrontapi.generated';

import {Link} from '@remix-run/react';
import {Image, Money, flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import {useLocalePath} from '~/hooks/useLocalePath';

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

  return (
    <>
      {!skeleton && product && firstVariant ? (
        <Link prefetch="intent" to={path}>
          <Card className="overflow-hidden">
            {firstVariant?.image && (
              <CardMedia>
                <Image
                  aspectRatio="16/9"
                  crop="center"
                  data={firstVariant.image}
                  sizes={sizes}
                />
              </CardMedia>
            )}
            <CardContent className="py-4">
              <div className="text-lg underline-offset-4 group-hover/card:underline">
                {product.title}
              </div>
              <div className="mt-1 flex items-center gap-3">
                {firstVariant.compareAtPrice && (
                  <Money
                    className="text-sm line-through opacity-50"
                    data={firstVariant.compareAtPrice}
                  />
                )}
                <Money data={firstVariant.price} />
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : skeleton ? (
        <Card className="overflow-hidden">
          <Skeleton />
        </Card>
      ) : null}
    </>
  );
}

function Skeleton() {
  return (
    <>
      <div className="aspect-video w-full bg-slate-200" />
      <div className="p-3 text-black/0">
        <div className="text-lg">
          <span className="rounded bg-slate-100">Skeleton product title</span>
        </div>
        <div>
          <span className="rounded bg-slate-100">Skeleton price</span>
        </div>
      </div>
    </>
  );
}

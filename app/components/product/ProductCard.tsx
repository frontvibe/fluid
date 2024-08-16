import type {ProductCardFragment} from 'storefrontapi.generated';

import {Link} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';
import {flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {cn} from '~/lib/utils';

import {ShopifyImage} from '../ShopifyImage';
import {ShopifyMoney} from '../ShopifyMoney';
import {ProductBadges} from '../blocks/PriceBlock';
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
  const {data} = stegaClean(useSanityRoot());
  const style = data?.settings?.productCards?.style;
  const textAlignment = data?.settings?.productCards?.textAlignment || 'left';
  const aspectRatio = data?.settings?.productCards?.imageAspectRatio || 'video';
  const variants = product?.variants?.nodes.length
    ? flattenConnection(product?.variants)
    : null;
  const firstVariant = variants?.[0];
  const sizes = [
    '(min-width: 1024px)',
    columns?.desktop ? `${100 / columns.desktop}vw` : '33vw',
    columns?.mobile ? `${100 / columns.mobile}vw` : '100vw'
  ].join(', ');

  /**
 * Optional: Extended more granular image sizes
 * 
  const sizes = [
    '(min-width: 1200px) and (max-width: 1599px)',
    columns?.desktop ? `${100 / columns.desktop}vw` : '25vw',
    '(min-width: 1024px) and (max-width: 1199px)',
    columns?.desktop ? `${100 / columns.desktop}vw` : '33vw',
    '(min-width: 768px) and (max-width: 1023px)',
    columns?.mobile ? `${100 / columns.mobile}vw` : '50vw',
    '100vw'
  ].join(', ');
 */

  const path = useLocalePath({path: `/products/${product?.handle}`});

  const cardClass = cn(
    style === 'card'
      ? 'overflow-hidden rounded-[--product-card-border-corner-radius]'
      : 'rounded-t-[calc(var(--product-card-border-corner-radius)*1.2)]',
    style === 'card'
      ? 'border-[rgb(var(--border)_/_var(--product-card-border-opacity))] [border-width:--product-card-border-thickness]'
      : 'border-0',
    style === 'card'
      ? '[box-shadow:rgb(var(--shadow)_/_var(--product-card-shadow-opacity))_var(--product-card-shadow-horizontal-offset)_var(--product-card-shadow-vertical-offset)_var(--product-card-shadow-blur-radius)_0px]'
      : 'shadow-none',
    style === 'standard' && 'bg-transparent',
    textAlignment === 'center'
      ? 'text-center'
      : textAlignment === 'right'
        ? 'text-right'
        : 'text-left',
  );

  const priceClass = cn(
    'mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-3 [&>*]:overflow-hidden [&>*]:text-ellipsis [&>*]:whitespace-nowrap',
    textAlignment === 'center'
      ? 'justify-center'
      : textAlignment === 'right'
        ? 'justify-end'
        : 'justify-start',
  );

  return (
    <>
      {!skeleton && product && firstVariant ? (
        <Link prefetch="intent" to={path}>
          <Card className={cardClass}>
            {firstVariant?.image && (
              <CardMedia
                aspectRatio={aspectRatio}
                className={cn(
                  'relative',
                  style === 'standard' &&
                    'rounded-[--product-card-border-corner-radius]',
                  style === 'standard' &&
                    'border-[rgb(var(--border)_/_var(--product-card-border-opacity))] [border-width:--product-card-border-thickness]',
                  style === 'standard' &&
                    '[box-shadow:rgb(var(--shadow)_/_var(--product-card-shadow-opacity))_var(--product-card-shadow-horizontal-offset)_var(--product-card-shadow-vertical-offset)_var(--product-card-shadow-blur-radius)_0px]',
                )}
              >
                <ShopifyImage
                  aspectRatio={cn(
                    aspectRatio === 'square' && '1/1',
                    aspectRatio === 'video' && '16/9',
                    aspectRatio === 'auto' &&
                      `${firstVariant.image.width}/${firstVariant.image.height}`,
                  )}
                  crop="center"
                  data={firstVariant.image}
                  showBorder={false}
                  showShadow={false}
                  sizes={sizes}
                />
                <ProductBadges
                  layout="card"
                  variants={product?.variants.nodes}
                />
              </CardMedia>
            )}
            <CardContent className="p-3 md:px-6 md:py-4">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap underline-offset-4 group-hover/card:underline md:text-lg">
                {product.title}
              </div>
              <div className={priceClass}>
                {firstVariant.compareAtPrice && (
                  <ShopifyMoney
                    className="text-xs text-muted-foreground line-through md:text-sm"
                    data={firstVariant.compareAtPrice}
                  />
                )}
                <ShopifyMoney
                  className="text-sm md:text-base"
                  data={firstVariant.price}
                />
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : skeleton ? (
        <Card className={cn('animate-pulse', cardClass)}>
          <CardMedia aspectRatio={aspectRatio}>
            <div
              className={cn(
                'w-full bg-muted',
                aspectRatio === 'square' && 'aspect-square',
                aspectRatio === 'video' && 'aspect-video',
                aspectRatio === 'auto' && 'aspect-none',
              )}
            />
          </CardMedia>
          <CardContent className="p-3 text-muted-foreground/0 md:px-6 md:py-4">
            <div className="text-lg">
              <span className="rounded">Skeleton product title</span>
            </div>
            <div className={priceClass}>
              <span className="rounded text-sm md:text-base">
                Skeleton price
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

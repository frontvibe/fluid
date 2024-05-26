import type {CollectionsQuery} from 'storefrontapi.generated';

import {Link} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';

import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {cn} from '~/lib/utils';

import {ShopifyImage} from './ShopifyImage';
import {IconArrowRight} from './icons/IconArrowRight';
import {Card, CardContent, CardMedia} from './ui/Card';

export function CollectionCard(props: {
  className?: string;
  collection?: CollectionsQuery['collections']['nodes'][0];
  columns?: null | number;
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const {collection, skeleton} = props;
  const sanityRoot = useSanityRoot();
  const {data} = stegaClean(sanityRoot);
  const style = data?.settings?.collectionCards?.style;
  const textAlignment =
    data?.settings?.collectionCards?.textAlignment || 'left';
  const aspectRatio =
    data?.settings?.collectionCards?.imageAspectRatio || 'video';
  const sizes = cx([
    '(min-width: 1024px)',
    props.columns ? `${100 / props.columns}vw,` : '33vw,',
    '100vw',
  ]);

  const path = useLocalePath({path: `/collections/${collection?.handle}`});

  const cardClass = cn(
    style === 'card'
      ? 'overflow-hidden rounded-[--collection-card-border-corner-radius]'
      : 'rounded-t-[calc(var(--collection-card-border-corner-radius)*1.2)]',
    style === 'card'
      ? 'border-[rgb(var(--border)_/_var(--collection-card-border-opacity))] [border-width:--collection-card-border-thickness]'
      : 'border-0',
    style === 'card'
      ? '[box-shadow:rgb(var(--shadow)_/_var(--collection-card-shadow-opacity))_var(--collection-card-shadow-horizontal-offset)_var(--collection-card-shadow-vertical-offset)_var(--collection-card-shadow-blur-radius)_0px]'
      : 'shadow-none',
    style === 'standard' && 'bg-transparent',
    textAlignment === 'center'
      ? 'text-center'
      : textAlignment === 'right'
        ? 'text-right'
        : 'text-left',
  );

  const cardContentClass = cn(
    'flex flex-wrap items-center py-4',
    textAlignment === 'center'
      ? 'justify-center'
      : textAlignment === 'right'
        ? 'justify-end'
        : 'justify-start',
  );

  return !skeleton && collection ? (
    <Link prefetch="intent" to={path}>
      <Card className={cardClass}>
        {collection.image && (
          <CardMedia
            aspectRatio={aspectRatio}
            className={cn(
              style === 'standard' &&
                'rounded-[--collection-card-border-corner-radius]',
              style === 'standard' &&
                'border-[rgb(var(--border)_/_var(--collection-card-border-opacity))] [border-width:--collection-card-border-thickness]',
              style === 'standard' &&
                '[box-shadow:rgb(var(--shadow)_/_var(--collection-card-shadow-opacity))_var(--collection-card-shadow-horizontal-offset)_var(--collection-card-shadow-vertical-offset)_var(--collection-card-shadow-blur-radius)_0px]',
            )}
          >
            <ShopifyImage
              aspectRatio={cn(
                aspectRatio === 'square' && '1/1',
                aspectRatio === 'video' && '16/9',
                aspectRatio === 'auto' &&
                  `${collection.image.width}/${collection.image.height}`,
              )}
              crop="center"
              data={collection.image}
              showBorder={false}
              showShadow={false}
              sizes={sizes}
            />
          </CardMedia>
        )}
        <CardContent className={cardContentClass}>
          <div className="flex items-center text-lg">
            <span className="relative z-[2] block pr-2">
              {collection.title}
            </span>
            <span className="-translate-x-[2px] transition-transform group-hover/card:translate-x-[-0.15px]">
              <IconArrowRight />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  ) : skeleton ? (
    <Card className={cn('animate-pulse', cardClass)}>
      <CardMedia>
        <div
          className={cn(
            'h-auto w-full bg-muted',
            aspectRatio === 'square' && 'aspect-square',
            aspectRatio === 'video' && 'aspect-video',
            aspectRatio === 'auto' && 'aspect-none',
          )}
        />
      </CardMedia>
      <CardContent className={cardContentClass}>
        <div className="flex items-center text-lg">
          <span className="rounded text-muted-foreground/0">
            Skeleton collection title
          </span>
        </div>
      </CardContent>
    </Card>
  ) : null;
}

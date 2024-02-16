import {useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';

import type {loader} from '~/routes/($locale).products.$productHandle';

import {type AspectRatioData, cn} from '~/lib/utils';

import {ShopifyImage} from '../ShopifyImage';

export function MediaGallery(props: {aspectRatio?: AspectRatioData}) {
  const {product} = useLoaderData<typeof loader>();
  const medias = product?.media?.nodes.length
    ? flattenConnection(product.media)
    : [];

  return (
    <ul className="grid">
      {medias.map((media) => {
        return (
          <li key={media.id}>
            {media.__typename === 'MediaImage' && media.image && (
              <ShopifyImage
                aspectRatio={props.aspectRatio?.value}
                className={cn('h-auto w-full', props.aspectRatio?.className)}
                data={media.image}
                decoding="sync"
                fetchpriority="high"
                loading="eager"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

import type {SectionDefaultProps, SectionOfType} from 'types';

import {useLoaderData} from '@remix-run/react';

import type {loader} from '~/routes/($locale).collections.$collectionHandle';

import {
  Banner,
  BannerContent,
  BannerMedia,
  BannerMediaOverlay,
} from '../banner';
import {ShopifyImage} from '../shopify-image';

export function CollectionBannerSection(
  props: SectionDefaultProps & {data: SectionOfType<'collectionBannerSection'>},
) {
  const loaderData = useLoaderData<typeof loader>();
  const collection = loaderData.collection;

  if (!collection) return null;

  return (
    <Banner height={props.data.bannerHeight}>
      <BannerMedia>
        {props.data.showImage && collection.image && (
          <ShopifyImage
            aspectRatio="16/9"
            crop="center"
            data={collection.image}
            decoding="sync"
            fetchpriority="high"
            loading="eager"
            showBorder={false}
            showShadow={false}
            sizes="100vw"
          />
        )}
      </BannerMedia>
      <BannerMediaOverlay opacity={props.data.overlayOpacity} />
      <BannerContent
        contentAlignment={props.data.contentAlignment}
        contentPosition={props.data.contentPosition}
      >
        <div className="flex flex-col gap-2 text-center">
          <h1>{collection.title}</h1>
          {props.data.showDescription && collection.description && (
            <p>{collection.description}</p>
          )}
        </div>
      </BannerContent>
    </Banner>
  );
}

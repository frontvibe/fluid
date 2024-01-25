import type {TypeFromSelection} from 'groqd';

import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import type {SectionDefaultProps} from '~/lib/type';
import type {COLLECTION_BANNER_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).collections.$collectionHandle';

type CollectionBannerSectionProps = TypeFromSelection<
  typeof COLLECTION_BANNER_SECTION_FRAGMENT
>;

export function CollectionBannerSection(
  props: SectionDefaultProps & {data: CollectionBannerSectionProps},
) {
  const loaderData = useLoaderData<typeof loader>();
  const collection = loaderData.collection;

  return collection ? (
    <section>
      {/* Todo => add settings for banner height */}
      {/* Todo => add setting to add overlay */}
      {/* Todo => add settings for text and content alignment */}
      <div className="relative h-80 w-full overflow-hidden">
        {props.data.showImage && collection.image && (
          <Image
            aspectRatio="16/9"
            className="h-auto"
            crop="center"
            data={collection.image}
            loading="eager"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0">
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col gap-1 text-center">
              <h1>{collection.title}</h1>
              {props.data.showDescription && <p>{collection.description}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : null;
}

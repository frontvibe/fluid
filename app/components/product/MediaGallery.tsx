import type {
  Media_ExternalVideo_Fragment,
  Media_MediaImage_Fragment,
  Media_Model3d_Fragment,
  Media_Video_Fragment,
} from 'storefrontapi.generated';

import {useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import React, {useState} from 'react';

import type {loader} from '~/routes/($locale).products.$productHandle';

import {type AspectRatioData, cn} from '~/lib/utils';

import {ShopifyImage} from '../ShopifyImage';
import {Badge} from '../ui/Badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '../ui/Carousel';

type Media =
  | Media_ExternalVideo_Fragment
  | Media_MediaImage_Fragment
  | Media_Model3d_Fragment
  | Media_Video_Fragment;

export function MediaGallery(props: {aspectRatio?: AspectRatioData}) {
  const {product} = useLoaderData<typeof loader>();
  const medias = product?.media?.nodes.length
    ? flattenConnection(product.media)
    : [];
  const [activeMediaId, setActiveMediaId] = useState<null | string>(null);
  const selectedImage =
    medias.find((media) => media?.id === activeMediaId) || medias[0];

  if (!selectedImage) return null;

  return (
    <div>
      <div className="hidden lg:block">
        <MainMedia aspectRatio={props.aspectRatio} media={selectedImage} />
      </div>
      <MobileCarousel aspectRatio={props.aspectRatio} medias={medias} />
      <ThumbnailCarousel
        medias={medias}
        selectedImage={selectedImage}
        setActiveMediaId={setActiveMediaId}
      />
    </div>
  );
}

function MainMedia({
  aspectRatio,
  media,
}: {
  aspectRatio?: AspectRatioData;
  media: Media;
}) {
  return (
    media.__typename === 'MediaImage' &&
    media.image && (
      <ShopifyImage
        aspectRatio={aspectRatio?.value}
        className={cn('h-auto w-full', aspectRatio?.className)}
        data={media.image}
        decoding="sync"
        fetchpriority="high"
        loading="eager"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    )
  );
}

function MobileCarousel({
  aspectRatio,
  medias,
}: {
  aspectRatio?: AspectRatioData;
  medias: Media[];
}) {
  const isActive = medias.length > 1;

  if (!isActive) {
    return (
      <div className="container lg:hidden">
        <MainMedia aspectRatio={aspectRatio} media={medias[0]} />
      </div>
    );
  }

  return (
    <Carousel
      className="lg:hidden"
      opts={{
        active: isActive,
      }}
      style={{'--slidesPerView': 1} as React.CSSProperties}
    >
      <div className="relative">
        <CarouselContent className="px-8 md:px-12">
          {medias.map((media, index) => {
            return (
              <CarouselItem className="pl-3 last:pr-3" key={media.id}>
                {media.__typename === 'MediaImage' && media.image && (
                  <ShopifyImage
                    aspectRatio={aspectRatio?.value}
                    className={cn('h-auto w-full', aspectRatio?.className)}
                    data={media.image}
                    decoding={index === 0 ? 'sync' : 'async'}
                    fetchpriority={index === 0 ? 'high' : 'low'}
                    loading="eager"
                    sizes="100vw"
                  />
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <MobileCarouselCounter mediaLength={medias.length} />
      </div>
    </Carousel>
  );
}

function MobileCarouselCounter({mediaLength}: {mediaLength: number}) {
  const {selectedIndex} = useCarousel();
  return (
    <div className="mt-3 flex items-center justify-center">
      <Badge
        className="flex items-center gap-1 tabular-nums text-muted-foreground"
        variant="outline"
      >
        <span>{selectedIndex + 1}</span>
        <span>/</span>
        <span>{mediaLength}</span>
      </Badge>
    </div>
  );
}

function ThumbnailCarousel({
  medias,
  selectedImage,
  setActiveMediaId,
}: {
  medias: Media[];
  selectedImage: Media;
  setActiveMediaId: React.Dispatch<React.SetStateAction<null | string>>;
}) {
  if (medias.length <= 1) return null;

  return (
    <div className="mt-6 hidden lg:block">
      <Carousel
        opts={{
          container: '.thumbnails-container',
        }}
        style={{'--slidesPerView': 5} as React.CSSProperties}
      >
        <div className="flex items-center justify-center gap-2">
          <CarouselPrevious className="relative left-0 top-0 aspect-square size-11 translate-x-0 translate-y-0" />
          <div className="thumbnails-container relative">
            <CarouselContent className="px-3 py-1">
              {medias.map((media) => {
                return (
                  <CarouselItem
                    className="p-0 md:basis-1/2 md:pl-2 md:last:pr-2 lg:basis-[var(--slidesPerView)]"
                    key={media.id}
                  >
                    {media.__typename === 'MediaImage' && media.image && (
                      <button
                        className={cn(
                          'overflow-hidden rounded-[--media-border-corner-radius] border-2 border-foreground border-opacity-0 transition-opacity hover:border-opacity-100',
                          'ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          media.id === selectedImage.id && 'border-opacity-100',
                        )}
                        onClick={() => setActiveMediaId(media.id)}
                      >
                        <ShopifyImage
                          aspectRatio="1/1"
                          className="aspect-square w-24 object-cover"
                          data={media.image}
                          loading="eager"
                          showBorder={false}
                          showShadow={false}
                          sizes="96px"
                        />
                      </button>
                    )}
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </div>
          <CarouselNext className="relative right-0 top-0 aspect-square size-11 translate-x-0 translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}

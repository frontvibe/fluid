import imageUrlBuilder from '@sanity/image-url';
import React from 'react';

import type {SanityImageFragment} from '~/lib/type';

import {useEnvironmentVariables} from '~/hooks/useEnvironmentVariables';
import {cn} from '~/lib/utils';

export function SanityImage({
  aspectRatio,
  className,
  data,
  decoding = 'async',
  fetchpriority,
  loading,
  sanityEncodeData,
  sizes,
  style,
}: {
  aspectRatio?: string;
  className?: string;
  data?: SanityImageFragment | null;
  decoding?: 'async' | 'auto' | 'sync';
  fetchpriority?: 'auto' | 'high' | 'low';
  loading?: 'eager' | 'lazy';
  sanityEncodeData?: string;
  sizes?: null | string;
  style?: React.CSSProperties;
}) {
  const env = useEnvironmentVariables();

  if (!data) {
    return null;
  }

  const aspectRatioValues = aspectRatio?.split('/');

  if (aspectRatio && aspectRatioValues?.length !== 2) {
    console.warn(
      `Invalid aspect ratio: ${aspectRatio}. Using the original aspect ratio. The aspect ratio should be in the format "width/height".`,
    );
  }

  const aspectRatioWidth = aspectRatioValues
    ? parseFloat(aspectRatioValues[0])
    : undefined;
  const aspectRatioHeight = aspectRatioValues
    ? parseFloat(aspectRatioValues[1])
    : undefined;

  const urlBuilder = imageUrlBuilder({
    dataset: env?.SANITY_STUDIO_DATASET!,
    projectId: env?.SANITY_STUDIO_PROJECT_ID!,
  })
    .image({
      _ref: data._ref,
      crop: data.crop,
      hotspot: data.hotspot,
    })
    .auto('format');

  const urlPreview = urlBuilder.width(30).url();
  const urlDefault = urlBuilder.url();
  // Values used for srcset attribute of image tag (in pixels)
  const srcSetValues = [
    50, 100, 200, 450, 600, 750, 900, 1000, 1250, 1500, 1750, 2000, 2500,
  ];
  const focalCoords = {
    x: data.hotspot ? Math.ceil(data.hotspot.x * 100) : 0,
    y: data.hotspot ? Math.ceil(data.hotspot.y * 100) : 0,
  };

  // Create srcset attribute
  const srcSet = srcSetValues
    .filter((value) => value < data.width)
    .map((value) => {
      let imageUrl = urlBuilder.width(value);
      const height =
        aspectRatioHeight && aspectRatioWidth
          ? Math.round((value / aspectRatioWidth) * aspectRatioHeight)
          : undefined;

      if (height) {
        imageUrl = imageUrl.height(height);
      }
      if (data.width >= value) {
        return `${imageUrl} ${value}w`;
      }
      return '';
    })
    .join(', ')
    .concat(`, ${urlDefault} ${data.width}w`);

  // Todo => Global image border-radius setting should apply to the wrapper <span/>
  // No padding should be applied to the wrapper <span/> or the <img/> tag to avoid blurry LQIP becoming visible
  return (
    <span
      className="relative block overflow-hidden !p-0"
      id={data._ref ? `img-${data._ref}` : undefined}
      style={
        {
          '--focalX': focalCoords.x + '%',
          '--focalY': focalCoords.y + '%',
        } as React.CSSProperties
      }
    >
      <img
        alt={data.altText || ''}
        className={cn(
          'relative z-[1] object-[var(--focalX)_var(--focalY)]',
          className,
          '!p-0',
        )}
        // Adding this attribute makes sure the image is always clickable in the Presentation tool
        data-sanity={sanityEncodeData}
        decoding={decoding}
        fetchpriority={fetchpriority}
        height={aspectRatioHeight || data.height}
        loading={loading}
        sizes={sizes!}
        src={urlDefault}
        srcSet={srcSet}
        style={
          {
            ...style,
            aspectRatio: `${aspectRatioWidth || data.width}/${aspectRatioHeight || data.height}`,
          } as React.CSSProperties
        }
        width={aspectRatioWidth || data.width}
      />
      {data._ref && (
        <style
          // Blurry bg image used as LQIP (Low Quality Image Placeholder)
          // while high quality image is loading.
          dangerouslySetInnerHTML={{
            __html: `
              #img-${data._ref}::before {
                content: "";
                position: absolute;
                background: url(${urlPreview});
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                filter: blur(10px);
              }
            `.trim(),
          }}
        />
      )}
    </span>
  );
}

import imageUrlBuilder from '@sanity/image-url';

import type {SanityImageFragment} from '~/lib/type';

import {useEnvironmentVariables} from '~/hooks/useEnvironmentVariables';
import {cn} from '~/lib/utils';

export function SanityImage(props: {
  aspectRatio?: string;
  className?: string;
  data?: SanityImageFragment | null;
  loading?: 'eager' | 'lazy';
  sanityEncodeData?: string;
  sizes?: null | string;
  style?: React.CSSProperties;
}) {
  const env = useEnvironmentVariables();
  const {
    aspectRatio,
    className,
    data,
    loading,
    sanityEncodeData,
    sizes,
    style,
  } = props;

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

  return (
    <span className="relative block overflow-hidden">
      <img
        alt={data.altText || ''}
        className={cn([
          'relative z-[1] object-[var(--focalX)_var(--focalY)]',
          className,
        ])}
        // Adding this attribute makes sure the image is always clickable in the Presentation tool
        data-sanity={sanityEncodeData}
        height={aspectRatioHeight || data.height}
        loading={loading}
        sizes={sizes || undefined}
        src={urlDefault}
        srcSet={srcSet}
        style={
          {
            '--focalX': focalCoords.x + '%',
            '--focalY': focalCoords.y + '%',
            aspectRatio: `${aspectRatioWidth || data.width}/${aspectRatioHeight || data.height}`,
            ...style,
          } as React.CSSProperties
        }
        width={aspectRatioWidth || data.width}
      />
      {/* Preview blurry image (30px) that will load before the highres image */}
      <img
        alt={data.altText || ''}
        className={cn([
          'absolute inset-0 object-[var(--focalX)_var(--focalY)] blur-2xl transition-opacity',
          className,
        ])}
        height={aspectRatioHeight || data.height}
        loading="eager"
        sizes={sizes || undefined}
        src={urlPreview}
        srcSet={urlPreview}
        style={
          {
            '--focalX': focalCoords.x + '%',
            '--focalY': focalCoords.y + '%',
            aspectRatio: `${aspectRatioWidth || data.width}/${aspectRatioHeight || data.height}`,
          } as React.CSSProperties
        }
        width={aspectRatioWidth || data.width}
      />
    </span>
  );
}

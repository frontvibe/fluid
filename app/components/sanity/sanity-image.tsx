import type {SanityImage as SanityImageData} from 'types';

import {getExtension, getImageDimensions} from '@sanity/asset-utils';
import imageUrlBuilder from '@sanity/image-url';
import React, {forwardRef} from 'react';

import {useIsDev} from '~/hooks/use-is-dev';
import {cn, generateImageUrl} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

export type SanityImageProps = React.ComponentPropsWithRef<'img'> & {
  /** The aspect ratio of the image, in the format of `width/height`.
   *
   * @example
   * ```
   * <SanityImage data={image} aspectRatio="4/5" />
   * ```
   */
  aspectRatio?: string;
  className?: string;
  data: SanityImageData;
  dataSanity?: string;
  /**
   * Set to `true` to enable LQIP (Low Quality Image Placeholder).
   * The LQIP image is used as a placeholder for images that are too large to load and
   * is cropped to the aspect ratio of the original image.
   * It renders as a blurred background while the original image is loading.
   */
  lqip?: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
};

/**
 * Sanity’s Image component is a wrapper around the HTML image element.
 * It supports the same props as the HTML `img` element, but automatically
 * generates the srcSet and sizes attributes for you. For most use cases,
 * you’ll want to set the `aspectRatio` prop to ensure the image is sized
 * correctly.
 *
 * @remarks
 * - `decoding` is set to `async` by default.
 * - `loading` is set to `lazy` by default.
 * - `alt` will automatically be set to the `altText` if passed in the `data` prop.
 * - `src` will automatically be set to the `url` if passed in the `data` prop.
 * - `lqip` is set to `true` by default.
 *
 * @example
 * A responsive image with a 4:5 aspect ratio:
 * ```
 * <SanityImage
 *   data={data.image}
 *   aspectRatio="4/5"
 *   sizes="(min-width: 45em) 40vw, 100vw"
 * />
 * ```
 */
const SanityImage = forwardRef<HTMLImageElement, SanityImageProps>(
  (
    {
      aspectRatio,
      className,
      data,
      decoding = 'async',
      loading = 'lazy',
      lqip = true,
      showBorder = true,
      showShadow = true,
      sizes,
      style,
      ...passthroughProps
    },
    ref,
  ) => {
    const {env} = useRootLoaderData();
    const isDev = useIsDev();

    if (!data || !data.asset || !env) {
      return null;
    }

    const config = {
      dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
      projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
    };
    const _ref = data.asset._ref;
    const {height, width} = getImageDimensions(_ref);
    const extension = getExtension(_ref);
    const aspectRatioValues = aspectRatio?.split('/');

    if (aspectRatio && aspectRatioValues?.length !== 2 && isDev) {
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
      dataset: config.dataset,
      projectId: config.projectId,
    })
      .image({
        _ref,
        crop: data.crop,
        hotspot: data.hotspot,
      })
      .auto('format');

    // Values used for srcset attribute of image tag (in pixels)
    const srcSetValues = [
      50, 100, 200, 450, 600, 750, 900, 1000, 1250, 1500, 1750, 2000, 2500,
      3000, 3500, 4000, 5000,
    ];

    const urlDefault = generateImageUrl({
      aspectRatioHeight,
      aspectRatioWidth,
      urlBuilder,
      width,
    });

    if (isDev && !sizes) {
      console.warn(
        [
          'No sizes prop provided to SanityImage component,',
          'you may be loading unnecessarily large images.',
          `Image used is ${urlDefault || _ref || 'unknown'}`,
        ].join(' '),
      );
    }

    // Create srcset attribute
    const srcSet = srcSetValues
      .filter((value) => value < width)
      .map((value) => {
        const imageUrl = generateImageUrl({
          aspectRatioHeight,
          aspectRatioWidth,
          urlBuilder,
          width: value,
        });
        if (width >= value) {
          return `${imageUrl} ${value}w`;
        }
        return '';
      })
      .join(', ')
      .concat(`, ${urlDefault} ${width}w`);

    // Blurry bg image used as LQIP (Low Quality Image Placeholder)
    // while high quality image is loading.
    const blurDataUrl = generateImageUrl({
      aspectRatioHeight,
      aspectRatioWidth,
      blur: 10,
      urlBuilder,
      width: 30,
    });

    // Don't use LQIP if the image is a PNG or SVG
    if (extension === 'svg' || extension === 'png') {
      lqip = false;
    }

    const LQIP =
      lqip &&
      ({
        backgroundImage: `url(${blurDataUrl})`,
        backgroundPositionX: `var(--focalX)`,
        backgroundPositionY: `var(--focalY)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      } as React.CSSProperties);

    const focalCoords = data.hotspot?.x &&
      data.hotspot?.y && {
        x: Math.ceil(data.hotspot.x * 100),
        y: Math.ceil(data.hotspot.y * 100),
      };

    const focalProperties =
      focalCoords &&
      ({
        '--focalX': focalCoords?.x + '%',
        '--focalY': focalCoords?.y + '%',
        objectPosition: `var(--focalX) var(--focalY)`,
      } as React.CSSProperties);

    return (
      <img
        alt={data.altText || ''}
        className={cn(
          'w-full',
          showBorder &&
            'rounded-(--media-border-corner-radius) [border-width:var(--media-border-thickness)] border-[rgb(var(--border)_/_var(--media-border-opacity))]',
          showShadow &&
            '[box-shadow:rgb(var(--shadow)_/_var(--media-shadow-opacity))_var(--media-shadow-horizontal-offset)_var(--media-shadow-vertical-offset)_var(--media-shadow-blur-radius)_0px]',
          className,
        )}
        decoding={decoding}
        height={aspectRatioHeight ? aspectRatioHeight * 100 : height}
        loading={loading}
        ref={ref}
        sizes={sizes}
        src={urlDefault}
        srcSet={srcSet}
        style={
          {
            ...style,
            ...focalProperties,
            ...LQIP,
            aspectRatio: `${aspectRatioWidth || width}/${
              aspectRatioHeight || height
            }`,
          } as React.CSSProperties
        }
        width={aspectRatioWidth ? aspectRatioWidth * 100 : width}
        {...passthroughProps}
      />
    );
  },
);

SanityImage.displayName = 'SanityImage';

export {SanityImage};

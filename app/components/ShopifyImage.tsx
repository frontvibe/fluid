import {
  Image,
  parseAspectRatio,
  shopifyLoader,
} from '@shopify/hydrogen-react/Image';
import React from 'react';

import {cn} from '~/lib/utils';

/**
 * Shopify’s Image component is a wrapper around the HTML image element.
 * It supports the same props as the HTML `img` element, but automatically
 * generates the srcSet and sizes attributes for you. For most use cases,
 * you’ll want to set the `aspectRatio` prop to ensure the image is sized
 * correctly.
 *
 * @remarks
 * - `decoding` is set to `async` by default.
 * - `loading` is set to `lazy` by default.
 * - `alt` will automatically be set to the `altText` from the Storefront API if passed in the `data` prop
 * - `src` will automatically be set to the `url` from the Storefront API if passed in the `data` prop
 * - `lqip` is set to `true` by default.
 *
 * @example
 * A responsive image with a 4:5 aspect ratio:
 * ```
 * <ShopifyImage
 *   data={product.featuredImage}
 *   aspectRatio="4/5"
 *   sizes="(min-width: 45em) 40vw, 100vw"
 * />
 * ```
 * @example
 * A fixed size image:
 * ```
 * <ShopifyImage
 *   data={product.featuredImage}
 *   width={100}
 *   height={100}
 * />
 * ```
 *
 * @link https://shopify.dev/docs/api/hydrogen-react/components/image
 */
const ShopifyImage = React.forwardRef<
  HTMLImageElement,
  {
    /**
     * Set to `true` to enable LQIP (Low Quality Image Placeholder).
     * The LQIP image is used as a placeholder for images that are too large to load and
     * is cropped to the aspect ratio of the original image.
     * It renders as a blurred background while the original image is loading.
     */
    lqip?: boolean;
    showBorder?: boolean;
    showShadow?: boolean;
  } & React.ComponentProps<typeof Image>
>(
  (
    {
      aspectRatio,
      className,
      crop,
      data,
      lqip = true,
      showBorder = true,
      showShadow = true,
      style,
      ...passthroughProps
    },
    ref,
  ) => {
    const lqipWidth = 30;

    const lqipUrl = shopifyLoader({
      crop: crop || 'center',
      height: aspectRatio
        ? lqipWidth * (parseAspectRatio(aspectRatio) ?? 1)
        : undefined,
      src: data?.url,
      width: lqipWidth,
    });

    const {pathname: lqipPathname} = new URL(lqipUrl);

    // Don't use LQIP if the image is a PNG or SVG
    if (lqipPathname.includes('.png') || lqipPathname.includes('.svg')) {
      lqip = false;
    }

    const LQIP =
      lqip &&
      ({
        backgroundImage: `url(${lqipUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      } as React.CSSProperties);

    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        aspectRatio={aspectRatio}
        className={cn(
          showBorder &&
            'rounded-[--media-border-corner-radius] border-[rgb(var(--border)_/_var(--media-border-opacity))] [border-width:--media-border-thickness]',
          showShadow &&
            '[box-shadow:rgb(var(--shadow)_/_var(--media-shadow-opacity))_var(--media-shadow-horizontal-offset)_var(--media-shadow-vertical-offset)_var(--media-shadow-blur-radius)_0px]',
          className,
        )}
        crop={crop}
        data={data}
        ref={ref}
        style={{
          ...LQIP,
          ...style,
        }}
        {...passthroughProps}
      />
    );
  },
);

ShopifyImage.displayName = 'ShopifyImage';

export {ShopifyImage};

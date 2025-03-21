import type {CropMode} from '@sanity/image-url/lib/types/types';
import type {FulfillmentStatus} from '@shopify/hydrogen/customer-account-api-types';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import type {ClassValue} from 'class-variance-authority/types';
import type {ImageUrlBuilder} from 'sanity';
import type {I18nLocale} from 'types';
import type {
  AspectRatios,
  ROOT_QUERYResult,
} from 'types/sanity/sanity.generated';

import {useLocation} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';
import imageUrlBuilder from '@sanity/image-url';
import {cx} from 'class-variance-authority';
import {useMemo} from 'react';
import {twMerge} from 'tailwind-merge';

export function useVariantUrl(
  handle: string,
  selectedOptions: SelectedOption[],
) {
  const {pathname} = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
}

export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions: SelectedOption[];
}) {
  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const isLocalePathname = match && match.length > 0;

  const path = isLocalePathname
    ? `${match![0]}products/${handle}`
    : `/products/${handle}`;

  selectedOptions.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
}

/**
 * A not found response. Sets the status code.
 */
export const notFound = (message = 'Not Found') =>
  new Response(message, {
    status: 404,
    statusText: 'Not Found',
  });

/**
 * Validates that a url is local
 * @param url
 * @returns `true` if local `false`if external domain
 */
export function isLocalPath(url: string) {
  try {
    // We don't want to redirect cross domain,
    // doing so could create fishing vulnerability
    // If `new URL()` succeeds, it's a fully qualified
    // url which is cross domain. If it fails, it's just
    // a path, which will be the current domain.
    new URL(url);
  } catch (e) {
    return true;
  }

  return false;
}

export function parseAsCurrency(value: number, locale: I18nLocale) {
  return new Intl.NumberFormat(locale.language + '-' + locale.country, {
    currency: locale.currency,
    style: 'currency',
  }).format(value);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs));
}

export type AspectRatioData = ReturnType<typeof getAspectRatioData>;
export const getAspectRatioData = (
  aspectRatio: AspectRatios[number] | null,
) => {
  const cleanAspectRatio = stegaClean(aspectRatio);
  return cleanAspectRatio === 'video'
    ? ({
        className: 'aspect-video',
        value: '16/9',
      } as const)
    : cleanAspectRatio === 'square'
      ? ({
          className: 'aspect-square',
          value: '1/1',
        } as const)
      : ({
          className: 'aspect-auto',
          value: undefined,
        } as const);
};

export function generateShopifyImageThumbnail(url?: null | string) {
  if (!url) return null;

  const imageUrl = new URL(url);

  if (imageUrl.hostname !== 'cdn.shopify.com') return null;

  const size = '_30x.jpg';
  const thumbnailUrl =
    imageUrl.origin + imageUrl.pathname.replace('.jpg', size);

  return thumbnailUrl;
}

export function setShowTrailingZeroKeyValue(locale: I18nLocale) {
  return locale.country + '_' + locale.language + +'_' + locale.pathPrefix;
}

export function statusMessage(
  status: FulfillmentStatus,
  themeContent?: null | ROOT_QUERYResult['themeContent'],
) {
  const translations: Record<FulfillmentStatus, string> = {
    CANCELLED: themeContent?.account?.orderStatusCancelled || 'Cancelled',
    ERROR: themeContent?.account?.orderStatusError || 'Error',
    FAILURE: themeContent?.account?.orderStatusFailure || 'Failed',
    OPEN: themeContent?.account?.orderStatusOpen || 'Open',
    PENDING: themeContent?.account?.orderStatusPending || 'Pending',
    SUCCESS: themeContent?.account?.orderStatusSuccess || 'Success',
  };
  try {
    return translations?.[status];
  } catch (error) {
    return status;
  }
}

export function generateImageUrl(args: {
  aspectRatioHeight?: number;
  aspectRatioWidth?: number;
  blur?: number;
  urlBuilder: ImageUrlBuilder;
  width: number;
}) {
  const {
    aspectRatioHeight,
    aspectRatioWidth,
    blur = 0,
    urlBuilder,
    width,
  } = args;
  let imageUrl = urlBuilder.width(width);
  const imageHeight =
    aspectRatioHeight && aspectRatioWidth
      ? Math.round((width / aspectRatioWidth) * aspectRatioHeight)
      : undefined;

  if (imageHeight) {
    imageUrl = imageUrl.height(imageHeight);
  }

  if (blur && blur > 0) {
    imageUrl = imageUrl.blur(blur);
  }

  return imageUrl.url();
}

export function generateSanityImageUrl({
  crop,
  dataset,
  height,
  projectId,
  ref,
  width,
}: {
  crop?: CropMode;
  dataset: string;
  height?: number;
  projectId: string;
  ref?: null | string;
  width: number;
}) {
  if (!ref) return null;
  const urlBuilder = imageUrlBuilder({
    dataset,
    projectId,
  })
    .image({
      _ref: ref,
    })
    .auto('format')
    .width(width);

  let imageUrl = urlBuilder.url();

  if (height) {
    imageUrl = urlBuilder.height(height).url();
  }

  if (crop) {
    imageUrl = urlBuilder.crop(crop).url();
  }

  return imageUrl;
}

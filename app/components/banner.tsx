import type {
  ContentAlignment,
  ContentPosition,
} from 'types/sanity/sanity.generated';

import {stegaClean} from '@sanity/client/stega';
import {forwardRef} from 'react';

import {cn} from '~/lib/utils';

import {
  contentAlignmentVariants,
  contentPositionVariants,
} from './cva/content-alignment';

const Banner = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    height: null | number;
  }
>(({className, height, ...props}, ref) => {
  const bannerHeight = `${height ?? 200}px`;
  return (
    <div
      className={cn('relative h-[var(--banner-height)]', className)}
      ref={ref}
      style={
        {
          '--banner-height': bannerHeight,
        } as React.CSSProperties
      }
      {...props}
    />
  );
});
Banner.displayName = 'Banner';

const BannerMedia = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    className={cn('absolute inset-0 overflow-hidden', className)}
    ref={ref}
    {...props}
  >
    <div className="[&_img]:h-(--banner-height) [&_img]:w-screen [&_img]:object-cover">
      {props.children}
    </div>
  </div>
));
BannerMedia.displayName = 'BannerMedia';

const BannerMediaOverlay = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    opacity?: null | number;
  }
>(({className, opacity, ...props}, ref) => {
  const style = {
    opacity: opacity ? opacity / 100 : 0,
  } as React.CSSProperties;

  if (opacity === 0) return null;

  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 z-2 bg-black', className)}
      ref={ref}
      style={style}
      {...props}
    />
  );
});
BannerMediaOverlay.displayName = 'BannerMediaOverlay';

const BannerContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    contentAlignment: ContentAlignment | null;
    contentPosition: ContentPosition | null;
  }
>(({className, contentAlignment, contentPosition, ...props}, ref) => {
  // Remove all stega encoded data
  const cleanContentPosition = stegaClean(contentPosition);
  const cleanContentAlignement = stegaClean(contentAlignment);

  return (
    <div
      className={cn(
        'relative z-3 container flex h-full py-4',
        contentAlignmentVariants({
          required: cleanContentAlignement,
        }),
        contentPositionVariants({
          required: cleanContentPosition,
        }),
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className={cn('max-w-[40rem]')}>{props.children}</div>
    </div>
  );
});
BannerContent.displayName = 'BannerContent';

export {Banner, BannerContent, BannerMedia, BannerMediaOverlay};

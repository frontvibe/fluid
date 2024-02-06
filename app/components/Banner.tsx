import {vercelStegaCleanAll} from '@sanity/client/stega';
import {forwardRef} from 'react';

import type {contentAlignmentValues} from '~/qroq/sections';

import {cn} from '~/lib/utils';

import {contentAlignmentVariants} from './cva/contentAlignment';

const Banner = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    height: null | number;
  }
>(({className, height, ...props}, ref) => {
  const bannerHeight = `${height}px` || '200px';
  return (
    <div
      className={cn('h-[var(--banner-height)]', className)}
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
    className={cn(
      'absolute inset-0 overflow-hidden [&_img]:size-full [&_img]:object-cover',
      className,
    )}
    ref={ref}
    {...props}
  >
    {props.children}
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
    '--tw-bg-opacity': opacity ? opacity / 100 : 0,
  } as React.CSSProperties;

  if (opacity === 0) return null;

  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 bg-black', className)}
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
    contentAlignment: (typeof contentAlignmentValues)[number] | null;
  }
>(({className, contentAlignment, ...props}, ref) => {
  // Remove all stega encoded data
  const cleanContentAlignment = vercelStegaCleanAll(contentAlignment);
  return (
    <div
      className={cn('container relative h-full', className)}
      ref={ref}
      {...props}
    >
      <div
        className={contentAlignmentVariants({
          required: cleanContentAlignment,
        })}
      >
        {props.children}
      </div>
    </div>
  );
});
BannerContent.displayName = 'BannerContent';

export {Banner, BannerContent, BannerMedia, BannerMediaOverlay};

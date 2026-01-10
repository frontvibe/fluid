import type {
  ContentAlignment,
  ContentPosition,
} from 'types/sanity/sanity.generated';

import {stegaClean} from '@sanity/client/stega';

import {cn} from '~/lib/utils';

import {
  contentAlignmentVariants,
  contentPositionVariants,
} from './cva/content-alignment';

function Banner({
  className,
  height,
  ...props
}: React.ComponentProps<'div'> & {
  height: null | number;
}) {
  const bannerHeight = `${height ?? 200}px`;
  return (
    <div
      className={cn('relative h-[var(--banner-height)]', className)}
      style={
        {
          '--banner-height': bannerHeight,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

function BannerMedia({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      {...props}
    >
      <div className="[&_img]:h-(--banner-height) [&_img]:w-screen [&_img]:object-cover">
        {props.children}
      </div>
    </div>
  );
}

function BannerMediaOverlay({
  className,
  opacity,
  ...props
}: React.ComponentProps<'div'> & {
  opacity?: null | number;
}) {
  const style = {
    '--opacity': Number(opacity) ? `${opacity}%` : '0%',
  } as React.CSSProperties;

  if (opacity === 0) return null;

  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 z-2 bg-black/(--opacity)', className)}
      style={style}
      {...props}
    />
  );
}

function BannerContent({
  className,
  contentAlignment,
  contentPosition,
  ...props
}: React.ComponentProps<'div'> & {
  contentAlignment: ContentAlignment | null;
  contentPosition: ContentPosition | null;
}) {
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
      {...props}
    >
      <div className={cn('max-w-[40rem]')}>{props.children}</div>
    </div>
  );
}

export {Banner, BannerContent, BannerMedia, BannerMediaOverlay};

import type {TypeFromSelection} from 'groqd';
import type {CSSProperties} from 'react';

import {vercelStegaCleanAll} from '@sanity/client/stega';

import type {SectionDefaultProps} from '~/lib/type';
import type {IMAGE_BANNER_SECTION_FRAGMENT} from '~/qroq/sections';

import {Animation} from '../Animation';
import {Overlay} from '../Overlay';
import {contentAlignmentVariants} from '../cva/contentAlignment';
import {SanityImage} from '../sanity/SanityImage';

type ImageBannerSectionProps = TypeFromSelection<
  typeof IMAGE_BANNER_SECTION_FRAGMENT
>;

export function ImageBannerSection(
  props: SectionDefaultProps & {data: ImageBannerSectionProps},
) {
  const {data} = props;
  const {contentAlignment, overlayOpacity, title} = data;
  const bannerHeight = `${data.bannerHeight}px` || '200px';
  // Remove all stega encoded data
  const cleanContentAlignment = vercelStegaCleanAll(contentAlignment);

  // Todo: section size shouldn't be based on the padding, but on a height prop (number value || adapt to image height)
  // Todo: add encodeDataAttribute to SanityImage
  return title ? (
    <div
      className="h-[var(--banner-height)]"
      style={
        {
          '--banner-height': bannerHeight,
        } as CSSProperties
      }
    >
      {data.backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <SanityImage
            className="h-full w-full object-cover"
            data={data.backgroundImage}
            sizes="100vw"
          />
        </div>
      )}
      <Overlay opacity={overlayOpacity} />
      <Animation
        animate={{
          x: 0,
        }}
        className="container relative h-full"
        enabled={props.data.animateContent}
        initial={{x: -1000}}
        transition={{
          duration: 0.5,
          type: 'spring',
        }}
      >
        <div
          className={contentAlignmentVariants({
            required: cleanContentAlignment,
          })}
        >
          <h1>{title}</h1>
        </div>
      </Animation>
    </div>
  ) : null;
}

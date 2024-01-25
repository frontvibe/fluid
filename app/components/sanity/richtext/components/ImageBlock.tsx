import type {TypeFromSelection} from 'groqd';

import {vercelStegaCleanAll} from '@sanity/client/stega';
import {cva} from 'class-variance-authority';

import type {IMAGE_BLOCK_FRAGMENT} from '~/qroq/blocks';

import {SanityImage} from '../../SanityImage';

export type ImageBlockProps = TypeFromSelection<typeof IMAGE_BLOCK_FRAGMENT>;

export function ImageBlock(
  props: ImageBlockProps & {
    containerMaxWidth?: null | number;
  },
) {
  const maxWidth =
    props.containerMaxWidth &&
    props.maxWidth &&
    props.containerMaxWidth <= props.maxWidth
      ? props.containerMaxWidth
      : props.maxWidth;
  const style = {
    '--maxWidth': maxWidth ? `${maxWidth}px` : 'auto',
  } as React.CSSProperties;
  const sizes = maxWidth ? `(min-width: 1024px) ${maxWidth}px, 100vw` : '100vw';
  const alignment = props.alignment
    ? vercelStegaCleanAll(props.alignment)
    : 'center';

  const alignmentVariants = cva('w-[var(--maxWidth)] max-w-full', {
    variants: {
      required: {
        center: 'mx-auto',
        left: 'mr-auto',
        right: 'ml-auto',
      },
    },
  });

  return (
    <SanityImage
      className={alignmentVariants({
        required: alignment,
      })}
      data={props}
      sizes={sizes}
      style={style}
    />
  );
}

import type {SectionOfType} from 'types';

import {stegaClean} from '@sanity/client/stega';
import {cva} from 'class-variance-authority';

import {SanityImage} from '../../sanity-image';

export type ImageBlockProps = NonNullable<
  SectionOfType<'richtextSection'>['richtext']
>[number] & {
  _type: 'image';
};

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
  const alignment = props.alignment ? stegaClean(props.alignment) : 'center';

  const alignmentVariants = cva('w-(--maxWidth) max-w-full h-auto', {
    variants: {
      required: {
        center: 'mx-auto',
        left: 'mr-auto',
        right: 'ml-auto',
      },
    },
  });

  if (!props._ref) return null;

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

import type {TypeFromSelection} from 'groqd';

import {cx} from 'class-variance-authority';

import type {INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT} from '~/qroq/blocks';

import {SanityInternalLink} from '../../link/SanityInternalLink';

export type InternalLinkAnnotationProps = TypeFromSelection<
  typeof INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT
>;

export const richTextLinkClassName = cx(
  'text-primary font-medium underline-offset-4 hover:underline focus-visible:rounded-md focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
);

export function InternalLinkAnnotation(
  props: {children: React.ReactNode} & InternalLinkAnnotationProps,
) {
  return (
    <SanityInternalLink
      className={richTextLinkClassName}
      data={{
        _key: props._key,
        _type: 'internalLink',
        anchor: props.anchor,
        link: props.link,
        name: null,
      }}
    >
      {props.children}
    </SanityInternalLink>
  );
}

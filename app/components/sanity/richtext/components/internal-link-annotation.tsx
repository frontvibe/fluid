import type {RichTextBlock} from 'types';

import {cx} from 'class-variance-authority';

import {SanityInternalLink} from '../../link/sanity-internal-link';

export type InternalLinkAnnotationProps = NonNullable<
  RichTextBlock['markDefs']
>[number] & {
  _type: 'internalLink';
};

export const richTextLinkClassName = cx(
  'text-primary font-medium underline-offset-4 hover:underline focus-visible:rounded-md focus-visible:ring-ring focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2',
);

export function InternalLinkAnnotation(
  props: InternalLinkAnnotationProps & {children: React.ReactNode},
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

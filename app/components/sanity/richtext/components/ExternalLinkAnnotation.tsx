import type {TypeFromSelection} from 'groqd';

import type {EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT} from '~/qroq/blocks';

import {IconExternal} from '~/components/icons/IconExternal';
import {cn} from '~/lib/utils';

import {SanityExternalLink} from '../../link/SanityExternalLink';
import {richTextLinkClassName} from './InternalLinkAnnotation';

export type ExternalLinkAnnotationProps = TypeFromSelection<
  typeof EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT
>;

export function ExternalLinkAnnotation(
  props: {children: React.ReactNode} & ExternalLinkAnnotationProps,
) {
  return (
    <SanityExternalLink
      className={cn(richTextLinkClassName, 'inline-flex items-center gap-1')}
      data={{
        _key: props._key,
        _type: 'externalLink',
        link: props.link,
        name: null,
        openInNewTab: props.openInNewTab,
      }}
    >
      {props.children}
      {props.openInNewTab && <IconExternal className="size-3" />}
    </SanityExternalLink>
  );
}

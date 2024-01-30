import type {TypeFromSelection} from 'groqd';

import type {EXTERNAL_LINK_FRAGMENT} from '~/qroq/links';

import {cn} from '~/lib/utils';

type SanityExternalLinkProps = TypeFromSelection<typeof EXTERNAL_LINK_FRAGMENT>;

export function SanityExternalLink(props: {
  children?: React.ReactNode;
  className?: string;
  data?: SanityExternalLinkProps;
}) {
  const {children, className, data} = props;

  if (!data) return null;

  const {link, name, openInNewTab} = data;

  return link ? (
    <a
      className={cn([
        'focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      ])}
      href={link}
      rel="noopener noreferrer"
      target={openInNewTab ? '_blank' : '_self'}
    >
      {children ? children : name}
    </a>
  ) : null;
}

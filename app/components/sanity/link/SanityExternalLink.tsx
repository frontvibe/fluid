import type {TypeFromSelection} from 'groqd';

import type {EXTERNAL_LINK_FRAGMENT} from '~/qroq/links';

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
      className={className}
      href={link}
      rel="noopener noreferrer"
      target={openInNewTab ? '_blank' : '_self'}
    >
      {children ? children : name}
    </a>
  ) : null;
}

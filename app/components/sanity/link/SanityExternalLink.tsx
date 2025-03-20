import {cn} from '~/lib/utils';

export function SanityExternalLink(props: {
  children?: React.ReactNode;
  className?: string;
  data?: {
    _key: string;
    _type: 'externalLink';
    link?: null | string;
    name?: null | string;
    openInNewTab?: boolean | null;
  };
}) {
  const {children, className, data} = props;

  if (!data) return null;

  const {link, name, openInNewTab} = data;

  return link ? (
    <a
      className={cn([
        'focus-visible:ring-ring focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
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

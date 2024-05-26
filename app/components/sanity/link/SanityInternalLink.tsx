import type {LinkProps} from '@remix-run/react';
import type {TypeFromSelection} from 'groqd';

import {Link} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';

import type {INTERNAL_LINK_FRAGMENT} from '~/qroq/links';

import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

type SanityInternalLinkProps = TypeFromSelection<typeof INTERNAL_LINK_FRAGMENT>;

export function SanityInternalLink(props: {
  children?: React.ReactNode;
  className?: string;
  data?: SanityInternalLinkProps;
  onClick?: () => void;
}) {
  const {locale} = useRootLoaderData();
  const {children, className, data} = props;

  if (!data) return null;

  const {link, name} = data;

  const documentType = link?.documentType;
  const slug = link?.slug?.current;
  const anchor = data.anchor ? `#${data.anchor}` : '';

  const path: () => string = () => {
    switch (documentType) {
      case 'page':
        return `${locale.pathPrefix}/${slug}`;
      case 'product':
        return `${locale.pathPrefix}/products/${slug}`;
      case 'collection':
        return `${locale.pathPrefix}/collections/${slug}`;
      case 'home':
        return locale.pathPrefix || '/';
      case 'blogPost':
        return `${locale.pathPrefix}/blog/${slug}`;
      default:
        return '';
    }
  };

  // Remove encode stega data from url
  const url = stegaClean(`${path()}${anchor}`);

  // Todo: add Navlink support
  return (
    <Link
      className={cn([
        'focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      ])}
      onClick={props.onClick}
      prefetch="intent"
      to={url}
    >
      {children ? children : name}
    </Link>
  );
}

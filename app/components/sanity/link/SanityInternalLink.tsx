import type {Anchor} from 'types/sanity/sanity.generated';

import {Link} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';

import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

type Slug = null | {
  _type: 'slug';
  current?: null | string;
};

type SanityInternalLinkDataProps = {
  _key: null | string;
  _type: 'internalLink';
  anchor?: Anchor | null;
  link?:
    | null
    | {
        documentType: 'blogPost';
        slug: Slug;
      }
    | {
        documentType: 'collection';
        slug: Slug;
      }
    | {
        documentType: 'home';
        slug: Slug;
      }
    | {
        documentType: 'page';
        slug: Slug;
      }
    | {
        documentType: 'product';
        slug: Slug;
      };
  name: null | string;
};

export function SanityInternalLink(props: {
  children?: React.ReactNode;
  className?: string;
  data?: SanityInternalLinkDataProps;
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
      case 'blogPost':
        return `${locale.pathPrefix}/blog/${slug}`;
      case 'collection':
        return `${locale.pathPrefix}/collections/${slug}`;
      case 'home':
        return locale.pathPrefix || '/';
      case 'page':
        return `${locale.pathPrefix}/${slug}`;
      case 'product':
        return `${locale.pathPrefix}/products/${slug}`;
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
        'focus-visible:ring-ring focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
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

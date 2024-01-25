import type {TypeFromSelection} from 'groqd';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import {cx} from 'class-variance-authority';

import type {NESTED_NAVIGATION_FRAGMENT} from '~/qroq/links';

import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {NestedNavigationContent} from './NestedNavigationContent';
import {NavigationTrigger} from './NestedNavigationTrigger';

type SanityNestedNavigationProps = TypeFromSelection<
  typeof NESTED_NAVIGATION_FRAGMENT
>;

export function NestedNavigation(props: {data?: SanityNestedNavigationProps}) {
  const {data} = props;

  if (!data) return null;

  const {childLinks} = data;

  return data.name && childLinks && childLinks.length > 0 ? (
    <>
      <NavigationTrigger link={data.link}>{data.name}</NavigationTrigger>
      <NestedNavigationContent>
        <ul
          className={cx([
            'color-scheme',
            'relative z-10 flex w-auto min-w-[10rem] flex-col gap-1 rounded p-2 shadow',
          ])}
        >
          {childLinks.map((child) => (
            <NavigationMenu.Link asChild key={child._key}>
              <li
                className={cx([
                  'rounded px-2 py-1 transition-colors duration-100',
                  'hover:bg-color-scheme-text/10',
                  '[&>*]:flex',
                ])}
              >
                {child._type === 'internalLink' ? (
                  <SanityInternalLink data={child} />
                ) : child._type === 'externalLink' ? (
                  <SanityExternalLink data={child} />
                ) : null}
              </li>
            </NavigationMenu.Link>
          ))}
        </ul>
      </NestedNavigationContent>
    </>
  ) : data.link && data.name && (!childLinks || childLinks.length === 0) ? (
    // Render internal link if no child links
    <SanityInternalLink
      data={{
        _key: data._key,
        _type: 'internalLink',
        anchor: null,
        link: data.link,
        name: data.name,
      }}
    />
  ) : null;
}

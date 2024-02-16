import type {TypeFromSelection} from 'groqd';

import {cx} from 'class-variance-authority';
import {useCallback} from 'react';

import type {NESTED_NAVIGATION_FRAGMENT} from '~/qroq/links';

import {cn} from '~/lib/utils';

import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../ui/NavigationMenu';

export type SanityNestedNavigationProps = TypeFromSelection<
  typeof NESTED_NAVIGATION_FRAGMENT
>;

export function NestedNavigation(props: {
  data?: SanityNestedNavigationProps;
  setActiveItem: (item: string) => void;
}) {
  const {data, setActiveItem} = props;

  const handleOpen = useCallback(() => {
    setActiveItem(data?._key || '');
  }, [data, setActiveItem]);

  if (!data) return null;

  const {childLinks} = data;

  return data.name && childLinks && childLinks.length > 0 ? (
    <>
      <NavigationMenuTrigger onClick={handleOpen} onMouseEnter={handleOpen}>
        {data.link ? (
          <SanityInternalLink
            data={{
              _key: null,
              _type: 'internalLink',
              anchor: null,
              link: data.link,
              name: null,
            }}
          >
            {data.name}
          </SanityInternalLink>
        ) : (
          data.name
        )}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="m-0 grid w-full gap-1 p-2 lg:w-[var(--dropdown-width)]">
          {childLinks.map((child) => (
            <li key={child._key}>
              <ListItem {...child} />
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </>
  ) : data.link && data.name && (!childLinks || childLinks.length === 0) ? (
    // Render internal link if no child links
    <SanityInternalLink
      className={navigationMenuTriggerStyle()}
      data={{
        _key: data._key,
        _type: 'internalLink',
        anchor: null,
        link: data.link,
        name: data.name,
      }}
    >
      {data.name}
    </SanityInternalLink>
  ) : null;
}

function ListItem(props: SanityNestedNavigationProps['childLinks'][0]) {
  return (
    <NavigationMenuLink asChild>
      <div>
        {props._type === 'internalLink' ? (
          <SanityInternalLink
            className={cn(
              navigationMenuTriggerStyle(),
              'w-full justify-start rounded-sm hover:bg-accent',
            )}
            data={props}
          />
        ) : props._type === 'externalLink' ? (
          <SanityExternalLink
            className={cn(
              navigationMenuTriggerStyle(),
              'w-full justify-start rounded-sm hover:bg-accent',
            )}
            data={props}
          />
        ) : null}
      </div>
    </NavigationMenuLink>
  );
}

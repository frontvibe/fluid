import type {InferType} from 'groqd';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import type {HEADER_QUERY} from '~/qroq/queries';

import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {NestedNavigation} from './NestedNavigation';

type HeaderQuery = InferType<typeof HEADER_QUERY>;
type NavigationProps = NonNullable<HeaderQuery>['menu'];

export function Navigation(props: {data?: NavigationProps}) {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="flex gap-5">
        {props.data &&
          props.data?.length > 0 &&
          props.data?.map((item) => {
            return (
              <NavigationMenu.Item className="relative" key={item._key}>
                {item._type === 'internalLink' && (
                  <SanityInternalLink data={item} />
                )}
                {item._type === 'externalLink' && (
                  <SanityExternalLink data={item} />
                )}
                {item._type === 'nestedNavigation' && (
                  <NestedNavigation data={item} />
                )}
              </NavigationMenu.Item>
            );
          })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

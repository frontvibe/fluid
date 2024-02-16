import type {InferType} from 'groqd';

import {useEffect, useRef, useState} from 'react';

import type {HEADER_QUERY} from '~/qroq/queries';

import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../ui/NavigationMenu';
import {NestedNavigation} from './NestedNavigation';

type HeaderQuery = InferType<typeof HEADER_QUERY>;
export type NavigationProps = NonNullable<HeaderQuery>['menu'];

export function DesktopNavigation(props: {data?: NavigationProps}) {
  const menuRef = useRef<HTMLUListElement>(null);
  const [activeItem, setActiveItem] = useState<null | string | undefined>(null);
  const dropdownWidth = 200;
  const viewportPosition = useViewportPosition(
    menuRef,
    activeItem,
    dropdownWidth,
  );

  return (
    <NavigationMenu className="hidden touch:hidden lg:block" id="header-nav">
      <CssVars
        dropdownWidth={dropdownWidth}
        viewportPosition={viewportPosition}
      />
      <NavigationMenuList ref={menuRef}>
        {props.data &&
          props.data?.length > 0 &&
          props.data?.map((item) => (
            <NavigationMenuItem id={item._key!} key={item._key}>
              {item._type === 'internalLink' && (
                <SanityInternalLink
                  className={navigationMenuTriggerStyle()}
                  data={item}
                />
              )}
              {item._type === 'externalLink' && (
                <SanityExternalLink
                  className={navigationMenuTriggerStyle()}
                  data={item}
                />
              )}
              {item._type === 'nestedNavigation' && (
                <NestedNavigation data={item} setActiveItem={setActiveItem} />
              )}
            </NavigationMenuItem>
          ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function CssVars(props: {dropdownWidth: number; viewportPosition: number}) {
  const cssVar = `
    #header-nav {
      --viewport-position: ${props.viewportPosition}%;
      --dropdown-width: ${props.dropdownWidth}px;
    }
  `;

  return <style dangerouslySetInnerHTML={{__html: cssVar}} />;
}

// Dynamically calculate the position of the <NavigationMenuPrimitive.Viewport /> based on the active item
function useViewportPosition(
  menuRef: React.RefObject<HTMLUListElement>,
  activeItem: null | string | undefined,
  dropdownWidth: number,
) {
  const [viewportPosition, setViewportPosition] = useState(0);

  useEffect(() => {
    const menuElement = menuRef.current;

    if (!menuElement) return;

    const menuWidth = menuElement.offsetWidth;
    const menuLeft = menuElement.getBoundingClientRect().left;
    const activeChild = Array.from(menuElement.children).find(
      (child) => child.id === activeItem,
    );
    const dropdownWidthPercentage = (dropdownWidth / menuWidth) * 100;
    const rect = activeChild?.getBoundingClientRect();
    const positionPercentage = rect
      ? ((rect.left - menuLeft) / menuWidth) * 100
      : 0;

    if (positionPercentage + dropdownWidthPercentage > 100) {
      setViewportPosition(100 - dropdownWidthPercentage);
    } else {
      setViewportPosition(positionPercentage);
    }
  }, [menuRef, activeItem, dropdownWidth]);

  return viewportPosition;
}

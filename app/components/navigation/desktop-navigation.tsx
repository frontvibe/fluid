import type {ROOT_QUERYResult} from 'types/sanity/sanity.generated';

import {useEffect, useRef, useState} from 'react';

import {SanityExternalLink} from '../sanity/link/sanity-external-link';
import {SanityInternalLink} from '../sanity/link/sanity-internal-link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu';
import {NestedNavigation} from './nested-navigation';

export type NavigationProps = NonNullable<ROOT_QUERYResult['header']>['menu'];

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
    <NavigationMenu className="touch:hidden hidden lg:block" id="header-nav">
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

import type {CSSProperties} from 'react';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import {useMemo} from 'react';

import {useSanityRoot} from '~/hooks/useSanityRoot';

export function NestedNavigationContent(props: {children: React.ReactNode}) {
  const sanityRoot = useSanityRoot();
  const headerLogoWidth = sanityRoot.data?.header?.desktopLogoWidth || 0;
  const headerPaddingBottom = sanityRoot.data?.header?.padding?.bottom || 0;
  const assetLogoWidth = sanityRoot.data?.settings?.logo?.width || 0;
  const assetLogoHeight = sanityRoot.data?.settings?.logo?.height || 0;
  const logoAspectRatio = assetLogoWidth / assetLogoHeight;
  const logoHeight = headerLogoWidth / logoAspectRatio;
  const topDistance = useMemo(
    () => headerPaddingBottom + logoHeight,
    [headerPaddingBottom, logoHeight],
  );

  return (
    <NavigationMenu.Content
      className="absolute left-0 top-[var(--topDistance)] w-full"
      style={
        {
          '--topDistance': `${topDistance}px`,
        } as CSSProperties
      }
    >
      {props.children}
    </NavigationMenu.Content>
  );
}

import {useCallback, useState} from 'react';

import type {NavigationProps} from './DesktopNavigation';
import type {SanityNestedNavigationProps} from './NestedNavigation';

import {IconMenu} from '../icons/IconMenu';
import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {
  MobileNavigationMenu,
  MobileNavigationMenuContent,
  MobileNavigationMenuItem,
  MobileNavigationMenuLink,
  MobileNavigationMenuList,
  MobileNavigationMenuTrigger,
} from '../ui/MobileNavigationMenu';
import {Sheet, SheetContent, SheetTrigger} from '../ui/Sheet';

export function MobileNavigation(props: {data?: NavigationProps}) {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);

  if (!props.data) return null;

  // Todo => Add <Navlink /> support
  return (
    <div className="md:hidden">
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger className="flex items-center justify-center p-2 pr-[var(--mobileHeaderXPadding)] md:pr-0">
          <IconMenu className="size-7" strokeWidth={1.5} />
        </SheetTrigger>
        <SheetContent
          className="flex h-[var(--dialog-content-height)] max-h-screen w-screen flex-col gap-0 bg-background p-0 text-foreground sm:max-w-lg"
          onCloseAutoFocus={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
          style={
            {
              '--dialog-content-height': 'calc(100dvh * .75)',
            } as React.CSSProperties
          }
        >
          <MobileNavigationMenu className="flex-1 overflow-x-hidden overflow-y-scroll text-xl font-medium">
            <MobileNavigationMenuList>
              {props.data &&
                props.data?.length > 0 &&
                props.data?.map((item) => (
                  <MobileNavigationMenuItem key={item._key}>
                    {item._type === 'internalLink' && (
                      <MobileNavigationMenuLink asChild onClick={handleClose}>
                        <div>
                          <SanityInternalLink data={item} />
                        </div>
                      </MobileNavigationMenuLink>
                    )}
                    {item._type === 'externalLink' && (
                      <MobileNavigationMenuLink asChild onClick={handleClose}>
                        <div>
                          <SanityExternalLink data={item} />
                        </div>
                      </MobileNavigationMenuLink>
                    )}
                    {item._type === 'nestedNavigation' && (
                      <NestedMobileNavigation
                        data={item}
                        onClose={handleClose}
                      />
                    )}
                  </MobileNavigationMenuItem>
                ))}
            </MobileNavigationMenuList>
          </MobileNavigationMenu>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NestedMobileNavigation(props: {
  data?: SanityNestedNavigationProps;
  onClose: () => void;
}) {
  const {data} = props;

  if (!data) return null;

  const {childLinks} = data;

  return data.name && childLinks && childLinks.length > 0 ? (
    <>
      <MobileNavigationMenuTrigger>{data.name}</MobileNavigationMenuTrigger>
      <MobileNavigationMenuContent className="flex-1 overflow-y-scroll">
        <MobileNavigationMenuList>
          {childLinks &&
            childLinks.length > 0 &&
            childLinks.map((child) => (
              <MobileNavigationMenuLink
                asChild
                key={child._key}
                onClick={props.onClose}
              >
                <div>
                  {child._type === 'internalLink' ? (
                    <SanityInternalLink data={child} />
                  ) : child._type === 'externalLink' ? (
                    <SanityExternalLink data={child} />
                  ) : null}
                </div>
              </MobileNavigationMenuLink>
            ))}
        </MobileNavigationMenuList>
      </MobileNavigationMenuContent>
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
    >
      {data.name}
    </SanityInternalLink>
  ) : null;
}

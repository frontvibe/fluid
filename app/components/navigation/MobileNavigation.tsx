import {useCallback, useState} from 'react';

import {cn} from '~/lib/utils';

import type {NavigationProps} from './DesktopNavigation';
import type {SanityNestedNavigationProps} from './NestedNavigation';

import {IconChevron} from '../icons/IconChevron';
import {IconMenu} from '../icons/IconMenu';
import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {
  Drawer,
  DrawerContent,
  DrawerNestedRoot,
  DrawerTrigger,
} from '../ui/Drawer';

export function MobileNavigation(props: {data?: NavigationProps}) {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);

  if (!props.data) return null;

  // Todo => Add <Navlink /> support
  return (
    <div className="md:hidden">
      <Drawer onOpenChange={setOpen} open={open}>
        <DrawerTrigger className="flex items-center justify-center p-2 pr-[var(--mobileHeaderXPadding)] md:pr-0">
          <IconMenu className="size-7" strokeWidth={1.5} />
        </DrawerTrigger>
        <MobileNavigationContent>
          {props.data &&
            props.data?.length > 0 &&
            props.data?.map((item) => (
              <li key={item._key}>
                {item._type === 'internalLink' && (
                  <div onClick={handleClose}>
                    <SanityInternalLink data={item} />
                  </div>
                )}
                {item._type === 'externalLink' && (
                  <div onClick={handleClose}>
                    <SanityExternalLink data={item} />
                  </div>
                )}
                {item._type === 'nestedNavigation' && (
                  <MobileNavigationNested data={item} onClose={handleClose} />
                )}
              </li>
            ))}
        </MobileNavigationContent>
      </Drawer>
    </div>
  );
}

function MobileNavigationContent(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DrawerContent
      className={cn(
        'h-[var(--dialog-content-height)] max-h-screen w-screen bg-background p-0 text-foreground [--dialog-content-height:calc(100dvh_*_.75)]',
        props.className,
      )}
      onCloseAutoFocus={(e) => e.preventDefault()}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <nav className="mt-4 flex h-full flex-col gap-0 p-6">
        <ul className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-scroll pb-6 text-xl font-medium">
          {props.children}
        </ul>
      </nav>
    </DrawerContent>
  );
}

function MobileNavigationNested(props: {
  data?: SanityNestedNavigationProps;
  onClose: () => void;
}) {
  const {data, onClose} = props;
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    setOpen(false);
  }, [onClose]);

  if (!data) return null;

  const {childLinks} = data;

  return data.name && childLinks && childLinks.length > 0 ? (
    <DrawerNestedRoot onOpenChange={setOpen} open={open}>
      <DrawerTrigger className="flex items-center gap-2">
        {data.name}
        <span>
          <IconChevron className="size-5" direction="right" />
        </span>
      </DrawerTrigger>
      <MobileNavigationContent className="h-[calc(var(--dialog-content-height)*.95)]">
        {childLinks &&
          childLinks.length > 0 &&
          childLinks.map((child) => (
            <li key={child._key} onClick={handleClose}>
              {child._type === 'internalLink' ? (
                <SanityInternalLink data={child} />
              ) : child._type === 'externalLink' ? (
                <SanityExternalLink data={child} />
              ) : null}
            </li>
          ))}
      </MobileNavigationContent>
    </DrawerNestedRoot>
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

import {useCallback, useState} from 'react';

import {useDevice} from '~/hooks/useDevice';
import {cn} from '~/lib/utils';

import type {NavigationProps} from './DesktopNavigation';
import type {SanityNestedNavigationProps} from './NestedNavigation';

import {IconChevron} from '../icons/IconChevron';
import {IconMenu} from '../icons/IconMenu';
import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {iconButtonClass} from '../ui/Button';
import {
  Drawer,
  DrawerContent,
  DrawerNestedRoot,
  DrawerTrigger,
} from '../ui/Drawer';
import {ScrollArea} from '../ui/ScrollArea';

const mobileMenuLinkClass = cn(
  'flex rounded-sm px-4 py-2 items-center gap-2 w-full transition-colors notouch:hover:bg-accent notouch:hover:text-accent-foreground touch:active:bg-accent touch:active:text-accent-foreground',
);

export function MobileNavigation(props: {data?: NavigationProps}) {
  const [open, setOpen] = useState(false);
  const device = useDevice();
  const handleClose = useCallback(() => setOpen(false), []);

  if (!props.data) return null;

  // Todo => Add <Navlink /> support
  return (
    <div className="touch:block lg:hidden">
      <Drawer
        direction={device === 'desktop' ? 'right' : 'bottom'}
        onOpenChange={setOpen}
        open={open}
      >
        <DrawerTrigger className={cn(iconButtonClass, '-mr-2 lg:mr-0')}>
          <IconMenu className="size-7" strokeWidth={1.5} />
        </DrawerTrigger>
        <MobileNavigationContent>
          {props.data &&
            props.data?.length > 0 &&
            props.data?.map((item) => (
              <li key={item._key}>
                {item._type === 'internalLink' && (
                  <SanityInternalLink
                    className={mobileMenuLinkClass}
                    data={item}
                    onClick={handleClose}
                  />
                )}
                {item._type === 'externalLink' && (
                  <SanityExternalLink data={item} />
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
      className={cn([
        'h-[--dialog-content-height] max-h-screen w-screen bg-background p-0 text-foreground',
        '[--dialog-content-height:calc(100svh_*_.75)] [--dialog-content-max-width:calc(32rem)]',
        'lg:left-auto lg:right-0 lg:max-w-[--dialog-content-max-width] lg:[--dialog-content-height:100svh]',
        props.className,
      ])}
      onCloseAutoFocus={(e) => e.preventDefault()}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <div className="mt-4 size-full overflow-hidden p-6">
        <ScrollArea className="size-full pr-4">
          <nav>
            <ul className="flex flex-col gap-2 pb-6 text-xl font-medium">
              {props.children}
            </ul>
          </nav>
        </ScrollArea>
      </div>
    </DrawerContent>
  );
}

function MobileNavigationNested(props: {
  data?: SanityNestedNavigationProps;
  onClose: () => void;
}) {
  const {data, onClose} = props;
  const [open, setOpen] = useState(false);
  const device = useDevice();
  const handleClose = useCallback(() => {
    onClose();
    setOpen(false);
  }, [onClose]);

  if (!data) return null;

  const {childLinks} = data;

  return data.name && childLinks && childLinks.length > 0 ? (
    <DrawerNestedRoot
      direction={device === 'desktop' ? 'right' : 'bottom'}
      onOpenChange={setOpen}
      open={open}
    >
      <DrawerTrigger className={mobileMenuLinkClass}>
        {data.name}
        <span>
          <IconChevron className="size-5" direction="right" />
        </span>
      </DrawerTrigger>
      <MobileNavigationContent
        className={cn([
          'h-[calc(var(--dialog-content-height)*.95)]',
          'lg:h-[--dialog-content-height] lg:max-w-[calc(var(--dialog-content-max-width)*.95)]',
        ])}
      >
        {childLinks &&
          childLinks.length > 0 &&
          childLinks.map((child) => (
            <li key={child._key}>
              {child._type === 'internalLink' ? (
                <SanityInternalLink
                  className={mobileMenuLinkClass}
                  data={child}
                  onClick={handleClose}
                />
              ) : child._type === 'externalLink' ? (
                <SanityExternalLink
                  className={mobileMenuLinkClass}
                  data={child}
                />
              ) : null}
            </li>
          ))}
      </MobileNavigationContent>
    </DrawerNestedRoot>
  ) : data.link && data.name && (!childLinks || childLinks.length === 0) ? (
    // Render internal link if no child links
    <SanityInternalLink
      className={mobileMenuLinkClass}
      data={{
        _key: data._key,
        _type: 'internalLink',
        anchor: null,
        link: data.link,
        name: data.name,
      }}
      onClick={handleClose}
    >
      {data.name}
    </SanityInternalLink>
  ) : null;
}

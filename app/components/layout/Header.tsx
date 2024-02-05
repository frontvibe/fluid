import type {CSSProperties} from 'react';

import {Link} from '@remix-run/react';
import {vercelStegaCleanAll} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';
import {m, useTransform} from 'framer-motion';
import React from 'react';

import {useBoundedScroll} from '~/hooks/useBoundedScroll';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';
import {cn} from '~/lib/utils';

import {headerVariants} from '../cva/header';
import {DesktopNavigation} from '../navigation/DesktopNavigation';
import {MobileNavigation} from '../navigation/MobileNavigation';
import {CartDrawer} from './CartDrawer';
import {Logo} from './Logo';

export function Header() {
  const {data} = useSanityRoot();
  const header = data?.header;
  const logoWidth = header?.desktopLogoWidth
    ? `${header?.desktopLogoWidth}px`
    : null;
  const homePath = useLocalePath({path: '/'});
  const cssVars = useSettingsCssVars({
    selector: 'header',
    settings: header,
  });

  return (
    <HeaderWrapper>
      <style dangerouslySetInnerHTML={{__html: cssVars}} />
      <div className="[--mobileHeaderXPadding:.75rem] md:container">
        <div className="flex items-center justify-between">
          <Link prefetch="intent" to={homePath}>
            <Logo
              className="h-auto w-[var(--logoWidth)] pl-[var(--mobileHeaderXPadding)] md:pl-0"
              sizes={logoWidth}
              style={
                {
                  '--logoWidth': logoWidth || 'auto',
                } as CSSProperties
              }
            />
          </Link>
          <div className="flex items-center gap-0 md:gap-2">
            <DesktopNavigation data={header?.menu} />
            <CartDrawer />
            <MobileNavigation data={header?.menu} />
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
}

function HeaderWrapper(props: {children: React.ReactNode}) {
  const {data} = useSanityRoot();
  const header = data?.header;
  const showSeparatorLine = header?.showSeparatorLine;
  const blur = header?.blur;
  const sticky = vercelStegaCleanAll(header?.sticky);

  const headerClassName = cx([
    'section-padding bg-background text-foreground',
    sticky !== 'none' && 'sticky top-0 z-50',
    blur &&
      'bg-opacity-95 backdrop-blur supports-[backdrop-filter]:bg-opacity-85',
    headerVariants({
      optional: showSeparatorLine ? 'separator-line' : null,
    }),
  ]);

  return sticky === 'onScrollUp' ? (
    <HeaderAnimation className={headerClassName}>
      {props.children}
    </HeaderAnimation>
  ) : (
    <header className={headerClassName}>{props.children}</header>
  );
}

function HeaderAnimation(props: {
  children: React.ReactNode;
  className: string;
}) {
  const {scrollYBoundedProgress} = useBoundedScroll(400);
  const scrollYBoundedProgressDelayed = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1],
  );

  // Header animation inspired by the fantastic Build UI recipes
  // (Check out the original at: https://buildui.com/recipes/fixed-header)
  // Credit to the Build UI team for the awesome Header animation.
  return (
    <m.header
      className={cn(props.className)}
      style={{
        opacity: useTransform(
          scrollYBoundedProgressDelayed,
          [0, 0.4, 1],
          [1, 0, 0],
        ),
        transform: useTransform(
          scrollYBoundedProgressDelayed,
          [0, 1],
          ['translateY(0)', 'translateY(-100%)'],
        ),
      }}
    >
      {props.children}
    </m.header>
  );
}

import type {CSSProperties} from 'react';

import {Link} from '@remix-run/react';
import {vercelStegaCleanAll} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';
import {LazyMotion, m} from 'framer-motion';
import React from 'react';

import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useScrollDirection} from '~/hooks/useScrollDirection';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';
import {cn} from '~/lib/utils';

import {headerVariants} from '../cva/header';
import {DesktopNavigation} from '../navigation/DesktopNavigation';
import {MobileNavigation} from '../navigation/MobileNavigation';
import {CartCount} from './CartCount';
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
            <CartCount />
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
    sticky === 'always' && 'sticky top-0 z-50',
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
  const loadFeatures = async () =>
    await import('../../lib/framerMotionFeatures').then((res) => res.default);
  const {direction} = useScrollDirection();

  // Todo => Remove framer motion and use Top + Bottom position
  return (
    <LazyMotion features={loadFeatures} strict>
      <m.header
        animate={{
          opacity: direction === 'up' || !direction ? 1 : 0,
          y: direction === 'up' || !direction ? 0 : '-100%',
        }}
        className={cn([
          props.className,
          direction === 'up' && 'sticky top-0 z-50',
        ])}
        data-direction={direction}
        transition={{
          duration: 0.1,
          ease: 'linear',
        }}
      >
        {props.children}
      </m.header>
    </LazyMotion>
  );
}

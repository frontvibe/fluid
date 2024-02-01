import type {CSSProperties} from 'react';

import {Link} from '@remix-run/react';
import {vercelStegaCleanAll} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';
import {LazyMotion, m, useTransform} from 'framer-motion';

import {useBoundedScroll} from '~/hooks/useBoundedScroll';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';

import {headerVariants} from '../cva/header';
import {Navigation} from '../navigation/Navigation';
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
      <div className="container">
        <div className="flex items-center justify-between">
          <Link prefetch="intent" to={homePath}>
            <Logo
              className="h-auto w-[var(--logoWidth)]"
              sizes={logoWidth}
              style={
                {
                  '--logoWidth': logoWidth || 'auto',
                } as CSSProperties
              }
            />
          </Link>
          <div className="flex items-center gap-3">
            {/* Desktop navigation */}
            <div className="hidden md:block">
              <Navigation data={header?.menu} />
            </div>
            <CartCount />
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
    (sticky === 'onScrollUp' || sticky === 'always') && 'sticky top-0 z-50',
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
  // See Animated Sticky Header from Build UI (https://buildui.com/recipes/fixed-header)
  const loadFeatures = async () =>
    await import('../../lib/framerMotionFeatures').then((res) => res.default);
  const {scrollYBoundedProgress} = useBoundedScroll(400);
  const scrollYBoundedProgressDelayed = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1],
  );

  const style = {
    transform: useTransform(
      scrollYBoundedProgressDelayed,
      [0, 1],
      ['translateY(0)', 'translateY(-100%)'],
    ),
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.header className={props.className} style={style}>
        {props.children}
      </m.header>
    </LazyMotion>
  );
}

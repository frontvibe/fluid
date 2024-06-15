import type {Variants} from 'framer-motion';
import type {CSSProperties} from 'react';

import {Link, useLocation} from '@remix-run/react';
import {getImageDimensions} from '@sanity/asset-utils';
import {stegaClean} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';
import {m, transform, useMotionValueEvent, useTransform} from 'framer-motion';
import React, {useEffect, useState} from 'react';

import {useBoundedScroll} from '~/hooks/useBoundedScroll';
import {useColorsCssVars} from '~/hooks/useColorsCssVars';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {cn} from '~/lib/utils';

import {headerVariants} from '../cva/header';
import {IconAccount} from '../icons/IconAccount';
import {DesktopNavigation} from '../navigation/DesktopNavigation';
import {MobileNavigation} from '../navigation/MobileNavigation';
import {IconButton} from '../ui/Button';
import {CartDrawer} from './CartDrawer';
import {Logo} from './Logo';

export function Header() {
  const {data} = useSanityRoot();
  const header = data?.header;
  const logoWidth = header?.desktopLogoWidth
    ? `${header?.desktopLogoWidth}px`
    : undefined;
  const homePath = useLocalePath({path: '/'});
  const colorsCssVars = useColorsCssVars({
    selector: 'header',
    settings: header,
  });

  return (
    <HeaderWrapper>
      <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
      <div className="container">
        <div className="flex items-center justify-between">
          <Link className="group" prefetch="intent" to={homePath}>
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
          <div className="flex items-center">
            <DesktopNavigation data={header?.menu} />
            <AccountLink className="relative flex items-center justify-center focus:ring-primary/5" />
            <CartDrawer />
            <MobileNavigation data={header?.menu} />
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
}

function AccountLink({className}: {className?: string}) {
  return (
    <IconButton asChild>
      <Link className={className} to="/account">
        <IconAccount className="size-6" />
      </Link>
    </IconButton>
  );
}

function HeaderWrapper(props: {children: React.ReactNode}) {
  const {data} = useSanityRoot();
  const header = data?.header;
  const showSeparatorLine = header?.showSeparatorLine;
  const blur = header?.blur;
  const sticky = stegaClean(header?.sticky);

  const headerClassName = cx([
    'section-padding bg-background text-foreground',
    sticky !== 'none' && 'sticky top-0 z-50',
    blur &&
      'bg-opacity-95 backdrop-blur supports-[backdrop-filter]:bg-opacity-85',
    headerVariants({
      optional: showSeparatorLine ? 'separator-line' : null,
    }),
  ]);

  return (
    <>
      {sticky === 'onScrollUp' ? (
        <HeaderAnimation className={headerClassName}>
          {props.children}
        </HeaderAnimation>
      ) : (
        <header className={headerClassName}>{props.children}</header>
      )}
      <HeaderHeightCssVars />
    </>
  );
}

function HeaderAnimation(props: {
  children: React.ReactNode;
  className: string;
}) {
  const {pathname} = useLocation();
  const [activeVariant, setActiveVariant] = useState<
    'hidden' | 'initial' | 'visible'
  >('initial');
  const desktopHeaderHeight = useHeaderHeigth()?.desktopHeaderHeight || 0;
  const {scrollYBoundedProgress} = useBoundedScroll(250);
  const scrollYBoundedProgressDelayed = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1],
  );

  useEffect(() => {
    // Reset the header position on route change
    setActiveVariant('initial');
  }, [pathname]);

  useMotionValueEvent(scrollYBoundedProgressDelayed, 'change', (latest) => {
    if (latest === 0) {
      setActiveVariant('visible');
    } else if (latest > 0.5) {
      setActiveVariant('hidden');
    } else {
      setActiveVariant('visible');
    }

    const newDesktopHeaderHeight = transform(
      latest,
      [0, 1],
      [`${desktopHeaderHeight}px`, '0px'],
    );

    // Reassign header height css var on scroll
    document.documentElement.style.setProperty(
      '--desktopHeaderHeight',
      newDesktopHeaderHeight,
    );
  });

  const variants: Variants = {
    hidden: {
      transform: 'translateY(-100%)',
    },
    initial: {
      transform: 'translateY(0)',
      transition: {
        duration: 0,
      },
    },
    visible: {
      transform: 'translateY(0)',
    },
  };

  // Header animation inspired by the fantastic Build UI recipes
  // (Check out the original at: https://buildui.com/recipes/fixed-header)
  // Credit to the Build UI team for the awesome Header animation.
  return (
    <>
      <m.header
        animate={activeVariant}
        className={cn(props.className)}
        initial="visible"
        transition={{
          duration: 0.2,
        }}
        variants={variants}
      >
        {props.children}
      </m.header>
    </>
  );
}

function HeaderHeightCssVars() {
  const desktopHeaderHeight = useHeaderHeigth()?.desktopHeaderHeight || 0;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root { --desktopHeaderHeight: ${desktopHeaderHeight}px; }`,
      }}
    />
  );
}

function useHeaderHeigth() {
  const {data} = useSanityRoot();
  const headerPadding = {
    bottom: data?.header?.padding?.bottom || 0,
    top: data?.header?.padding?.top || 0,
  };
  const desktopLogoWidth = data?.header?.desktopLogoWidth || 1;
  const headerBorder = data?.header?.showSeparatorLine ? 1 : 0;
  const sanitySettings = data?.settings;
  const logo = sanitySettings?.logo;
  const width = logo ? getImageDimensions(logo._ref).width : 0;
  const height = logo ? getImageDimensions(logo._ref).height : 0;
  const desktopLogoHeight =
    logo?._ref && width && height ? (desktopLogoWidth * height) / width : 44;

  const desktopHeaderHeight = (
    desktopLogoHeight +
    headerPadding.top +
    headerPadding.bottom +
    headerBorder
  ).toFixed(2);

  return {desktopHeaderHeight};
}

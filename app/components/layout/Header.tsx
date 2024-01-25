import type {CSSProperties} from 'react';

import {Link} from '@remix-run/react';
import {cx} from 'class-variance-authority';

import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';

import {headerVariants} from '../cva/header';
import {Navigation} from '../navigation/Navigation';
import {CartCount} from './CartCount';
import {Logo} from './Logo';

export function Header() {
  return <DesktopHeader />;
}

function DesktopHeader() {
  const {data} = useSanityRoot();
  const header = data?.header;
  const logoWidth = header?.desktopLogoWidth
    ? `${header?.desktopLogoWidth}px`
    : null;
  const showSeparatorLine = header?.showSeparatorLine;
  const cssVars = useSettingsCssVars({
    settings: header,
  });
  return (
    <header
      className={cx([
        'color-scheme section-padding relative',
        headerVariants({
          optional: showSeparatorLine ? 'separator-line' : null,
        }),
      ])}
      style={cssVars}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link prefetch="intent" to="/">
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
            <Navigation data={header?.menu} />
            <CartCount />
          </div>
        </div>
      </div>
    </header>
  );
}

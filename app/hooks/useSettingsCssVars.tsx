import type {TypeFromSelection} from 'groqd';

import type {BORDER_FRAGMENT, SHADOW_FRAGMENT} from '~/qroq/fragments';

import {useSanityRoot} from './useSanityRoot';

type BorderFragment = TypeFromSelection<typeof BORDER_FRAGMENT> | null;
type ShadowFragment = TypeFromSelection<typeof SHADOW_FRAGMENT> | null;

export function useSettingsCssVars() {
  const {data} = useSanityRoot();
  const settings = data?.settings;

  const cssVars = `
  :root {
    --badges-corner-radius: ${settings?.badgesCornerRadius || 0}px;
    --space-between-template-sections: ${settings?.spaceBetweenTemplateSections || 0}px;
    --grid-horizontal-space: ${settings?.grid?.horizontalSpace || 0}px;
    --grid-vertical-space: ${settings?.grid?.verticalSpace || 0}px;
    ${borderCssVars('product-card', settings?.productCards?.border)}
    ${shadowCssVars('product-card', settings?.productCards?.shadow)}
    ${borderCssVars('collection-card', settings?.collectionCards?.border)}
    ${shadowCssVars('collection-card', settings?.collectionCards?.shadow)}
    ${borderCssVars('blog-card', settings?.blogCards?.border)}
    ${shadowCssVars('blog-card', settings?.blogCards?.shadow)}
    ${borderCssVars('button', settings?.buttonsBorder)}
    ${shadowCssVars('button', settings?.buttonsShadow)}
    ${borderCssVars('input', settings?.inputsBorder)}
    ${shadowCssVars('input', settings?.inputsShadow)}
    ${borderCssVars('dropdown-popup', settings?.dropdownsAndPopupsBorder)}
    ${shadowCssVars('dropdown-popup', settings?.dropdownsAndPopupsShadow)}
    ${borderCssVars('media', settings?.mediaBorder)}
    ${shadowCssVars('media', settings?.mediaShadow)}
  }
` as const;

  return cssVars.trim();
}

function borderCssVars(name: string, border?: BorderFragment) {
  return `
    --${name}-border-corner-radius: ${border?.cornerRadius || 0}px;
    --${name}-border-thickness: ${border?.thickness || 0}px;
    --${name}-border-opacity: ${border?.opacity ? border?.opacity / 100 : 0};
  `.trim();
}

function shadowCssVars(name: string, shadow?: ShadowFragment) {
  return `
    --${name}-shadow-opacity: ${shadow?.opacity ? shadow?.opacity / 100 : 0};
    --${name}-shadow-horizontal-offset: ${shadow?.horizontalOffset || 0}px;
    --${name}-shadow-vertical-offset: ${shadow?.verticalOffset || 0}px;
    --${name}-shadow-blur-radius: ${shadow?.blur || 0}px;
  `.trim();
}

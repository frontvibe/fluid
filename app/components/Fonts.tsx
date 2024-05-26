import type {InferType} from 'groqd';

import {stegaClean} from '@sanity/client/stega';

import type {FONT_CATEGORY_FRAGMENT} from '~/qroq/fragments';
import type {FONTS_QUERY} from '~/qroq/queries';

import {useSanityRoot} from '~/hooks/useSanityRoot';

type FontsQuery = InferType<typeof FONTS_QUERY>;
type FontAssetsFragment = InferType<typeof FONT_CATEGORY_FRAGMENT.fontAssets>;

const defaultFontFamily =
  '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu, Helvetica Neue, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;';

export function Fonts() {
  const {data} = useSanityRoot();
  const fontsData = stegaClean(data?.fonts);

  if (!fontsData) {
    return null;
  }

  const fontFaces = generateFontFaces({fontsData});
  const cssFontVariables = generateCssFontVariables({fontsData});

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: fontFaces + '\n' + cssFontVariables,
      }}
    ></style>
  );
}

export function getFonts({fontsData}: {fontsData: FontsQuery}) {
  const headingFonts =
    fontsData?.heading?.font &&
    fontsData.heading.font.length > 0 &&
    fontsData.heading.font[0].fontAssets?.length > 0
      ? fontsData.heading.font[0].fontAssets
      : [];
  const bodyFonts =
    fontsData?.body.font &&
    fontsData.body?.font.length > 0 &&
    fontsData.body.font[0].fontAssets?.length > 0
      ? fontsData.body.font[0].fontAssets
      : [];
  const extraFonts =
    fontsData?.extra.font &&
    fontsData.extra.font?.length > 0 &&
    fontsData.extra.font[0]?.fontAssets?.length > 0
      ? fontsData.extra.font[0]?.fontAssets
      : [];

  return [...headingFonts, ...bodyFonts, ...extraFonts];
}

function generateFontFaces({fontsData}: {fontsData: FontsQuery}) {
  const fonts = getFonts({fontsData});

  if (fonts?.length > 0) {
    return fonts
      .map((font) => {
        return `
          @font-face {
            font-family: "${font.fontName}";
            src: ${resolveFontAssetUrls(font)};
            font-weight: ${font.fontWeight};
            font-style: ${font.fontStyle};
            font-display: swap;
          }
        `.trim();
      })
      .join('\n');
  }

  return '';
}

function resolveFontAssetUrls(font: FontAssetsFragment[0]) {
  const fontAssetUrls = [];

  font.woff2 && fontAssetUrls.push(`url("${font.woff2.url}") format("woff2")`);
  font.woff && fontAssetUrls.push(`url("${font.woff.url}") format("woff")`);
  font.ttf && fontAssetUrls.push(`url("${font.ttf.url}") format("truetype")`);

  return fontAssetUrls.join(', ');
}

function generateCssFontVariables({fontsData}: {fontsData: FontsQuery}) {
  const fontCategories: Array<{
    antialiased?: boolean | null;
    baseSize?: null | number;
    capitalize?: boolean | null;
    categoryName?: string;
    fontName?: string;
    fontType?: string;
    letterSpacing?: null | number;
    lineHeight?: null | number;
  }> = [];

  fontCategories.push({
    baseSize: fontsData?.heading.baseSize,
    capitalize: fontsData?.heading.capitalize,
    categoryName: 'heading',
    fontName: fontsData?.heading.font?.[0]?.fontName || defaultFontFamily,
    fontType: fontsData?.heading.font?.[0]?.fontType || 'unset',
    letterSpacing: fontsData?.heading.letterSpacing,
    lineHeight: fontsData?.heading.lineHeight,
    ...fontsData?.heading.font?.[0],
  });

  fontCategories.push({
    baseSize: fontsData?.body.baseSize,
    capitalize: fontsData?.body.capitalize,
    categoryName: 'body',
    fontName: fontsData?.body.font?.[0]?.fontName || defaultFontFamily,
    fontType: fontsData?.body.font?.[0]?.fontType || 'unset',
    letterSpacing: fontsData?.body.letterSpacing,
    lineHeight: fontsData?.body.lineHeight,
    ...fontsData?.body.font?.[0],
  });

  fontCategories.push({
    baseSize: fontsData?.extra.baseSize,
    capitalize: fontsData?.extra.capitalize,
    categoryName: 'extra',
    fontName: fontsData?.extra.font?.[0]?.fontName || defaultFontFamily,
    fontType: fontsData?.extra.font?.[0]?.fontType || 'unset',
    letterSpacing: fontsData?.extra.letterSpacing,
    lineHeight: fontsData?.extra.lineHeight,
    ...fontsData?.extra.font?.[0],
  });

  if (fontCategories?.length > 0) {
    return `
      :root {
        ${fontVariables()}
      }
    `.trim();
  }

  function fontVariables() {
    return fontCategories
      .map((fontCategory) => {
        return `
        --${fontCategory.categoryName}-font-family: ${
          fontCategory.fontName ? fontCategory.fontName : 'unset'
        };
        --${fontCategory.categoryName}-font-type: ${fontCategory.fontType};
        --${fontCategory.categoryName}-line-height: ${
          fontCategory.lineHeight ? fontCategory.lineHeight : 'unset'
        };
        --${fontCategory.categoryName}-letter-spacing: ${
          fontCategory.letterSpacing ? fontCategory.letterSpacing : 'unset'
        };
        --${fontCategory.categoryName}-base-size: ${
          fontCategory.baseSize ? fontCategory.baseSize : 'unset'
        };
        --${fontCategory.categoryName}-capitalize: ${
          fontCategory.capitalize ? 'uppercase' : 'none'
        };
        --${fontCategory.categoryName}-font-webkit-font-smoothing: ${
          fontCategory.antialiased ? 'antialiased' : 'unset'
        };
        --${fontCategory.categoryName}-font-moz-osx-font-smoothing: ${
          fontCategory.antialiased ? 'grayscale' : 'unset'
        };
        `.trim();
      })
      .join('\n');
  }

  return '';
}

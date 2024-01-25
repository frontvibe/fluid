import type {InferType} from 'groqd';

import type {FONTS_QUERY} from '~/qroq/queries';

import {getFonts} from '~/components/Fonts';

type PreloadLink = {
  as: string;
  crossOrigin: string;
  href: string;
  rel: string;
  tagName: string;
  type: string;
};

type FontsData = InferType<typeof FONTS_QUERY>;

export function generateFontsPreloadLinks({
  fontsData,
}: {
  fontsData?: FontsData;
}) {
  const fonts = fontsData ? getFonts({fontsData}) : [];
  const preloadLinks: Array<PreloadLink> = [];
  const fontTypes = ['woff2', 'woff', 'ttf'] as const;

  fonts.forEach((font) => {
    fontTypes.forEach((fontType) => {
      if (font[fontType]) {
        preloadLinks.push({
          as: 'font',
          crossOrigin: 'anonymous',
          href: font[fontType]?.url!,
          rel: 'preload',
          tagName: 'link',
          type: `font/${fontType}`,
        });
      }
    });
  });

  return preloadLinks;
}

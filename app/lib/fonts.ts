import type {ROOT_QUERYResult} from 'types/sanity/sanity.generated';

import {getFonts} from '~/components/fonts';

export type FontsQuery = NonNullable<ROOT_QUERYResult['fonts']>;

type PreloadLink = {
  as: string;
  crossOrigin: string;
  href: string;
  rel: string;
  tagName: string;
  type: string;
};

export function generateFontsPreloadLinks({
  fontsData,
}: {
  fontsData?: FontsQuery | null;
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
          href: font[fontType].url as string,
          rel: 'preload',
          tagName: 'link',
          type: `font/${fontType}`,
        });
      }
    });
  });

  return preloadLinks;
}

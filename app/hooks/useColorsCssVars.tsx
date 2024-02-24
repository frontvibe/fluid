import type {InferType} from 'groqd';

import {darken, mix, readableColor, toRgba} from 'color2k';

import type {FOOTER_SETTINGS_FRAGMENT} from '~/qroq/footers';
import type {SETTINGS_FRAGMENT} from '~/qroq/fragments';
import type {HEADER_QUERY} from '~/qroq/queries';
import type {SECTION_SETTINGS_FRAGMENT} from '~/qroq/sections';

import {useSanityRoot} from './useSanityRoot';

export type CmsSectionSettings = InferType<typeof SECTION_SETTINGS_FRAGMENT>;
export type FooterSettings = InferType<typeof FOOTER_SETTINGS_FRAGMENT>;
type HeaderQuery = InferType<typeof HEADER_QUERY>;
type CartColorScheme = {
  colorScheme?: InferType<typeof SETTINGS_FRAGMENT.cartColorScheme>;
};
type Rgb = {b: number; g: number; r: number} | undefined;

export function useColorsCssVars(props: {
  selector?: string;
  settings?:
    | CartColorScheme
    | CmsSectionSettings
    | FooterSettings
    | HeaderQuery;
}) {
  const {settings} = props;
  const {data} = useSanityRoot();
  const defaultColorScheme = data?.defaultColorScheme;
  const fallbackScheme = useFallbackColorScheme();
  const selector = props.selector || ':root';

  // Color scheme
  const colorScheme =
    settings?.colorScheme || defaultColorScheme || fallbackScheme;

  // Padding
  const paddingTop =
    settings && 'padding' in settings && settings.padding
      ? `${settings.padding.top}px`
      : '0px';
  const paddingBottom =
    settings && 'padding' in settings && settings.padding
      ? `${settings.padding.bottom}px`
      : '0px';

  return `
    ${selector} {
      --accent: ${getMutedColor(colorScheme.primary?.rgb, colorScheme.background?.rgb, 0.85)};
      --accent-foreground: ${toRgbString(colorScheme.primary?.rgb)};
      --background: ${toRgbString(colorScheme.background?.rgb)};
      --border: ${toRgbString(colorScheme.border?.rgb)};
      --card: ${toRgbString(colorScheme.card?.rgb)};
      --card-foreground: ${toRgbString(colorScheme.cardForeground?.rgb)};
      --foreground: ${toRgbString(colorScheme.foreground?.rgb)};
      --input: ${toRgbString(colorScheme.border?.rgb)};
      --muted: ${getMutedColor(colorScheme.foreground?.rgb, colorScheme.background?.rgb, 0.95)};
      --muted-foreground:  ${getMutedColor(colorScheme.foreground?.rgb, colorScheme.background?.rgb, 0.3)};
      --popover: ${toRgbString(colorScheme.background?.rgb)};
      --popover-foreground: ${toRgbString(colorScheme.foreground?.rgb)};
      --primary: ${toRgbString(colorScheme.primary?.rgb)};
      --primary-foreground: ${toRgbString(colorScheme.primaryForeground?.rgb)};
      --ring: ${getMutedColor(colorScheme.primary?.rgb, colorScheme.background?.rgb, 0.2)};
      --secondary: ${getMutedColor(colorScheme.primary?.rgb, colorScheme.background?.rgb, 0.85)};
      --secondary-foreground: ${toRgbString(colorScheme.primary?.rgb)};
      --paddingBottom: ${paddingBottom};
      --paddingTop: ${paddingTop};
      --destructive: 220 38 38;
      --destructive-foreground: 250 250 250;
      --shadow: ${getDarkenColor(colorScheme.background?.rgb)};
    }
  ` as const;
}

export function useCardColorsCssVars(props: {
  selector: string;
  settings?: CartColorScheme | CmsSectionSettings;
}) {
  const {settings} = props;
  const {data} = useSanityRoot();
  const defaultColorScheme = data?.defaultColorScheme;
  const fallbackScheme = useFallbackColorScheme();
  // Color scheme
  const colorScheme =
    settings?.colorScheme || defaultColorScheme || fallbackScheme;
  let primary = colorScheme.primary;
  let primaryForeground = colorScheme.primaryForeground;
  // Invert primary colors if primary is equal to card color
  if (
    toRgbString(colorScheme.primary?.rgb) === toRgbString(colorScheme.card?.rgb)
  ) {
    primary = colorScheme.cardForeground;
    primaryForeground = colorScheme.card;
  }

  return `
    ${props.selector} {
      --accent: ${getMutedColor(primary?.rgb, colorScheme.card?.rgb, 0.85)};
      --accent-foreground: ${toRgbString(primary?.rgb)};
      --background: ${toRgbString(colorScheme.card?.rgb)};
      --border: ${getMutedColor(colorScheme.border?.rgb, colorScheme.card?.rgb, 0.45)};
      --card: ${toRgbString(colorScheme.card?.rgb)};
      --card-foreground: ${toRgbString(colorScheme.cardForeground?.rgb)};
      --foreground: ${toRgbString(colorScheme.cardForeground?.rgb)};
      --input:  ${getMutedColor(colorScheme.border?.rgb, colorScheme.card?.rgb, 0.45)};
      --muted: ${getMutedColor(colorScheme.cardForeground?.rgb, colorScheme.card?.rgb, 0.95)};
      --muted-foreground:  ${getMutedColor(colorScheme.cardForeground?.rgb, colorScheme.card?.rgb, 0.3)};
      --popover: ${toRgbString(colorScheme.card?.rgb)};
      --popover-foreground: ${toRgbString(colorScheme.cardForeground?.rgb)};
      --primary: ${toRgbString(primary?.rgb)};
      --primary-foreground: ${toRgbString(primaryForeground?.rgb)};
      --ring: ${getMutedColor(primary?.rgb, colorScheme.card?.rgb, 0.2)};
      --secondary: ${getMutedColor(primary?.rgb, colorScheme.card?.rgb, 0.85)};
      --secondary-foreground: ${toRgbString(primary?.rgb)};
      --shadow: ${getDarkenColor(colorScheme.card?.rgb)};
    }
  ` as const;
}

function toRgbString(rgb?: {b: number; g: number; r: number}) {
  if (!rgb) return 'null';

  return `${rgb.r} ${rgb.g} ${rgb.b}` as const;
}

function getMutedColor(color: Rgb, background: Rgb, weight: number) {
  if (!color || !background) return 'null';

  const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const bgString = `rgb(${background.r}, ${background.g}, ${background.b})`;
  const isDark = readableColor(colorString) === '#fff';

  if (isDark) {
    weight = weight - 0.05;
  }

  const mixedColor = mix(colorString, bgString, weight);

  return mixedColor
    .replace('rgba(', '')
    .replace(', 1)', '')
    .replaceAll(',', '');
}

function getDarkenColor(color: Rgb) {
  if (!color) return 'null';

  const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const darkenColor = toRgba(darken(colorString, 1));

  return darkenColor
    .replace('rgba(', '')
    .replace(', 1)', '')
    .replaceAll(',', '');
}

/* eslint perfectionist/sort-objects: 0 */
export const useFallbackColorScheme = () => ({
  background: {
    hex: '#FBFDFC',
    rgb: {
      r: 251,
      g: 253,
      b: 252,
    },
  },
  foreground: {
    hex: '#1A211EC',
    rgb: {
      r: 26,
      g: 33,
      b: 30,
    },
  },
  border: {
    hex: '#D7DAD9',
    rgb: {
      r: 215,
      g: 218,
      b: 217,
    },
  },
  card: {
    hex: '#FBFDFC',
    rgb: {
      r: 251,
      g: 253,
      b: 252,
    },
  },
  cardForeground: {
    hex: '#1A211EC',
    rgb: {
      r: 26,
      g: 33,
      b: 30,
    },
  },
  primary: {
    hex: '#1A211EC',
    rgb: {
      r: 26,
      g: 33,
      b: 30,
    },
  },
  primaryForeground: {
    hex: '#FBFDFC',
    rgb: {
      r: 251,
      g: 253,
      b: 252,
    },
  },
});

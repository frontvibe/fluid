import type {InferType} from 'groqd';
import type {CSSProperties} from 'react';

import type {HEADER_QUERY, SETTINGS_QUERY} from '~/qroq/queries';
import type {SECTION_SETTINGS_FRAGMENT} from '~/qroq/sections';

import {useSanityRoot} from './useSanityRoot';

type CmsSectionSettings = InferType<typeof SECTION_SETTINGS_FRAGMENT>;
type HeaderQuery = InferType<typeof HEADER_QUERY>;
type SettingsQuery = InferType<typeof SETTINGS_QUERY>;

const fallbackScheme = {
  background: {
    hex: '#ffffff',
    rgb: {
      b: 255,
      g: 255,
      r: 255,
    },
  },
  outlineButton: {
    hex: '#000000',
    rgb: {
      b: 0,
      g: 0,
      r: 0,
    },
  },
  primaryButtonBackground: {
    hex: '#000000',
    rgb: {
      b: 0,
      g: 0,
      r: 0,
    },
  },
  primaryButtonLabel: {
    hex: '#ffffff',
    rgb: {
      b: 255,
      g: 255,
      r: 255,
    },
  },
  text: {
    hex: '#000000',
    rgb: {
      b: 0,
      g: 0,
      r: 0,
    },
  },
};

export function useSettingsCssVars(props: {
  settings?: CmsSectionSettings | HeaderQuery;
}): CSSProperties & {
  '--backgroundColor'?: string;
  '--outlineButton'?: string;
  '--paddingBottom'?: string;
  '--paddingTop'?: string;
  '--primaryButtonBackground'?: string;
  '--primaryButtonLabel'?: string;
  '--textColor'?: string;
} {
  const {settings} = props;
  const sanityRoot = useSanityRoot();
  const defaultColorScheme = sanityRoot?.data?.defaultColorScheme;

  // Color scheme
  const colorScheme =
    settings?.colorScheme || defaultColorScheme || fallbackScheme;
  const scheme = {
    background: toRgb(colorScheme?.background?.rgb),
    outlineButton: toRgb(colorScheme?.outlineButton?.rgb),
    primaryButtonBackground: toRgb(colorScheme?.primaryButtonBackground?.rgb),
    primaryButtonText: toRgb(colorScheme?.primaryButtonLabel?.rgb),
    text: toRgb(colorScheme?.text?.rgb),
  };

  // Padding
  const paddingTop =
    settings && 'padding' in settings && settings.padding
      ? `${settings.padding.top}px`
      : '0px';
  const paddingBottom =
    settings && 'padding' in settings && settings.padding
      ? `${settings.padding.bottom}px`
      : '0px';

  return {
    '--backgroundColor': scheme.background,
    '--outlineButton': scheme.outlineButton,
    '--paddingBottom': paddingBottom,
    '--paddingTop': paddingTop,
    '--primaryButtonBackground': scheme.primaryButtonBackground,
    '--primaryButtonLabel': scheme.primaryButtonText,
    '--textColor': scheme.text,
  };
}

function toRgb(rgb?: {b: number; g: number; r: number}) {
  if (!rgb) return 'null';

  return `${rgb.r} ${rgb.g} ${rgb.b}` as const;
}

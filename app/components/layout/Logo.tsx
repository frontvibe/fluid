import type {InferType} from 'groqd';

import type {SETTINGS_FRAGMENT} from '~/qroq/fragments';

import {useSanityRoot} from '~/hooks/useSanityRoot';

import {SanityImage} from '../sanity/SanityImage';

type Logo = InferType<typeof SETTINGS_FRAGMENT.logo>;

export function Logo(props: {
  className?: string;
  loading?: 'eager' | 'lazy';
  sanityEncodeData?: string;
  sizes?: null | string;
  style?: React.CSSProperties;
}) {
  const {data, encodeDataAttribute} = useSanityRoot();
  const sanitySettings = data?.settings;
  const logo = sanitySettings?.logo;
  const siteName = sanitySettings?.siteName;

  const encodeData = data?.settings?.logo?._ref
    ? encodeDataAttribute([
        // Path to the logo image in Sanity Studio
        'settings',
        'logo',
        '_ref',
        data?.settings?.logo?._ref,
      ])
    : undefined;

  return logo ? (
    <SanityImage
      data={{
        ...logo,
        altText: siteName || '',
      }}
      sanityEncodeData={encodeData}
      {...props}
    />
  ) : (
    <div className="font-heading flex h-11 items-center justify-center text-2xl notouch:group-hover:text-accent-foreground">
      {siteName}
    </div>
  );
}

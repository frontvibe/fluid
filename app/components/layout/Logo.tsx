import type {InferType} from 'groqd';

import type {SETTINGS_FRAGMENT} from '~/qroq/fragments';

import {useRootLoaderData} from '~/root';

import {SanityImage} from '../sanity/SanityImage';

type Logo = InferType<typeof SETTINGS_FRAGMENT.logo>;

export function Logo(props: {
  className?: string;
  loading?: 'eager' | 'lazy';
  sanityEncodeData?: string;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  const {sanityRoot} = useRootLoaderData();
  const data = sanityRoot?.data;
  const sanitySettings = data?.settings;
  const logo = sanitySettings?.logo;
  const siteName = sanitySettings?.siteName;

  if (!logo?._ref) {
    return (
      <div className="flex h-11 items-center justify-center font-heading text-2xl notouch:group-hover:text-accent-foreground">
        {siteName}
      </div>
    );
  }

  return (
    <SanityImage
      data={{
        ...logo,
        alt: siteName || '',
      }}
      {...props}
    />
  );
}

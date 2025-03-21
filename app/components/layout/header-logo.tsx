import {useRootLoaderData} from '~/root';

import {SanityImage} from '../sanity/sanity-image';

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
      <div className="font-heading notouch:group-hover:text-accent-foreground flex h-11 items-center justify-center text-2xl">
        {siteName}
      </div>
    );
  }

  return (
    <SanityImage
      data={{
        ...logo,
        altText: siteName || '',
      }}
      {...props}
    />
  );
}

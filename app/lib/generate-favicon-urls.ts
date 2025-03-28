import {RootLoader} from '~/root';
import faviconAsset from '~/assets/favicon.ico?url';
import {generateSanityImageUrl} from './utils';

export function generateFaviconUrls({
  sanityRoot,
  env,
}: {
  env: NonNullable<Awaited<ReturnType<RootLoader>>>['env'];
  sanityRoot: NonNullable<Awaited<ReturnType<RootLoader>>>['sanityRoot'];
}) {
  const favicon = sanityRoot.data?.settings?.favicon;

  if (!favicon) {
    return [
      {
        href: faviconAsset,
        rel: 'icon',
        tagName: 'link',
        type: 'image/x-icon',
      },
    ];
  }

  const faviconUrl = generateSanityImageUrl({
    dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
    height: 32,
    projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 32,
  });

  const appleTouchIconUrl = generateSanityImageUrl({
    dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
    height: 180,
    projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 180,
  });

  return [
    {
      href: faviconUrl,
      rel: 'icon',
      tagName: 'link',
      type: 'image/x-icon',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon',
      tagName: 'link',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon-precomposed',
      tagName: 'link',
    },
  ];
}

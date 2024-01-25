import {useRootLoaderData} from './useRootLoaderData';

export function useSanityPreviewMode() {
  const data = useRootLoaderData();
  const previewMode = data?.sanityPreviewMode;

  return previewMode;
}

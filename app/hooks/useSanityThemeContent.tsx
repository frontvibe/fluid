import {useRootLoaderData} from '~/root';

export function useSanityThemeContent() {
  const {
    sanityRoot: {data},
  } = useRootLoaderData();
  const themeContent = data?.themeContent;
  return {themeContent};
}

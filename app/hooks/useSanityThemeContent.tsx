import {useSanityRoot} from './useSanityRoot';

export function useSanityThemeContent() {
  const {data, encodeDataAttribute, loading} = useSanityRoot();
  const themeContent = data?.themeContent;

  return {encodeDataAttribute, loading, themeContent};
}

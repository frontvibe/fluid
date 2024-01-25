import {useRootLoaderData} from './useRootLoaderData';
import {useSanityData} from './useSanityData';

export function useSanityRoot() {
  const rootLoaderdata = useRootLoaderData();
  const sanityGlobal = rootLoaderdata?.sanityRoot!;
  const {data, encodeDataAttribute, loading, sourceMap} =
    useSanityData(sanityGlobal);

  return {data, encodeDataAttribute, loading, sourceMap};
}

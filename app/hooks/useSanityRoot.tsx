import {useRootLoaderData} from '~/root';

import {useSanityData} from './useSanityData';

export function useSanityRoot() {
  const {sanityRoot} = useRootLoaderData();

  const {data, encodeDataAttribute, loading, sourceMap} = useSanityData({
    initial: sanityRoot,
    isRoot: true,
  });

  return {data, encodeDataAttribute, loading, sourceMap};
}

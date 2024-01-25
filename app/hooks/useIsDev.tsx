import {useRootLoaderData} from './useRootLoaderData';

export function useIsDev() {
  const data = useRootLoaderData();

  return data?.env.NODE_ENV === 'development';
}

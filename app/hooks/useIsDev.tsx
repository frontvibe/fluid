import {useRootLoaderData} from '~/root';

export function useIsDev() {
  const data = useRootLoaderData();

  return data.env.NODE_ENV === 'development';
}

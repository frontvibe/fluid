import {useRootLoaderData} from './useRootLoaderData';

export function useLocale() {
  const data = useRootLoaderData();
  const locale = data?.locale;

  return locale;
}

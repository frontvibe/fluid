import {useRootLoaderData} from './useRootLoaderData';

export function useEnvironmentVariables() {
  const data = useRootLoaderData();
  const env = data?.env;

  return env;
}

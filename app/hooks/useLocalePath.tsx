import {useRootLoaderData} from '~/root';

export function useLocalePath(props: {path: string}) {
  const {locale} = useRootLoaderData();
  const {path} = props;
  const pathPrefix = locale.pathPrefix;

  if (pathPrefix) {
    return `${pathPrefix}${path}`;
  }

  return path;
}

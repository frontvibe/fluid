import {useLocale} from './useLocale';

export function useLocalePath(props: {path: string}) {
  const locale = useLocale();
  const {path} = props;
  const pathPrefix = locale?.pathPrefix;

  if (pathPrefix) {
    return `${pathPrefix}${path}`;
  }

  return path;
}

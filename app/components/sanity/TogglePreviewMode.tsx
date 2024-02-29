import {useFetcher, useLocation} from '@remix-run/react';
import {useCallback, useEffect} from 'react';

/*
|--------------------------------------------------------------------------
| Toggle Sanity Preview Mode
|--------------------------------------------------------------------------
| This component is used to toggle the Sanity preview mode.
| A keyboard shortcut [cmd + ctrl + p] will toggle the preview mode.
| The SANITY_STUDIO_USE_PREVIEW_MODE environment variable must be set to true.
|
*/
export function TogglePreviewMode() {
  const fetcher = useFetcher<{success?: boolean}>();
  const {pathname} = useLocation();

  const handleTogglePreviewMode = useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey && event.ctrlKey && event.key === 'p') {
        fetcher.load(`/sanity/preview?slug=${pathname}`);
      }
    },
    [fetcher, pathname],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleTogglePreviewMode);

    return () =>
      document.removeEventListener('keydown', handleTogglePreviewMode);
  }, [handleTogglePreviewMode]);

  return null;
}

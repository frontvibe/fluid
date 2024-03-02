import {
  useFetcher,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {VisualEditing as SanityVisualEditing} from '@sanity/visual-editing/remix';
import {cx} from 'class-variance-authority';
import {useCallback, useEffect} from 'react';

import {useIsInIframe} from '~/hooks/useIsInIframe';
import {useSanityClient} from '~/hooks/useSanityClient';
import {useLiveMode} from '~/lib/sanity/sanity.loader';
import {useRootLoaderData} from '~/root';

export function VisualEditing() {
  const isInIframe = useIsInIframe();
  const client = useSanityClient();
  // Enable live queries
  useLiveMode({client});

  return !isInIframe ? (
    <>
      <SanityVisualEditing />
      <ExitBanner />
    </>
  ) : (
    <SanityVisualEditing />
  );
}

function ExitBanner() {
  const fetcher = useFetcher({key: 'exit-sanity-preview'});
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const reload = searchParams.get('reload') === 'true';
  const {env} = useRootLoaderData();
  const isDev = env.NODE_ENV === 'development';

  // Reload page to reset sanity loaders and enable preview mode
  const handleReloadPage = useCallback(() => {
    searchParams.delete('reload');
    setSearchParams(searchParams);
    if (isDev) {
      setTimeout(() => {
        navigate(0);
      }, 1000);
    }
  }, [navigate, searchParams, isDev, setSearchParams]);

  useEffect(() => {
    if (!reload) return;
    handleReloadPage();
  }, [reload, handleReloadPage]);

  return (
    <section className="bg-[--background] text-[--foreground] [--background:#16120C] [--foreground:#FFE7B3]">
      <div className="container py-6">
        <fetcher.Form action="/sanity/preview" method="POST">
          <input name="slug" type="hidden" value={location.pathname} />
          <div className="flex items-center justify-center gap-6">
            <small>Sanity Preview mode activated</small>
            <button
              className={cx(
                'flex h-[2.5rem] shrink-0 items-center justify-center rounded-full border border-[--foreground] p-4 text-sm font-bold duration-200 ease-out',
                'hover:bg-[--foreground] hover:text-[--background]',
                'disabled:bg-opacity-100 disabled:opacity-20',
              )}
              disabled={fetcher.state === 'submitting'}
              type="submit"
            >
              Exit Preview Mode
            </button>
          </div>
        </fetcher.Form>
      </div>
    </section>
  );
}

import {useNavigate} from '@remix-run/react';

import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';

import {Button} from './ui/button';

/**
 * Skeleton wrapper to conditionnaly render an error message and a button to reload the page.
 */
export function Skeleton(props: {children: React.ReactNode; isError?: true}) {
  const {themeContent} = useSanityThemeContent();
  const navigate = useNavigate();
  return (
    <>
      {props.children}
      {props.isError && (
        <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm">
          <div className="flex size-full items-center justify-center">
            <div className="bg-background text-foreground mx-auto flex h-auto w-72 max-w-full flex-col justify-center rounded-lg p-7 text-center">
              {themeContent?.error?.sectionError}
              <Button className="mt-4" onClick={() => navigate(0)}>
                {themeContent?.error?.reloadPage}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import {useNavigate} from '@remix-run/react';

import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';

import {Button} from './ui/Button';

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
        <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur">
          <div className="flex size-full items-center justify-center">
            <div className="mx-auto flex h-auto w-72 max-w-full flex-col justify-center rounded-lg bg-background p-7 text-center text-foreground">
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

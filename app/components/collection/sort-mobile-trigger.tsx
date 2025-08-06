import * as React from 'react';

import {IconButton} from '../ui/button';
import {IconFilters} from '../icons/icon-filters';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';

export const SortMobileTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({...props}, ref) => {
  const {themeContent} = useSanityThemeContent();
  const label = themeContent?.collection?.filterAndSort;

  return (
    <IconButton
      ref={ref}
      className="w-auto flex-nowrap gap-2 px-2 lg:hidden pointer-coarse:flex"
      {...props}
    >
      <IconFilters />
      <span>{label}</span>
    </IconButton>
  );
});

SortMobileTrigger.displayName = 'SortMobileTrigger';

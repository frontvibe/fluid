import {IconButton} from '../ui/button';
import {IconFilters} from '../icons/icon-filters';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';

export function SortMobileTrigger(props: React.ComponentProps<'button'>) {
  const {themeContent} = useSanityThemeContent();
  const label = themeContent?.collection?.filterAndSort;

  return (
    <IconButton
      className="w-auto flex-nowrap gap-2 px-2 lg:hidden pointer-coarse:flex"
      {...props}
    >
      <IconFilters />
      <span>{label}</span>
    </IconButton>
  );
}

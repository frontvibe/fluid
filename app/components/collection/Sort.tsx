import type {Location} from '@remix-run/react';

import {
  Link,
  PrefetchPageLinks,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import {useCallback, useMemo, useState} from 'react';

import type {CmsSectionSettings} from '~/hooks/useSettingsCssVars';

import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';
import {cn} from '~/lib/utils';

import type {SortParam} from './SortFilterLayout';

import {IconSort} from '../icons/IconSort';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import {Label} from '../ui/Label';
import {RadioGroup, RadioGroupItem} from '../ui/RadioGroup';

function useSortItems() {
  const location = useLocation();
  const search = location.search;
  // Todo => add strings to themeContent
  const items: {key: SortParam; label: string}[] = useMemo(
    () => [
      {key: 'featured', label: 'Featured'},
      {
        key: 'price-low-high',
        label: 'Price: Low - High',
      },
      {
        key: 'price-high-low',
        label: 'Price: High - Low',
      },
      {
        key: 'best-selling',
        label: 'Best Selling',
      },
      {
        key: 'newest',
        label: 'Newest',
      },
    ],
    [],
  );

  const activeItem = items.find((item) => search.includes(`?sort=${item.key}`));
  return {activeItem, items};
}

export function SortMenu(props: {sectionSettings?: CmsSectionSettings}) {
  const {activeItem, items} = useSortItems();
  const location = useLocation();
  const [params] = useSearchParams();
  const cssVars = useSettingsCssVars({settings: props.sectionSettings});

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
        <IconSort strokeWidth={1} />
        <span>
          <span className="px-2 font-medium">
            {/*
              // Todo => add strings to themeContent 
            */}
            Sort by:
          </span>
          <span>{(activeItem || items[0]).label}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent asChild>
        <nav>
          <style dangerouslySetInnerHTML={{__html: cssVars}} />
          {items.map((item) => (
            <DropdownMenuItem asChild key={item.label}>
              <Link
                className={`block cursor-pointer px-3 pb-2 text-sm ${
                  activeItem?.key === item.key ? 'font-bold' : 'font-normal'
                }`}
                preventScrollReset
                replace
                to={getSortLink(item.key, params, location)}
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SortRadioGroup() {
  const {activeItem, items} = useSortItems();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const handleToggleSort = useCallback(
    (value: string) => {
      navigate(getSortLink(value as SortParam, params, location), {
        preventScrollReset: true,
        replace: true,
      });
    },
    [navigate, params, location],
  );

  return (
    <div>
      <div className="flex items-center gap-3">
        <IconSort strokeWidth={1} />
        <span>
          <span className="px-2 text-xl font-medium">
            {/*
              // Todo => add strings to themeContent 
            */}
            Sort by:
          </span>
        </span>
      </div>
      <RadioGroup
        className={cn(['mt-3 flex flex-col gap-0'])}
        defaultValue={activeItem?.key || items[0].key}
        onValueChange={handleToggleSort}
      >
        {items.map((item) => (
          <SortRadioItem item={item} key={item.key} />
        ))}
      </RadioGroup>
    </div>
  );
}

function SortRadioItem(props: {
  item: {
    key: SortParam;
    label: string;
  };
}) {
  const {item} = props;
  const [prefetchPage, setPrefetchPage] = useState<null | string>(null);
  const location = useLocation();
  const [params] = useSearchParams();

  // Prefetch the page that will be navigated to when the user hovers or touches
  const handleSetPrefetch = useCallback(() => {
    const sortLink = getSortLink(item.key, params, location);
    setPrefetchPage(sortLink);
  }, [item.key, params, location]);

  return (
    <div
      className="flex items-center gap-x-3 py-3"
      key={item.key}
      onMouseEnter={handleSetPrefetch}
      onTouchStart={handleSetPrefetch}
    >
      <RadioGroupItem id={item.key} value={item.key} />
      <Label className="w-full font-medium" htmlFor={item.key}>
        {item.label}
      </Label>
      {prefetchPage && <PrefetchPageLinks page={prefetchPage} />}
    </div>
  );
}

function getSortLink(
  sort: SortParam,
  params: URLSearchParams,
  location: Location,
) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

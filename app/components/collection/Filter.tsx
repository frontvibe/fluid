import type {Location} from '@remix-run/react';
import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import type {SyntheticEvent} from 'react';

import {
  PrefetchPageLinks,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import useDebounce from 'react-use/lib/useDebounce';

import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import type {AppliedFilter} from './SortFilterLayout';

import {Checkbox} from '../ui/Checkbox';
import {Input} from '../ui/Input';
import {Label} from '../ui/Label';
import {FILTER_URL_PREFIX} from './SortFilterLayout';

export function DefaultFilter(props: {
  appliedFilters: AppliedFilter[];
  option: Filter['values'][0];
}) {
  const {appliedFilters, option} = props;
  const [params] = useSearchParams();
  const [prefetchPage, setPrefetchPage] = useState<null | string>(null);
  const location = useLocation();
  const addFilterLink = getFilterLink(option.input as string, params, location);
  const appliedFilter = getAppliedFilter(option, appliedFilters);

  const removeFilterLink = useMemo(() => {
    if (!appliedFilter) {
      return location.pathname;
    }
    return getAppliedFilterLink(appliedFilter, params, location);
  }, [appliedFilter, params, location]);

  // Prefetch the page that will be navigated to when the user hovers or touches the filter
  const handleSetPrefetch = useCallback(() => {
    if (appliedFilter) {
      setPrefetchPage(removeFilterLink);
      return;
    }

    setPrefetchPage(addFilterLink);
  }, [removeFilterLink, addFilterLink, appliedFilter]);

  return (
    <div onMouseEnter={handleSetPrefetch} onTouchStart={handleSetPrefetch}>
      <FilterCheckbox
        addFilterLink={addFilterLink}
        filterIsApplied={Boolean(appliedFilter)}
        option={option}
        removeFilterLink={removeFilterLink}
      />
      {prefetchPage && <PrefetchPageLinks page={prefetchPage} />}
    </div>
  );
}

function FilterCheckbox({
  addFilterLink,
  filterIsApplied,
  option,
  removeFilterLink,
}: {
  addFilterLink: string;
  filterIsApplied: boolean;
  option: Filter['values'][0];
  removeFilterLink: string;
}) {
  const navigate = useNavigate();
  const optionId = option.id;
  const {optimisticData, pending} = useOptimisticNavigationData<{
    isFilterChecked: boolean;
  }>(optionId);
  const {optimisticData: clearFilters} =
    useOptimisticNavigationData<boolean>('clear-all-filters');
  const {themeContent} = useSanityThemeContent();

  let optionLabel = option.label;

  if (
    option.id === 'filter.v.availability.1' &&
    themeContent?.collection?.filterInStock
  ) {
    optionLabel = themeContent?.collection?.filterInStock;
  } else if (
    option.id === 'filter.v.availability.0' &&
    themeContent?.collection?.filterOutOfStock
  ) {
    optionLabel = themeContent?.collection?.filterOutOfStock;
  }

  // Use optimistic checked state while the navigation is pending
  if (optimisticData) {
    filterIsApplied = optimisticData.isFilterChecked;
  }
  // Here we can optimistically clear all filters
  else if (clearFilters) {
    filterIsApplied = false;
  }

  const handleToggleFilter = useCallback(() => {
    const navigateTo = filterIsApplied ? removeFilterLink : addFilterLink;
    const optimisticChecked = !filterIsApplied;

    navigate(navigateTo, {
      preventScrollReset: true,
      replace: true,
      state: {
        optimisticData: {
          isFilterChecked: optimisticChecked,
        },
        optimisticId: optionId,
      },
    });
  }, [filterIsApplied, removeFilterLink, addFilterLink, navigate, optionId]);

  return (
    <div
      className={cn([
        'flex items-center gap-2',
        // If the navigation is pending, animate after a delay
        // to avoid flickering when navigation is fast
        pending && 'pointer-events-none animate-pulse delay-500',
      ])}
    >
      <Checkbox
        aria-label={optionLabel}
        checked={filterIsApplied}
        id={optionId}
        onCheckedChange={handleToggleFilter}
      />
      <Label
        className={cn([
          'w-full cursor-pointer lg:transition-opacity lg:hover:opacity-70',
        ])}
        htmlFor={optionId}
      >
        {optionLabel}
      </Label>
    </div>
  );
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

export function PriceRangeFilter({
  appliedFilters,
}: {
  appliedFilters: AppliedFilter[];
}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
  const price = priceFilter
    ? (JSON.parse(priceFilter) as ProductFilter['price'])
    : undefined;
  const min = isNaN(Number(price?.min)) ? undefined : Number(price?.min);
  const max = isNaN(Number(price?.max)) ? undefined : Number(price?.max);
  const navigate = useNavigate();
  const {optimisticData} =
    useOptimisticNavigationData<boolean>('clear-all-filters');
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const {themeContent} = useSanityThemeContent();

  useEffect(() => {
    // Reset prices when the user clears all filters
    if (optimisticData) {
      setMinPrice(undefined);
      setMaxPrice(undefined);
    }
  }, [optimisticData]);

  useDebounce(
    () => {
      if (minPrice === undefined && maxPrice === undefined) {
        params.delete(`${FILTER_URL_PREFIX}price`);
        navigate(`${location.pathname}?${params.toString()}`, {
          preventScrollReset: true,
          replace: true,
        });
        return;
      }

      const price = {
        ...(minPrice === undefined ? {} : {min: minPrice}),
        ...(maxPrice === undefined ? {} : {max: maxPrice}),
      };
      const newParams = filterInputToParams({price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`, {
        preventScrollReset: true,
        replace: true,
      });
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMaxPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMinPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="px-2">
        <span>{themeContent?.collection?.from}</span>
        <Input
          className="mt-1"
          min={0}
          name="minPrice"
          onChange={onChangeMin}
          placeholder={'$'}
          type="number"
          value={minPrice ?? ''}
        />
      </label>
      <label className="px-2">
        <span>{themeContent?.collection?.to}</span>
        <Input
          className="mt-1"
          min={0}
          name="maxPrice"
          onChange={onChangeMax}
          placeholder={'$'}
          type="number"
          value={maxPrice ?? ''}
        />
      </label>
    </div>
  );
}

function getAppliedFilter(
  option: Filter['values'][0],
  appliedFilters: AppliedFilter[],
) {
  return appliedFilters.find((appliedFilter) => {
    return JSON.stringify(appliedFilter.filter) === option.input;
  });
}

function getAppliedFilterLink(
  filter: AppliedFilter,
  params: URLSearchParams,
  location: Location,
) {
  const paramsClone = new URLSearchParams(params);
  Object.entries(filter.filter).forEach(([key, value]) => {
    const fullKey = FILTER_URL_PREFIX + key;
    paramsClone.delete(fullKey, JSON.stringify(value));
  });
  return `${location.pathname}?${paramsClone.toString()}`;
}

function getFilterLink(
  rawInput: ProductFilter | string,
  params: URLSearchParams,
  location: ReturnType<typeof useLocation>,
) {
  const paramsClone = new URLSearchParams(params);
  const newParams = filterInputToParams(rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

function filterInputToParams(
  rawInput: ProductFilter | string,
  params: URLSearchParams,
) {
  const input =
    typeof rawInput === 'string'
      ? (JSON.parse(rawInput) as ProductFilter)
      : rawInput;

  Object.entries(input).forEach(([key, value]) => {
    if (params.has(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value))) {
      return;
    }
    if (key === 'price') {
      // For price, we want to overwrite
      params.set(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    } else {
      params.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    }
  });

  return params;
}

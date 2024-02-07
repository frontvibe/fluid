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
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import {useCallback, useMemo, useState} from 'react';
import useDebounce from 'react-use/lib/useDebounce';

import {cn} from '~/lib/utils';

import {Checkbox} from '../ui/Checkbox';
import {Input} from '../ui/Input';
import {Label} from '../ui/Label';
import {type AppliedFilter, FILTER_URL_PREFIX} from './SortFilterLayout';

export function DefaultFilter(props: {
  appliedFilters: AppliedFilter[];
  option: Filter['values'][0];
}) {
  const {appliedFilters, option} = props;
  const [params] = useSearchParams();
  const [prefetchPage, setPrefetchPage] = useState<null | string>(null);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();
  const addFilterLink = getFilterLink(option.input as string, params, location);
  const appliedFilter = getAppliedFilter(option, appliedFilters);
  const isNavigationPending = navigation.state !== 'idle';

  const getRemoveFilterLink = useCallback(() => {
    if (!appliedFilter) {
      return null;
    }
    return getAppliedFilterLink(appliedFilter, params, location);
  }, [appliedFilter, params, location]);

  const handleToggleFilter = useCallback(() => {
    if (appliedFilter) {
      const removeFilterLink = getRemoveFilterLink();
      if (removeFilterLink) {
        navigate(removeFilterLink, {
          preventScrollReset: true,
          replace: true,
        });
      }
      return;
    }

    navigate(addFilterLink, {
      preventScrollReset: true,
      replace: true,
    });
  }, [addFilterLink, appliedFilter, navigate, getRemoveFilterLink]);

  // Prefetch the page that will be navigated to when the user hovers or touches the filter
  const handleSetPrefetch = useCallback(() => {
    const removeFilterLink = getRemoveFilterLink();
    if (appliedFilter) {
      setPrefetchPage(removeFilterLink);
      return;
    }

    setPrefetchPage(addFilterLink);
  }, [getRemoveFilterLink, addFilterLink, appliedFilter]);

  return (
    <div
      className={cn([
        'flex items-center gap-2',
        isNavigationPending && 'lg:animate-pulse',
      ])}
      onMouseEnter={handleSetPrefetch}
      onTouchStart={handleSetPrefetch}
    >
      <Checkbox
        checked={Boolean(appliedFilter)}
        id={option.id}
        onCheckedChange={handleToggleFilter}
      />
      <Label
        className="w-full cursor-pointer lg:transition-opacity lg:hover:opacity-70"
        htmlFor={option.id}
      >
        {option.label}
      </Label>
      {prefetchPage && <PrefetchPageLinks page={prefetchPage} />}
    </div>
  );
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

export function PriceRangeFilter() {
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

  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);

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
        <span>from</span>
        <Input
          className="mt-1"
          name="minPrice"
          onChange={onChangeMin}
          placeholder={'$'}
          type="number"
          value={minPrice ?? ''}
        />
      </label>
      <label className="px-2">
        <span>to</span>
        <Input
          className="mt-1"
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

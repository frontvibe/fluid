import type {
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

import type {ShopifyCollection} from '~/components/sections/CollectionProductGridSection';

import {
  FILTER_URL_PREFIX,
  type SortParam,
} from '~/components/collection/SortFilterLayout';

import type {I18nLocale} from './type';

import {parseAsCurrency} from './utils';

export function getFiltersFromParam(searchParams: URLSearchParams) {
  const {reverse, sortKey} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );

  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  return {
    filters,
    reverse,
    sortKey,
  };
}

export function getAppliedFilters({
  collection,
  locale,
  searchParams,
}: {
  collection?: ShopifyCollection;
  locale?: I18nLocale;
  searchParams: URLSearchParams;
}) {
  if (!locale || !collection) {
    return [];
  }

  const {filters} = getFiltersFromParam(searchParams);

  const allFilterValues = collection?.products.filters.flatMap(
    (filter) => filter.values,
  );

  return filters
    .map((filter) => {
      const foundValue = allFilterValues?.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);
}

export function getSortValuesFromParam(sortParam: SortParam | null): {
  reverse: boolean;
  sortKey: ProductCollectionSortKeys;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        reverse: true,
        sortKey: 'PRICE',
      };
    case 'price-low-high':
      return {
        reverse: false,
        sortKey: 'PRICE',
      };
    case 'best-selling':
      return {
        reverse: false,
        sortKey: 'BEST_SELLING',
      };
    case 'newest':
      return {
        reverse: true,
        sortKey: 'CREATED',
      };
    case 'featured':
      return {
        reverse: false,
        sortKey: 'MANUAL',
      };
    default:
      return {
        reverse: false,
        sortKey: 'RELEVANCE',
      };
  }
}

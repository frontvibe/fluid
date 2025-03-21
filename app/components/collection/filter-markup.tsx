import type {Filter} from '@shopify/hydrogen/storefront-api-types';

import type {AppliedFilter} from './sort-filter-layout';

import {DefaultFilter, PriceRangeFilter} from './collection-filter';

export function FilterMarkup({
  appliedFilters,
  filter,
  option,
}: {
  appliedFilters: AppliedFilter[];
  filter: Filter;
  option: Filter['values'][0];
}) {
  switch (filter.type) {
    case 'PRICE_RANGE':
      return <PriceRangeFilter appliedFilters={appliedFilters} />;

    default:
      return <DefaultFilter appliedFilters={appliedFilters} option={option} />;
  }
}

import type {Filter} from '@shopify/hydrogen/storefront-api-types';

import type {AppliedFilter} from './SortFilterLayout';

import {DefaultFilter, PriceRangeFilter} from './Filter';

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

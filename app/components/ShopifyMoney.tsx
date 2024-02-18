import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {PartialObjectDeep} from 'type-fest/source/partial-deep';

import {vercelStegaCleanAll} from '@sanity/client/stega';
import {Money} from '@shopify/hydrogen';

import {useLocale} from '~/hooks/useLocale';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {cn} from '~/lib/utils';

export function ShopifyMoney({
  className,
  data,
}: {
  className?: string;
  data: PartialObjectDeep<
    MoneyV2,
    {
      recurseIntoArrays: true;
    }
  >;
}) {
  const sanityRoot = useSanityRoot();
  const locale = useLocale();
  const countryCode = locale?.country;
  const showCurrencyCodes = sanityRoot.data?.settings?.showCurrencyCodes;
  const showTrailingZeros = sanityRoot.data?.settings?.showTrailingZeros?.find(
    (c) => vercelStegaCleanAll(c) === countryCode,
  );

  return (
    <Money
      className={cn('tabular-nums', className)}
      data={data}
      withoutCurrency={!showCurrencyCodes}
      withoutTrailingZeros={!showTrailingZeros}
    />
  );
}

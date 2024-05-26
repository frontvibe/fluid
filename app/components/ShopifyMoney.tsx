import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {PartialObjectDeep} from 'type-fest/source/partial-deep';

import {stegaClean} from '@sanity/client/stega';
import {Money} from '@shopify/hydrogen';

import {useSanityRoot} from '~/hooks/useSanityRoot';
import {cn, setShowTrailingZeroKeyValue} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

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
  const {locale} = useRootLoaderData();
  const {data: sanityRootData} = useSanityRoot();
  const key = setShowTrailingZeroKeyValue(locale);
  const showCurrencyCodes = sanityRootData?.settings?.showCurrencyCodes;
  const showTrailingZeros = sanityRootData?.settings?.showTrailingZeros?.find(
    (k) => stegaClean(k) === key,
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

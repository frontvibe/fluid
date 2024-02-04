import type {
  ProductOption,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import type {PartialDeep} from 'type-fest';
import type {PartialObjectDeep} from 'type-fest/source/partial-deep';

import {Link} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {useMemo} from 'react';

import {useSelectedVariant} from '~/hooks/useSelectedVariant';
import {cn} from '~/lib/utils';

import {badgeVariants} from '../ui/Badge';

export type VariantOptionValue = {
  isActive: boolean;
  isAvailable: boolean;
  search: string;
  value: string;
};

export function VariantSelector(props: {
  options:
    | (
        | PartialObjectDeep<
            ProductOption,
            {
              recurseIntoArrays: true;
            }
          >
        | undefined
      )[]
    | undefined;
  variants?: Array<PartialDeep<ProductVariant>>;
}) {
  const selectedVariant = useSelectedVariant({variants: props.variants});

  const options = useMemo(
    () =>
      props.options
        ?.filter((option) => option?.values && option.values?.length > 1)
        .map((option) => {
          let activeValue;
          const optionValues: VariantOptionValue[] = [];
          const variantSelectedOptions = selectedVariant?.selectedOptions;

          for (const value of option?.values ?? []) {
            const valueIsActive =
              value ===
              variantSelectedOptions?.find(
                (selectedOption) => selectedOption.name === option?.name,
              )?.value;

            if (valueIsActive) {
              activeValue = value;
            }

            const newOptions = variantSelectedOptions?.map((selectedOption) => {
              if (selectedOption.name === option?.name) {
                return {
                  ...selectedOption,
                  value,
                };
              }

              return selectedOption;
            });

            const matchedVariant = props.variants?.find((variant) =>
              variant?.selectedOptions?.every((selectedOption) => {
                return newOptions?.find(
                  (newOption) =>
                    newOption.name === selectedOption.name &&
                    newOption.value === selectedOption.value,
                );
              }),
            );

            const matchedVariantId = parseGid(matchedVariant?.id)?.id;

            if (value) {
              optionValues.push({
                isActive: valueIsActive,
                isAvailable: matchedVariant?.availableForSale ?? true,
                search: `?variant=${matchedVariantId}`,
                value,
              });
            }
          }

          return {
            name: option?.name,
            value: activeValue,
            values: optionValues,
          };
        }),
    [props.options, selectedVariant, props.variants],
  );

  return options?.map((option) => (
    <div key={option.name}>
      <div>{option.name}</div>
      <div className="mt-1 flex gap-2">
        {option.values?.map(({isActive, isAvailable, search, value}) => (
          <Link
            className={cn([
              badgeVariants({
                variant: isActive ? 'secondary' : 'outline',
              }),
              !isAvailable && 'opacity-50',
              'px-3 py-[.35rem] hover:bg-muted',
            ])}
            key={option.name + value}
            prefetch="viewport"
            preventScrollReset
            replace
            to={search}
          >
            {value}
          </Link>
        ))}
      </div>
    </div>
  ));
}

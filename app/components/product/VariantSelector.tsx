import type {
  ProductOption,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import type {PartialDeep} from 'type-fest';

import {Link} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {useMemo} from 'react';

import {useSelectedVariant} from '~/hooks/useSelectedVariant';

import {Button} from '../ui/Button';

export type VariantOptionValue = {
  isActive: boolean;
  isAvailable: boolean;
  search: string;
  value: string;
};

export function VariantSelector(props: {
  options: Array<PartialDeep<ProductOption>> | undefined;
  variants?: Array<PartialDeep<ProductVariant>>;
}) {
  const selectedVariant = useSelectedVariant({variants: props.variants});

  const options = useMemo(
    () =>
      props.options
        ?.filter((option) => option.values && option.values?.length > 1)
        .map((option) => {
          let activeValue;
          const optionValues: VariantOptionValue[] = [];
          const variantSelectedOptions = selectedVariant?.selectedOptions;

          for (const value of option.values ?? []) {
            const valueIsActive =
              value ===
              variantSelectedOptions?.find(
                (selectedOption) => selectedOption.name === option.name,
              )?.value;

            if (valueIsActive) {
              activeValue = value;
            }

            const newOptions = variantSelectedOptions?.map((selectedOption) => {
              if (selectedOption.name === option.name) {
                return {
                  ...selectedOption,
                  value,
                };
              }

              return selectedOption;
            });

            const matchedVariant = props.variants?.find(
              (variant) =>
                variant?.selectedOptions?.every((selectedOption) => {
                  return newOptions?.find(
                    (newOption) =>
                      newOption.name === selectedOption.name &&
                      newOption.value === selectedOption.value,
                  );
                }),
            );

            const matchedVariantId = parseGid(matchedVariant?.id)?.id;

            optionValues.push({
              isActive: valueIsActive,
              isAvailable: matchedVariant?.availableForSale ?? true,
              search: `?variant=${matchedVariantId}`,
              value,
            });
          }

          return {
            name: option.name,
            value: activeValue,
            values: optionValues,
          };
        }),
    [props.options, selectedVariant, props.variants],
  );

  return options?.map((option) => (
    <div key={option.name}>
      <div>{option.name}</div>
      <div className="mt-1 flex gap-3">
        {option.values?.map(({isActive, isAvailable, search, value}) => (
          <Button
            asChild
            className={cx(!isAvailable && 'opacity-50')}
            key={option.name + value}
            size="sm"
            variant={isActive ? 'secondary' : 'secondaryOutline'}
          >
            <Link prefetch="intent" preventScrollReset replace to={search}>
              {value}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  ));
}

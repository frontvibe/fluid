import type {
  ProductOption,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import type {PartialDeep} from 'type-fest';
import type {PartialObjectDeep} from 'type-fest/source/partial-deep';

import {useNavigate} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {m} from 'framer-motion';
import {useMemo, useRef} from 'react';

import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSelectedVariant} from '~/hooks/useSelectedVariant';
import {cn} from '~/lib/utils';

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
      <Pills option={option} />
    </div>
  ));
}

function Pills(props: {
  option: {
    name: string | undefined;
    value: string | undefined;
    values: VariantOptionValue[];
  };
}) {
  const navigate = useNavigate();
  const layoutId = useRef(
    props.option.name +
      '-' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
  );
  const optimisticId = `${props.option.name}-selected-variant`;
  const {optimisticData, pending} =
    useOptimisticNavigationData<string>(optimisticId);

  let values = props.option.values;

  if (optimisticData) {
    // Replace the active value with the optimistic value
    const optimisticValues = values.map((value) => {
      if (value.value === optimisticData) {
        return {
          ...value,
          isActive: true,
        };
      }

      return {
        ...value,
        isActive: false,
      };
    }, []);

    values = optimisticValues;
  }

  const handleSelectVariant = (value: string, search: string) => {
    navigate(search, {
      preventScrollReset: true,
      replace: true,
      state: {
        optimisticData: value,
        optimisticId,
      },
    });
  };

  // Animated tabs implementation inspired by the fantastic Build UI recipes
  // (Check out the original at: https://buildui.com/recipes/animated-tabs)
  // Credit to the Build UI team for the awesome Pills animation.
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-3">
      {values.map(({isActive, isAvailable, search, value}) => (
        <m.button
          className={cn([
            'relative select-none rounded-full text-sm font-medium',
            'focus-visible:outline-none focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            !isAvailable && 'opacity-50',
          ])}
          disabled={pending}
          key={value}
          layout
          layoutRoot
          onClick={() => handleSelectVariant(value, search)}
          style={{
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {isActive && (
            <m.span
              className="absolute inset-0 z-10 bg-accent mix-blend-multiply"
              layoutId={layoutId.current}
              style={{borderRadius: 9999}}
              transition={{bounce: 0.2, duration: 0.5, type: 'spring'}}
            />
          )}
          <m.span
            className={cn([
              'notouch:hover:text-accent-foreground inline-flex h-8 items-center justify-center whitespace-nowrap px-3 py-1.5 transition-colors',
              isActive && 'text-accent-foreground',
            ])}
            tabIndex={-1}
            whileTap={{scale: 0.9}}
          >
            {value}
          </m.span>
        </m.button>
      ))}
    </div>
  );
}

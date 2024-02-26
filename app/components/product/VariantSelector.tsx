import type {ProductOption} from '@shopify/hydrogen/storefront-api-types';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import type {PartialDeep} from 'type-fest';
import type {PartialObjectDeep} from 'type-fest/source/partial-deep';

import {Link, useNavigate} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {m} from 'framer-motion';
import {useCallback, useMemo} from 'react';

import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSelectedVariant} from '~/hooks/useSelectedVariant';

import {useSection} from '../CmsSection';

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
  variants?: Array<PartialDeep<ProductVariantFragmentFragment>>;
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
      <Pills handle={selectedVariant?.product?.handle} option={option} />
    </div>
  ));
}

function Pills(props: {
  handle: string | undefined;
  option: {
    name: string | undefined;
    value: string | undefined;
    values: VariantOptionValue[];
  };
}) {
  const navigate = useNavigate();
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

  const handleSelectVariant = useCallback(
    (value: string, search: string) => {
      navigate(search, {
        preventScrollReset: true,
        replace: true,
        state: {
          optimisticData: value,
          optimisticId,
        },
      });
    },
    [navigate, optimisticId],
  );

  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-3">
      {values.map((value) => (
        <Pill
          handle={props.handle}
          key={value.value}
          onSelectVariant={handleSelectVariant}
          option={props.option}
          pending={pending}
          {...value}
        />
      ))}
    </div>
  );
}

function Pill(props: {
  handle?: string;
  isActive: boolean;
  isAvailable: boolean;
  onSelectVariant: (value: string, search: string) => void;
  option: {
    name: string | undefined;
    value: string | undefined;
    values: VariantOptionValue[];
  };
  pending: boolean;
  search: string;
  value: string;
}) {
  const {
    handle,
    isActive,
    isAvailable,
    onSelectVariant,
    option,
    pending,
    search,
    value,
  } = props;
  const isHydrated = useIsHydrated();
  const section = useSection();
  const layoutId = handle! + option.name + section?.id;

  const buttonClass = cx([
    'select-none rounded-full py-[.375rem] text-sm font-medium disabled:cursor-pointer',
    'focus-visible:outline-none focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ]);
  const bubbleClass = cx(['absolute inset-0 z-0 bg-accent']);
  const foregroundClass = cx([
    'inline-flex items-center relative z-[2] justify-center whitespace-nowrap px-3 py-1.5 transition-colors notouch:hover:text-accent-foreground',
    isActive && 'text-accent-foreground',
    !isAvailable && 'opacity-50',
  ]);

  // Animated tabs implementation inspired by the fantastic Build UI recipes
  // (Check out the original at: https://buildui.com/recipes/animated-tabs)
  // Credit to the Build UI team for the awesome Pills animation.
  return isHydrated ? (
    <m.button
      className={buttonClass}
      disabled={pending}
      layout
      layoutRoot
      onClick={() => onSelectVariant(value, search)}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span className="relative block h-8">
        {isActive && (
          <m.span
            className={bubbleClass}
            layoutId={layoutId}
            style={{borderRadius: 9999}}
            transition={{bounce: 0.2, duration: 0.5, type: 'spring'}}
          />
        )}
        <m.span
          className={foregroundClass}
          tabIndex={-1}
          whileTap={{scale: 0.9}}
        >
          {value}
        </m.span>
      </span>
    </m.button>
  ) : (
    <Link className={buttonClass} to={search}>
      <span className="relative block h-8">
        {isActive && (
          <span className={bubbleClass} style={{borderRadius: 9999}} />
        )}
        <span className={foregroundClass} tabIndex={-1}>
          {value}
        </span>
      </span>
    </Link>
  );
}

import {Link, useNavigate} from 'react-router';
import {MappedProductOptions} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {m} from 'motion/react';

import type {ProductFragment} from 'types/shopify/storefrontapi.generated';

import {useHydrated} from '~/hooks/use-hydrated';
import {useSection} from '../cms-section';

export type VariantOptionValue = {
  isActive: boolean;
  isAvailable: boolean;
  search: string;
  value: string;
};

export function VariantSelector({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  return productOptions?.map((option) => (
    <div key={option.name}>
      <div>{option.name}</div>
      <Pills productHandle={selectedVariant?.product?.handle} option={option} />
    </div>
  ));
}

function Pills({
  option,
  productHandle,
}: {
  option: MappedProductOptions;
  productHandle: string | undefined;
}) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-3">
      {option.optionValues.map((value) => (
        <Pill
          key={value.name}
          productHandle={productHandle}
          optionName={option.name}
          {...value}
        />
      ))}
    </div>
  );
}

function Pill({
  productHandle,
  selected,
  optionName,
  available,
  name,
  isDifferentProduct,
  variantUriQuery,
}: MappedProductOptions['optionValues'][number] & {
  optionName: string;
  productHandle: string | undefined;
}) {
  const navigate = useNavigate();
  const isHydrated = useHydrated();
  const section = useSection();
  const layoutId = productHandle + optionName + section?.id;

  const buttonClass = cx([
    'rounded-full py-[.375rem] text-sm font-medium select-none disabled:cursor-pointer',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden focus-visible:outline-2',
  ]);
  const bubbleClass = cx(['absolute inset-0 z-0 bg-accent']);
  const foregroundClass = cx([
    'relative z-2 inline-flex items-center justify-center px-3 py-1.5 whitespace-nowrap transition-colors pointer-fine:hover:text-accent-foreground',
    selected && 'text-accent-foreground',
    !available && 'opacity-50',
  ]);

  const path = isDifferentProduct
    ? `/products/${productHandle}?${variantUriQuery}`
    : `?${variantUriQuery}`;

  // Animated tabs implementation inspired by the fantastic Build UI recipes
  // (Check out the original at: https://buildui.com/recipes/animated-tabs)
  // Credit to the Build UI team for the awesome Pills animation.
  return isHydrated ? (
    <m.button
      className={buttonClass}
      layout
      layoutRoot
      onClick={() =>
        navigate(path, {
          preventScrollReset: true,
          replace: true,
        })
      }
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span className="relative block h-8">
        {selected && (
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
          {name}
        </m.span>
      </span>
    </m.button>
  ) : (
    <Link
      className={buttonClass}
      to={`/products/${productHandle}?${variantUriQuery}`}
      {...(!isDifferentProduct ? {rel: 'nofollow'} : {})}
    >
      <span className="relative block h-8">
        {selected && (
          <span className={bubbleClass} style={{borderRadius: 9999}} />
        )}
        <span className={foregroundClass} tabIndex={-1}>
          {name}
        </span>
      </span>
    </Link>
  );
}

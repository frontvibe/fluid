import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {Variants} from 'motion/react';
import type {CartReturn, OptimisticCartLine} from '@shopify/hydrogen';

import {Link} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {useIsPresent} from 'motion/react';

import {useCartFetchers} from '~/hooks/use-cart-fetchers';
import {useLocalePath} from '~/hooks/use-locale-path';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';
import {cn, useVariantUrl} from '~/lib/utils';

import type {CartLayouts} from '.';

import {IconRemove} from '../icons/icon-remove';
import {ProgressiveMotionDiv} from '../progressive-motion';
import {QuantitySelector} from '../quantity-selector';
import {ShopifyImage} from '../shopify-image';
import {ShopifyMoney} from '../shopify-money';
import {IconButton} from '../ui/button';

type CartLine = OptimisticCartLine<CartReturn>;

const base = 4;
const t = (n: number) => base * n;

export function CartLineItem({
  layout,
  line,
  onClose,
}: {
  layout: CartLayouts;
  line: CartLine;
  onClose?: () => void;
}) {
  const isPresent = useIsPresent();
  const {id, merchandise} = line;
  const {id: lineId, isOptimistic} = line;
  const {product, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);
  const cartIsLoading = Boolean(addToCartFetchers.length);

  const variants: Variants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition:
        !isPresent && isOptimistic
          ? {duration: 0}
          : {
              bounce: 0,
              duration: t(0.15),
              opacity: {
                delay: t(0.03),
              },
              type: 'spring',
            },
    },
    visible: {
      opacity: 1,
    },
  };

  // Animated list implementation inspired by the fantastic Build UI recipes
  // (Check out the original at: https://buildui.com/recipes/animated-list)
  // Credit to the Build UI team for the awesome List animation.
  return (
    <ProgressiveMotionDiv
      className="overflow-hidden px-6"
      forceMotion={layout === 'drawer'}
      exit="hidden"
      initial={'visible'}
      animate={!isOptimistic && 'visible'}
      key={id}
      variants={variants}
    >
      <div className="flex gap-4 py-5">
        <div className="size-14">
          {merchandise.image && (
            <ShopifyImage
              alt={merchandise.title}
              aspectRatio="1/1"
              className="h-auto w-full object-cover object-center"
              data={merchandise.image}
              draggable={false}
              loading="eager"
              sizes="56px"
            />
          )}
        </div>

        <div className="flex flex-1 justify-between">
          <div className="grid gap-1">
            <h3 className="font-body text-xl font-medium">
              {merchandise?.product?.handle ? (
                <Link onClick={onClose} to={lineItemUrl}>
                  {merchandise?.product?.title || ''}
                </Link>
              ) : (
                <p>{merchandise?.product?.title || ''}</p>
              )}
            </h3>
            {merchandise?.selectedOptions.find(
              (option) => option.value !== 'Default Title',
            ) && (
              <div className="grid pb-2">
                {(merchandise?.selectedOptions || []).map((option) => (
                  <small className="text-sm opacity-80" key={option.name}>
                    {option.name}: {option.value}
                  </small>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex justify-start">
                <CartLineQuantityAdjust line={line} loading={cartIsLoading} />
              </div>
              <ItemRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
            </div>
          </div>
          <span>
            <CartLinePrice as="span" line={line} />
          </span>
        </div>
      </div>
    </ProgressiveMotionDiv>
  );
}

function ItemRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  const cartPath = useLocalePath({path: '/cart'});
  const {themeContent} = useSanityThemeContent();

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
      route={cartPath}
    >
      <IconButton
        className={cn(
          'overflow-hidden rounded-(--input-border-corner-radius)',
          'rounded-(--input-border-corner-radius)',
          '[border-width:var(--input-border-thickness)] border-[rgb(var(--input)_/_var(--input-border-opacity))]',
          '[box-shadow:rgb(var(--shadow)_/_var(--input-shadow-opacity))_var(--input-shadow-horizontal-offset)_var(--input-shadow-vertical-offset)_var(--input-shadow-blur-radius)_0px]',
        )}
        disabled={disabled}
        type="submit"
      >
        <span className="sr-only">{themeContent?.cart?.remove}</span>
        <IconRemove aria-hidden="true" />
      </IconButton>
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  [key: string]: any;
  line: CartLine;
  priceType?: 'compareAt' | 'regular';
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return <ShopifyMoney {...passthroughProps} data={moneyV2} />;
}

function UpdateCartForm({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const cartPath = useLocalePath({path: '/cart'});
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route={cartPath}
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function CartLineQuantityAdjust({
  line,
  loading,
}: {
  line: CartLine;
  loading: boolean;
}) {
  const {themeContent} = useSanityThemeContent();
  const {quantity} = line;

  if (!line || typeof line?.quantity === 'undefined') return null;

  const {id: lineId} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <>
      <label className="sr-only" htmlFor={`quantity-${lineId}`}>
        {themeContent?.cart?.quantity}, {quantity}
      </label>
      <QuantitySelector>
        <UpdateCartForm lines={[{id: lineId, quantity: prevQuantity}]}>
          <QuantitySelector.Button
            disabled={quantity <= 1 || loading}
            symbol="decrease"
            value={prevQuantity}
          />
        </UpdateCartForm>
        <QuantitySelector.Value>{quantity}</QuantitySelector.Value>
        <UpdateCartForm lines={[{id: lineId, quantity: nextQuantity}]}>
          <QuantitySelector.Button
            disabled={loading}
            symbol="increase"
            value={nextQuantity}
          />
        </UpdateCartForm>
      </QuantitySelector>
    </>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

import type {CartLineUpdateInput} from '@shopify/hydrogen-react/storefront-api-types';
import type {Variants} from 'framer-motion';
import type {CartLineFragment} from 'storefrontapi.generated';

import {Link} from '@remix-run/react';
import {
  CartForm,
  OptimisticInput,
  parseGid,
  useOptimisticData,
} from '@shopify/hydrogen';

import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import type {CartLayouts} from './Cart';

import {ProgressiveMotionDiv} from '../ProgressiveMotionDiv';
import {QuantitySelector} from '../QuantitySelector';
import {ShopifyImage} from '../ShopifyImage';
import {ShopifyMoney} from '../ShopifyMoney';
import {IconRemove} from '../icons/IconRemove';
import {IconButton} from '../ui/Button';

type OptimisticData = {
  action?: string;
  lineId?: string;
  quantity?: number;
};

const base = 4;
const t = (n: number) => base * n;

export function CartLineItem({
  layout,
  line,
  onClose,
}: {
  layout: CartLayouts;
  line: CartLineFragment;
  onClose?: () => void;
}) {
  const optimisticData = useOptimisticData<OptimisticData>('cart-line-item');
  const {id, merchandise} = line;
  const variantId = parseGid(merchandise?.id)?.id;
  const productPath = useLocalePath({
    path: `/products/${merchandise.product.handle}?variant=${variantId}`,
  });
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);
  const cartIsLoading = Boolean(addToCartFetchers.length);

  const remove =
    optimisticData?.action === 'remove' && optimisticData?.lineId === id;

  const variants: Variants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
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
      animate={
        // Hide the line item if the optimistic data action is remove
        // Do not remove the form from the DOM
        remove && 'hidden'
      }
      className="overflow-hidden px-6"
      forceMotion={layout === 'drawer'}
      initial="visible"
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
                <Link onClick={onClose} to={productPath}>
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
              <ItemRemoveButton lineId={id} loading={cartIsLoading} />
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
  lineId,
  loading,
}: {
  lineId: CartLineFragment['id'];
  loading: boolean;
}) {
  const cartPath = useLocalePath({path: '/cart'});
  const {themeContent} = useSanityThemeContent();

  return (
    <CartForm
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds: [lineId],
      }}
      route={cartPath}
    >
      <IconButton
        className={cn(
          'overflow-hidden rounded-[--input-border-corner-radius]',
          'rounded-[--input-border-corner-radius]',
          'border-[rgb(var(--input)_/_var(--input-border-opacity))] [border-width:--input-border-thickness]',
          '[box-shadow:rgb(var(--shadow)_/_var(--input-shadow-opacity))_var(--input-shadow-horizontal-offset)_var(--input-shadow-vertical-offset)_var(--input-shadow-blur-radius)_0px]',
        )}
        disabled={loading}
        type="submit"
      >
        <span className="sr-only">{themeContent?.cart?.remove}</span>
        <IconRemove aria-hidden="true" />
      </IconButton>
      <OptimisticInput data={{action: 'remove', lineId}} id="cart-line-item" />
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  [key: string]: any;
  line: CartLineFragment;
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

  return (
    <CartForm
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines,
      }}
      route={cartPath}
    >
      {children}
    </CartForm>
  );
}

function CartLineQuantityAdjust({
  line,
  loading,
}: {
  line: CartLineFragment;
  loading: boolean;
}) {
  const optimisticId = line?.id;
  const optimisticData = useOptimisticData<OptimisticData>(optimisticId);
  const {themeContent} = useSanityThemeContent();

  if (!line || typeof line?.quantity === 'undefined') return null;

  const optimisticQuantity = optimisticData?.quantity || line.quantity;

  const {id: lineId} = line;
  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <>
      <label className="sr-only" htmlFor={`quantity-${lineId}`}>
        {themeContent?.cart?.quantity}, {optimisticQuantity}
      </label>
      <QuantitySelector>
        <UpdateCartForm lines={[{id: lineId, quantity: prevQuantity}]}>
          <QuantitySelector.Button
            disabled={optimisticQuantity <= 1 || loading}
            symbol="decrease"
            value={prevQuantity}
          >
            <OptimisticInput
              data={{quantity: prevQuantity}}
              id={optimisticId}
            />
          </QuantitySelector.Button>
        </UpdateCartForm>
        <QuantitySelector.Value>{optimisticQuantity}</QuantitySelector.Value>
        <UpdateCartForm lines={[{id: lineId, quantity: nextQuantity}]}>
          <QuantitySelector.Button
            disabled={loading}
            symbol="increase"
            value={nextQuantity}
          >
            <OptimisticInput
              data={{quantity: nextQuantity}}
              id={optimisticId}
            />
          </QuantitySelector.Button>
        </UpdateCartForm>
      </QuantitySelector>
    </>
  );
}

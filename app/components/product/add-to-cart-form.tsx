import type {ProductFragment} from 'types/shopify/storefrontapi.generated';

import {useNavigation} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {useState} from 'react';

import {useLocalePath} from '~/hooks/use-locale-path';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';
import {cn} from '~/lib/utils';
import {QuantitySelector} from '../quantity-selector';
import CleanString from '../sanity/clean-string';
import {Button} from '../ui/button';
import {ClientOnly} from '../client-only';
import {ShopPay} from './shop-pay.client';

export function AddToCartForm({
  selectedVariant,
  showQuantitySelector,
  showShopPay,
}: {
  showQuantitySelector?: boolean | null;
  showShopPay?: boolean | null;
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigation = useNavigation();
  const {themeContent} = useSanityThemeContent();
  const isOutOfStock = !selectedVariant?.availableForSale;
  const [quantity, setQuantity] = useState(1);
  const cartPath = useLocalePath({path: '/cart'});
  const navigationIsLoading = navigation.state !== 'idle';

  return (
    selectedVariant && (
      <>
        {showQuantitySelector && (
          <div className="flex">
            <QuantitySelector>
              <QuantitySelector.Button
                disabled={isOutOfStock || quantity === 1}
                onClick={() => setQuantity(quantity - 1)}
                symbol="decrease"
              />
              <QuantitySelector.Value>{quantity}</QuantitySelector.Value>
              <QuantitySelector.Button
                disabled={isOutOfStock}
                onClick={() => setQuantity(quantity + 1)}
                symbol="increase"
              />
            </QuantitySelector>
          </div>
        )}
        <CartForm
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{
            lines: selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity,
                    selectedVariant,
                  },
                ]
              : [],
          }}
          route={cartPath}
        >
          {(fetcher) => {
            const isLoading = fetcher.state !== 'idle' || navigationIsLoading;

            // Button is disabled if the variant is out of stock or if fetcher is not idle.
            // Button is also disabled if navigation is loading (new variant is being fetched)
            // to prevent adding the wrong variant to the cart.
            return (
              <div className="grid gap-3">
                <Button
                  className={cn([
                    isOutOfStock && 'opacity-50',
                    // Opacity does not change when is loading to prevent flickering
                    'data-[loading="true"]:disabled:opacity-100',
                  ])}
                  data-loading={isLoading}
                  data-sanity-edit-target
                  disabled={isOutOfStock || isLoading}
                  type="submit"
                >
                  {isOutOfStock ? (
                    <CleanString value={themeContent?.product?.soldOut} />
                  ) : (
                    <CleanString value={themeContent?.product?.addToCart} />
                  )}
                </Button>
                {showShopPay && selectedVariant.id && (
                  <div
                    className={cn(
                      '[--shop-pay-button-border-radius:var(--button-border-corner-radius)] [--shop-pay-button-height:_42px] [--shop-pay-button-width:_100%]',
                      'h-[var(--shop-pay-button-height)] w-[var(--shop-pay-button-width)] rounded-[var(--shop-pay-button-border-radius)] bg-[#5a31f4]',
                    )}
                  >
                    <ClientOnly>
                      {() => (
                        <ShopPay
                          isLoading={isLoading}
                          isOutOfStock={isOutOfStock}
                          quantity={quantity}
                          variantId={selectedVariant.id}
                        />
                      )}
                    </ClientOnly>
                  </div>
                )}
              </div>
            );
          }}
        </CartForm>
      </>
    )
  );
}

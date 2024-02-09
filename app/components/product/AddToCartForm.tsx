import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {useNavigation} from '@remix-run/react';
import {CartForm, ShopPayButton} from '@shopify/hydrogen';
import {useState} from 'react';

import {useEnvironmentVariables} from '~/hooks/useEnvironmentVariables';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {useSelectedVariant} from '~/hooks/useSelectedVariant';
import {cn} from '~/lib/utils';

import {QuantitySelector} from '../QuantitySelector';
import CleanString from '../sanity/CleanString';
import {Button} from '../ui/Button';

export function AddToCartForm(props: {
  showQuantitySelector?: boolean | null;
  showShopPay?: boolean | null;
  variants: ProductVariantFragmentFragment[];
}) {
  const navigation = useNavigation();
  const {showQuantitySelector, showShopPay, variants} = props;
  const env = useEnvironmentVariables();
  const {themeContent} = useSanityThemeContent();
  const selectedVariant = useSelectedVariant({variants});
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
            lines: [
              {
                merchandiseId: selectedVariant?.id!,
                quantity,
              },
            ],
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
                {showShopPay && (
                  <div className="h-10">
                    <ShopPayButton
                      className={cn([
                        'h-full',
                        (isLoading || isOutOfStock) &&
                          'pointer-events-none cursor-default',
                        isOutOfStock && 'opacity-50',
                      ])}
                      storeDomain={`https://${env?.PUBLIC_STORE_DOMAIN!}`}
                      variantIdsAndQuantities={[
                        {
                          id: selectedVariant?.id!,
                          quantity: quantity,
                        },
                      ]}
                      width="100%"
                    />
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

import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {CartForm, ShopPayButton} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {useState} from 'react';

import {useEnvironmentVariables} from '~/hooks/useEnvironmentVariables';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {useSelectedVariant} from '~/hooks/useSelectedVariant';

import {QuantitySelector} from '../QuantitySelector';
import CleanString from '../sanity/CleanString';
import {Button} from '../ui/Button';

export function AddToCartForm(props: {
  showQuantitySelector?: boolean | null;
  showShopPay?: boolean | null;
  variants: ProductVariantFragmentFragment[];
}) {
  const {showQuantitySelector, showShopPay, variants} = props;
  const env = useEnvironmentVariables();
  const {themeContent} = useSanityThemeContent();
  const selectedVariant = useSelectedVariant({variants});
  const isOutOfStock = !selectedVariant?.availableForSale;
  const [quantity, setQuantity] = useState(1);

  return (
    selectedVariant && (
      <>
        {showQuantitySelector && (
          <div className="flex">
            <QuantitySelector>
              <QuantitySelector.Button
                disabled={isOutOfStock || quantity === 1}
                onClick={() => setQuantity(quantity - 1)}
                variant="decrease"
              />
              <QuantitySelector.Value>{quantity}</QuantitySelector.Value>
              <QuantitySelector.Button
                disabled={isOutOfStock}
                onClick={() => setQuantity(quantity + 1)}
                variant="increase"
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
          route="/cart"
        >
          {(fetcher) => (
            <div className="grid gap-3">
              <Button
                className={cx([isOutOfStock && 'opacity-50'])}
                data-sanity-edit-target
                disabled={isOutOfStock || fetcher.state !== 'idle'}
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
                    className={cx([
                      'h-full',
                      (fetcher.state !== 'idle' || isOutOfStock) &&
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
          )}
        </CartForm>
      </>
    )
  );
}

import type {TypeFromSelection} from 'groqd';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {useProduct} from '@shopify/hydrogen-react';

import type {ADD_TO_CART_BUTTON_BLOCK_FRAGMENT} from '~/qroq/blocks';

import {AddToCartForm} from './AddToCartForm';
import {VariantSelector} from './VariantSelector';

export function ProductForm(
  props: {
    variants: ProductVariantFragmentFragment[];
  } & TypeFromSelection<typeof ADD_TO_CART_BUTTON_BLOCK_FRAGMENT>,
) {
  const {product} = useProduct();
  const showQuantitySelector = props.quantitySelector;

  if (!product) return null;

  return (
    <div className="grid gap-4">
      <VariantSelector options={product.options} variants={props.variants} />
      <AddToCartForm
        showQuantitySelector={showQuantitySelector}
        showShopPay={props.shopPayButton}
        variants={props.variants}
      />
    </div>
  );
}

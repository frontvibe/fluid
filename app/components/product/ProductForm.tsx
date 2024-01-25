import type {TypeFromSelection} from 'groqd';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {useLoaderData} from '@remix-run/react';

import type {ADD_TO_CART_BUTTON_BLOCK_FRAGMENT} from '~/qroq/blocks';
import type {loader} from '~/routes/($locale).products.$productHandle';

import {AddToCartForm} from './AddToCartForm';
import {VariantSelector} from './VariantSelector';

export function ProductForm(
  props: {
    variants: ProductVariantFragmentFragment[];
  } & TypeFromSelection<typeof ADD_TO_CART_BUTTON_BLOCK_FRAGMENT>,
) {
  const {product} = useLoaderData<typeof loader>();
  const showQuantitySelector = props.quantitySelector;

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

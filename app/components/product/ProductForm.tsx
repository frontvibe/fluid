import type {TypeFromSelection} from 'groqd';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {flattenConnection, useProduct} from '@shopify/hydrogen-react';

import type {ADD_TO_CART_BUTTON_BLOCK_FRAGMENT} from '~/qroq/blocks';

import {useProductVariants} from '../sections/ProductInformationSection';
import {AddToCartForm} from './AddToCartForm';
import {VariantSelector} from './VariantSelector';

export function ProductForm(
  props: TypeFromSelection<typeof ADD_TO_CART_BUTTON_BLOCK_FRAGMENT>,
) {
  const {product} = useProduct();
  const variantsContextData = useProductVariants();
  const showQuantitySelector = props.quantitySelector;

  if (!product) return null;

  if (variantsContextData?.variants) {
    return (
      <div className="grid gap-4">
        <VariantSelector
          options={product.options}
          variants={variantsContextData?.variants}
        />
        <AddToCartForm
          showQuantitySelector={showQuantitySelector}
          showShopPay={props.shopPayButton}
          variants={variantsContextData?.variants}
        />
      </div>
    );
  }

  const variants = product?.variants?.nodes?.length
    ? (flattenConnection(product.variants) as ProductVariantFragmentFragment[])
    : [];

  return (
    <div className="grid gap-4">
      <VariantSelector options={product.options} variants={variants} />
      <AddToCartForm
        showQuantitySelector={showQuantitySelector}
        showShopPay={props.shopPayButton}
        variants={variants}
      />
    </div>
  );
}

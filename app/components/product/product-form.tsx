import type {SectionOfType} from 'types';
import type {ProductVariantFragmentFragment} from 'types/shopify/storefrontapi.generated';

import {flattenConnection, useProduct} from '@shopify/hydrogen-react';

import {useProductVariants} from '../sections/product-information-section';
import {AddToCartForm} from './add-to-cart-form';
import {VariantSelector} from './variant-selector';

export type AddToCartButtonBlockProps = NonNullable<
  SectionOfType<'productInformationSection'>['richtext']
>[number] & {
  _type: 'addToCartButton';
};

export function ProductForm(props: AddToCartButtonBlockProps) {
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

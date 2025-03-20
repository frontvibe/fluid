import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import type {SectionOfType} from 'types';

import {flattenConnection, useProduct} from '@shopify/hydrogen-react';

import {useProductVariants} from '../sections/ProductInformationSection';
import {AddToCartForm} from './AddToCartForm';
import {VariantSelector} from './VariantSelector';

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

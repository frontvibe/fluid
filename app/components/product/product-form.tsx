import type {SectionOfType} from 'types';

import {AddToCartForm} from './add-to-cart-form';
import {VariantSelector} from './variant-selector';
import {useProduct} from './product-provider';

export type AddToCartButtonBlockProps = NonNullable<
  SectionOfType<'productInformationSection'>['richtext']
>[number] & {
  _type: 'addToCartButton';
};

export function ProductForm(props: AddToCartButtonBlockProps) {
  const {product, selectedVariant, productOptions} = useProduct();

  const showQuantitySelector = props.quantitySelector;

  if (!product) return null;

  return (
    <div className="grid gap-4">
      <VariantSelector
        selectedVariant={selectedVariant}
        productOptions={productOptions}
      />
      <AddToCartForm
        showQuantitySelector={showQuantitySelector}
        showShopPay={props.shopPayButton}
        selectedVariant={selectedVariant}
      />
    </div>
  );
}

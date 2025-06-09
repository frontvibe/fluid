import {useOptimisticVariant} from '@shopify/hydrogen';
import {
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  MappedProductOptions,
} from '@shopify/hydrogen-react';
import {createContext, useContext} from 'react';

import {ProductFragment} from 'types/shopify/storefrontapi.generated';

const ProductContext = createContext<{
  product: ProductFragment;
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
} | null>(null);

export const ProductProvider = ({
  children,
  product,
}: {
  children: React.ReactNode;
  product: ProductFragment;
}) => {
  const variants = getAdjacentAndFirstAvailableVariants(product);
  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product?.selectedOrFirstAvailableVariant,
    variants,
  );
  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  return (
    <ProductContext.Provider value={{product, productOptions, selectedVariant}}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const product = useContext(ProductContext);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

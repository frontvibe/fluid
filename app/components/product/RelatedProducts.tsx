import type {ProductRecommendationsQuery} from 'storefrontapi.generated';

import {ProductCardGrid} from './ProductCardGrid';

export function RelatedProducts(props: {
  data: ProductRecommendationsQuery | null;
  heading?: null | string;
}) {
  const {data} = props;
  const products = data ? getRecommendedProducts(data) : [];

  if (products.length === 0) return null;

  return (
    <>
      {props.heading && <h2>{props.heading}</h2>}
      <div className="mt-4">
        <ProductCardGrid products={products} />
      </div>
    </>
  );
}

function getRecommendedProducts(data: ProductRecommendationsQuery) {
  const mergedProducts = (data.recommended ?? [])
    .concat(data.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === data.mainProduct?.id,
  );

  mergedProducts.splice(originalProduct, 1);

  return mergedProducts;
}

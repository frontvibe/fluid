import type {TypeFromSelection} from 'groqd';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {flattenConnection} from '@shopify/hydrogen';
import {useProduct} from '@shopify/hydrogen-react';

import type {PRICE_BLOCK_FRAGMENT} from '~/qroq/blocks';

import {VariantPrice} from '../product/VariantPrice';
import {useProductVariants} from '../sections/ProductInformationSection';

export type PriceBlockProps = TypeFromSelection<typeof PRICE_BLOCK_FRAGMENT>;

export function PriceBlock(props: PriceBlockProps) {
  const {product} = useProduct();
  const variantsContextData = useProductVariants();

  if (!product) return null;

  if (variantsContextData?.variants) {
    return (
      <Layout>
        <VariantPrice variants={variantsContextData?.variants} />
      </Layout>
    );
  }

  const variants = product?.variants?.nodes?.length
    ? (flattenConnection(product.variants) as ProductVariantFragmentFragment[])
    : [];

  return (
    <Layout>
      <VariantPrice variants={variants} />
    </Layout>
  );
}

function Layout({children}: {children: React.ReactNode}) {
  return <div className="flex items-center gap-3">{children}</div>;
}

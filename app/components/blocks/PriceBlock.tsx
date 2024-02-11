import type {TypeFromSelection} from 'groqd';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import {useProduct} from '@shopify/hydrogen-react';
import {Suspense} from 'react';

import type {PRICE_BLOCK_FRAGMENT} from '~/qroq/blocks';
import type {loader} from '~/routes/($locale).products.$productHandle';

import { cn } from '~/lib/utils';

import {VariantPrice, VariantPriceSkeleton} from '../product/VariantPrice';

export type PriceBlockProps = TypeFromSelection<typeof PRICE_BLOCK_FRAGMENT>;

export function PriceBlock(props: PriceBlockProps) {
  const loaderData = useLoaderData<typeof loader>();
  const variantsPromise = loaderData.variants;
  const {product} = useProduct();

  const wrapperClassName = cn('flex items-center gap-3');

  if (variantsPromise) {
    return (
      <div className={wrapperClassName}>
        {/* Todo => Add errorElement */}
        <Suspense fallback={<VariantPriceSkeleton />}>
          <Await resolve={variantsPromise}>
            {({product}) => {
              const variants = product?.variants?.nodes.length
                ? flattenConnection(product.variants)
                : [];

              return <VariantPrice variants={variants} />;
            }}
          </Await>
        </Suspense>
      </div>
    );
  }

  if (!product) return null;

  const variants = product?.variants?.nodes?.length
    ? (flattenConnection(product.variants) as ProductVariantFragmentFragment[])
    : [];

  return (
    <div className={wrapperClassName}>
      <VariantPrice variants={variants} />
    </div>
  );
}

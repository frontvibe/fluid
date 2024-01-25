import type {TypeFromSelection} from 'groqd';

import {Await, useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import {Suspense} from 'react';

import type {PRICE_BLOCK_FRAGMENT} from '~/qroq/blocks';
import type {loader} from '~/routes/($locale).products.$productHandle';

import {VariantPrice} from '../product/VariantPrice';

export type PriceBlockProps = TypeFromSelection<typeof PRICE_BLOCK_FRAGMENT>;

export function PriceBlock(props: PriceBlockProps) {
  const loaderData = useLoaderData<typeof loader>();
  const variantsPromise = loaderData.variants;

  return (
    <>
      {/* Todo => Add skeleton and errorElement */}
      <Suspense>
        <Await resolve={variantsPromise}>
          {({product}) => {
            const variants = product?.variants?.nodes.length
              ? flattenConnection(product.variants)
              : [];

            return <VariantPrice variants={variants} />;
          }}
        </Await>
      </Suspense>
    </>
  );
}

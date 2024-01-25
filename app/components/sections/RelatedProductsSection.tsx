import type {TypeFromSelection} from 'groqd';

import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {RELATED_PRODUCTS_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).products.$productHandle';

import {RelatedProducts} from '../product/RelatedProducts';

export type RelatedProductsSectionProps = TypeFromSelection<
  typeof RELATED_PRODUCTS_SECTION_FRAGMENT
>;

export function RelatedProductsSection(
  props: SectionDefaultProps & {data: RelatedProductsSectionProps},
) {
  const {data} = props;
  const loaderData = useLoaderData<typeof loader>();
  const relatedProductsPromise = loaderData?.relatedProductsPromise;

  // Todo => Add skeleton and errorElement
  return (
    <div className="container">
      <h2>{data.heading}</h2>
      <div className="mt-4">
        <Suspense fallback="loading...">
          <Await
            errorElement={<div>Error</div>}
            resolve={relatedProductsPromise}
          >
            {(result) => <RelatedProducts data={result} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

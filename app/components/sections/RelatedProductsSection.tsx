import type {TypeFromSelection} from 'groqd';

import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {RELATED_PRODUCTS_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).products.$productHandle';

import {Skeleton} from '../Skeleton';
import {ProductCardGrid} from '../product/ProductCardGrid';
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

  // Todo => Add carousel
  return (
    <div className="container">
      {data.heading && <h2>{data.heading}</h2>}
      <div className="mt-4">
        <Suspense
          fallback={
            <Skeleton>
              <ProductCardGrid
                columns={{
                  desktop: props.data.desktopColumns,
                }}
                skeleton={{
                  cardsNumber: props.data.maxProducts || 3,
                }}
              />
            </Skeleton>
          }
        >
          <Await
            errorElement={
              <Skeleton isError>
                <ProductCardGrid
                  columns={{
                    desktop: props.data.desktopColumns,
                  }}
                  skeleton={{
                    cardsNumber: props.data.maxProducts || 3,
                  }}
                />
              </Skeleton>
            }
            resolve={relatedProductsPromise}
          >
            {(result) => <RelatedProducts data={result} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

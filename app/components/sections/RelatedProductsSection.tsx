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
  props: {data: RelatedProductsSectionProps} & SectionDefaultProps,
) {
  const {data} = props;
  const loaderData = useLoaderData<typeof loader>();
  const relatedProductsPromise = loaderData?.relatedProductsPromise;

  // Todo => Add carousel
  return (
    <div className="container">
      <Suspense
        fallback={
          <Skeleton>
            {data.heading && <h2>{data.heading}</h2>}
            <div className="mt-4">
              <ProductCardGrid
                columns={{
                  desktop: data.desktopColumns,
                }}
                skeleton={{
                  cardsNumber: data.maxProducts || 3,
                }}
              />
            </div>
          </Skeleton>
        }
      >
        <Await
          errorElement={
            <Skeleton isError>
              {data.heading && <h2>{data.heading}</h2>}
              <div className="mt-4">
                <ProductCardGrid
                  columns={{
                    desktop: data.desktopColumns,
                  }}
                  skeleton={{
                    cardsNumber: data.maxProducts || 3,
                  }}
                />
              </div>
            </Skeleton>
          }
          resolve={relatedProductsPromise}
        >
          {(result) => (
            <RelatedProducts
              columns={{
                desktop: data.desktopColumns,
              }}
              data={result}
              heading={data.heading}
              maxProducts={data.maxProducts || 3}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

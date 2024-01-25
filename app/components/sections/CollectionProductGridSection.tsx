import type {Filter} from '@shopify/hydrogen/storefront-api-types';
import type {TypeFromSelection} from 'groqd';
import type {
  CollectionProductGridQuery,
  ProductCardFragment,
} from 'storefrontapi.generated';

import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {Pagination, flattenConnection} from '@shopify/hydrogen';
import {Suspense, useEffect} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).collections.$collectionHandle';

import {useLocale} from '~/hooks/useLocale';
import {getAppliedFilters} from '~/lib/shopifyCollection';

import {SortFilter} from '../collection/SortFilter';
import {ProductCardGrid} from '../product/ProductCardGrid';

type CollectionProductGridSectionProps = TypeFromSelection<
  typeof COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT
>;

export type ShopifyCollection = CollectionProductGridQuery['collection'];

export function CollectionProductGridSection(
  props: SectionDefaultProps & {data: CollectionProductGridSectionProps},
) {
  const locale = useLocale();
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData<typeof loader>();
  const collectionProductGridPromise = loaderData?.collectionProductGridPromise;
  const columns = props.data.desktopColumns;
  const mobileColumns = props.data.mobileColumns;

  // Todo => Add skeleton and errorElement
  return (
    <Suspense fallback="loading...">
      <Await
        errorElement={<div>Error</div>}
        resolve={collectionProductGridPromise}
      >
        {(result) => {
          const collection = result?.collection as ShopifyCollection;

          if (!collection) {
            return null;
          }

          const appliedFilters = getAppliedFilters({
            collection,
            locale,
            searchParams,
          });

          // Todo => add enableFiltering and enableSorting settings
          return (
            <div className="container">
              <SortFilter
                appliedFilters={appliedFilters}
                filters={collection?.products.filters as Filter[]}
              >
                <Pagination connection={collection?.products}>
                  {({
                    NextLink,
                    PreviousLink,
                    hasNextPage,
                    isLoading,
                    nextPageUrl,
                    nodes,
                    state,
                  }) => (
                    <>
                      <div className="mb-6 flex items-center justify-center">
                        <PreviousLink>
                          {isLoading ? 'Loading...' : 'Load previous'}
                        </PreviousLink>
                      </div>
                      <ProductsLoadedOnScroll
                        columns={{
                          desktop: columns,
                          mobile: mobileColumns,
                        }}
                        hasNextPage={hasNextPage}
                        inView={true}
                        nextPageUrl={nextPageUrl}
                        nodes={nodes}
                        state={state}
                      />
                      <div className="mt-6 flex items-center justify-center">
                        <NextLink>
                          {isLoading ? 'Loading...' : 'Load more products'}
                        </NextLink>
                      </div>
                    </>
                  )}
                </Pagination>
              </SortFilter>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

function ProductsLoadedOnScroll({
  columns,
  hasNextPage,
  inView,
  nextPageUrl,
  nodes,
  state,
}: {
  columns?: {
    desktop?: null | number;
    mobile?: null | number;
  };
  hasNextPage: boolean;
  inView: boolean;
  nextPageUrl: string;
  nodes: ProductCardFragment[];
  state: unknown;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        preventScrollReset: true,
        replace: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  return (
    <ProductCardGrid
      columns={{
        desktop: columns?.desktop,
        mobile: columns?.mobile,
      }}
      products={nodes}
    />
  );
}

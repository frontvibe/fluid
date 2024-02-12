import type {Filter} from '@shopify/hydrogen/storefront-api-types';
import type {TypeFromSelection} from 'groqd';
import type {
  CollectionProductGridQuery,
  ProductCardFragment,
} from 'storefrontapi.generated';

import {
  Await,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {Pagination} from '@shopify/hydrogen';
import {Suspense, useCallback, useEffect} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).collections.$collectionHandle';

import {useLocale} from '~/hooks/useLocale';
import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {getAppliedFilters} from '~/lib/shopifyCollection';
import {cn} from '~/lib/utils';

import type {AppliedFilter} from '../collection/SortFilterLayout';

import {SortFilter} from '../collection/SortFilterLayout';
import {ProductCardGrid} from '../product/ProductCardGrid';
import {Button} from '../ui/Button';

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
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const collectionProductGridPromise = loaderData?.collectionProductGridPromise;
  const columns = props.data.desktopColumns;
  const mobileColumns = props.data.mobileColumns;

  const handleClearFilters = useCallback(() => {
    navigate(pathname, {
      preventScrollReset: true,
      replace: true,
      // Set optimistic data to clear all filters
      state: {
        optimisticData: true,
        optimisticId: 'clear-all-filters',
      },
    });
  }, [navigate, pathname]);

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
                onClearAllFilters={handleClearFilters}
                productsCount={collection?.products.nodes.length}
                sectionSettings={props.data.settings}
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
                          {/* Todo => Add theme content strings */}
                          {isLoading ? 'Loading...' : 'Load previous'}
                        </PreviousLink>
                      </div>
                      <ProductsLoadedOnScroll
                        appliedFilters={appliedFilters}
                        columns={{
                          desktop: columns,
                          mobile: mobileColumns,
                        }}
                        hasNextPage={hasNextPage}
                        inView={true}
                        nextPageUrl={nextPageUrl}
                        nodes={nodes}
                        onClearAllFilters={handleClearFilters}
                        state={state}
                      />
                      <div className="mt-6 flex items-center justify-center">
                        <NextLink>
                          {/* Todo => Add theme content strings */}
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
  appliedFilters,
  columns,
  hasNextPage,
  inView,
  nextPageUrl,
  nodes,
  onClearAllFilters,
  state,
}: {
  appliedFilters?: AppliedFilter[];
  columns?: {
    desktop?: null | number;
    mobile?: null | number;
  };
  hasNextPage: boolean;
  inView: boolean;
  nextPageUrl: string;
  nodes: ProductCardFragment[];
  onClearAllFilters: () => void;
  state: unknown;
}) {
  const navigate = useNavigate();
  const {pending} = useOptimisticNavigationData<boolean>('clear-all-filters');

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        preventScrollReset: true,
        replace: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  if (!nodes || nodes.length === 0) {
    // Todo => Add theme content strings
    return (
      <div className="flex min-h-[200px] flex-col justify-center text-center">
        <p>No product found.</p>
        {appliedFilters && appliedFilters.length > 0 && (
          <Button
            className={cn([
              'mx-auto mt-4 flex w-max items-center gap-1',
              pending && 'pointer-events-none animate-pulse delay-500',
            ])}
            onClick={onClearAllFilters}
            variant="secondary"
          >
            {/* // Todo => add strings to themeContent */}
            <span>Clear all filters</span>
          </Button>
        )}
      </div>
    );
  }

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

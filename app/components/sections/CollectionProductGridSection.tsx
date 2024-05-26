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
import {Suspense, useCallback, useEffect, useMemo} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).collections.$collectionHandle';

import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {getAppliedFilters} from '~/lib/shopifyCollection';
import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

import type {AppliedFilter} from '../collection/SortFilterLayout';

import {Skeleton} from '../Skeleton';
import {SortFilter} from '../collection/SortFilterLayout';
import {ProductCardGrid} from '../product/ProductCardGrid';
import {Button} from '../ui/Button';

type CollectionProductGridSectionProps = TypeFromSelection<
  typeof COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT
>;

export type ShopifyCollection = CollectionProductGridQuery['collection'];

export function CollectionProductGridSection(
  props: {data: CollectionProductGridSectionProps} & SectionDefaultProps,
) {
  const {locale} = useRootLoaderData();
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const collectionProductGridPromise = loaderData?.collectionProductGridPromise;
  const columns = props.data.desktopColumns;
  const mobileColumns = props.data.mobileColumns;
  const {themeContent} = useSanityThemeContent();

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

  const CollectionProductGridSkeleton = useMemo(() => {
    return (
      <div className="container">
        <SortFilter
          filters={[]}
          onClearAllFilters={handleClearFilters}
          productsCount={0}
          sectionSettings={props.data.settings}
        >
          <div className="mt-6">
            <ProductCardGrid
              columns={{
                desktop: columns,
                mobile: mobileColumns,
              }}
              skeleton={{
                cardsNumber: props.data.productsPerPage || 3,
              }}
            />
          </div>
        </SortFilter>
      </div>
    );
  }, [
    columns,
    handleClearFilters,
    mobileColumns,
    props.data.productsPerPage,
    props.data.settings,
  ]);

  return (
    <Suspense fallback={<Skeleton>{CollectionProductGridSkeleton}</Skeleton>}>
      <Await
        errorElement={
          <Skeleton isError>{CollectionProductGridSkeleton}</Skeleton>
        }
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
                          {isLoading
                            ? themeContent?.collection?.loading
                            : themeContent?.collection?.loadPrevious}
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
                          {isLoading
                            ? themeContent?.collection?.loading
                            : themeContent?.collection?.loadMoreProducts}
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
  const {themeContent} = useSanityThemeContent();

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
    return (
      <div className="flex min-h-[200px] flex-col justify-center text-center">
        <p>{themeContent?.collection?.noProductFound}</p>
        {appliedFilters && appliedFilters.length > 0 && (
          <Button
            className={cn([
              'mx-auto mt-4 flex w-max items-center gap-1',
              pending && 'pointer-events-none animate-pulse delay-500',
            ])}
            onClick={onClearAllFilters}
            variant="secondary"
          >
            <span>{themeContent?.collection?.clearFilters}</span>
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

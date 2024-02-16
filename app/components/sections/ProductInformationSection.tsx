import type {TypeFromSelection} from 'groqd';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen-react';
import {Suspense, createContext, useContext} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {PRODUCT_INFORMATION_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).products.$productHandle';

import {getAspectRatioData} from '~/lib/utils';

import {Skeleton} from '../Skeleton';
import {MediaGallery} from '../product/MediaGallery';
import {ProductDetails} from '../product/ProductDetails';

export type ProductInformationSectionProps = TypeFromSelection<
  typeof PRODUCT_INFORMATION_SECTION_FRAGMENT
>;

type ProductVariantsContextType = {
  variants: ProductVariantFragmentFragment[];
};

export function ProductInformationSection(
  props: SectionDefaultProps & {
    data: ProductInformationSectionProps;
  },
) {
  const loaderData = useLoaderData<typeof loader>();
  const {data} = props;
  const variantsPromise = loaderData.variants;
  const aspectRatio = getAspectRatioData(data.mediaAspectRatio);

  if (variantsPromise) {
    return (
      <>
        <Suspense
          fallback={
            <Skeleton>
              <ProductInformationGrid>
                <MediaGallery aspectRatio={aspectRatio} />
                <ProductDetails data={data} />
              </ProductInformationGrid>
            </Skeleton>
          }
        >
          <Await
            errorElement={
              <Skeleton isError>
                <ProductInformationGrid>
                  <MediaGallery aspectRatio={aspectRatio} />
                  <ProductDetails data={data} />
                </ProductInformationGrid>
              </Skeleton>
            }
            resolve={variantsPromise}
          >
            {({product}) => {
              const variants = product?.variants?.nodes.length
                ? flattenConnection(product.variants)
                : [];

              return (
                <ProductVariantsContext.Provider value={{variants}}>
                  <ProductInformationGrid>
                    <MediaGallery aspectRatio={aspectRatio} />
                    <ProductDetails data={data} />
                  </ProductInformationGrid>
                </ProductVariantsContext.Provider>
              );
            }}
          </Await>
        </Suspense>
      </>
    );
  }

  return (
    <ProductInformationGrid>
      <MediaGallery aspectRatio={aspectRatio} />
      <ProductDetails data={data} />
    </ProductInformationGrid>
  );
}

function ProductInformationGrid({children}: {children: React.ReactNode}) {
  return (
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-2">{children}</div>
    </div>
  );
}

export const ProductVariantsContext =
  createContext<ProductVariantsContextType | null>(null);

export function useProductVariants() {
  return useContext(ProductVariantsContext);
}

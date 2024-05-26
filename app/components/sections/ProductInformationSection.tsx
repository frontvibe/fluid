import type {TypeFromSelection} from 'groqd';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {stegaClean} from '@sanity/client/stega';
import {flattenConnection} from '@shopify/hydrogen-react';
import {Suspense, createContext, useContext} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {PRODUCT_INFORMATION_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).products.$productHandle';

import {cn, getAspectRatioData} from '~/lib/utils';

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
  props: {
    data: ProductInformationSectionProps;
  } & SectionDefaultProps,
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
              <ProductInformationGrid
                data={stegaClean(data)}
                mediaGallery={<MediaGallery aspectRatio={aspectRatio} />}
                productDetails={<ProductDetails data={data} />}
              />
            </Skeleton>
          }
        >
          <Await
            errorElement={
              <Skeleton isError>
                <ProductInformationGrid
                  data={stegaClean(data)}
                  mediaGallery={<MediaGallery aspectRatio={aspectRatio} />}
                  productDetails={<ProductDetails data={data} />}
                />
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
                  <ProductInformationGrid
                    data={stegaClean(data)}
                    mediaGallery={<MediaGallery aspectRatio={aspectRatio} />}
                    productDetails={<ProductDetails data={data} />}
                  />
                </ProductVariantsContext.Provider>
              );
            }}
          </Await>
        </Suspense>
      </>
    );
  }

  return (
    <ProductInformationGrid
      data={stegaClean(data)}
      mediaGallery={<MediaGallery aspectRatio={aspectRatio} />}
      productDetails={<ProductDetails data={data} />}
    />
  );
}

function ProductInformationGrid({
  data,
  mediaGallery,
  productDetails,
}: {
  data: ProductInformationSectionProps;
  mediaGallery: React.ReactNode;
  productDetails: React.ReactNode;
}) {
  const desktopMediaPosition = data?.desktopMediaPosition;
  const desktopMediaWidth = data?.desktopMediaWidth;
  return (
    <div className="lg:container">
      <div className={cn('grid gap-10 lg:grid-cols-12')}>
        <div
          className={cn(
            'lg:col-span-6',
            desktopMediaPosition === 'right' && 'lg:order-last',
            desktopMediaWidth === 'small' && 'lg:col-span-5',
            desktopMediaWidth === 'large' && 'lg:col-span-7',
          )}
        >
          {mediaGallery}
        </div>
        <div
          className={cn(
            'lg:col-span-6',
            desktopMediaWidth === 'small' && 'lg:col-span-7',
            desktopMediaWidth === 'large' && 'lg:col-span-5',
          )}
        >
          {productDetails}
        </div>
      </div>
    </div>
  );
}

export const ProductVariantsContext =
  createContext<ProductVariantsContextType | null>(null);

export function useProductVariants() {
  return useContext(ProductVariantsContext);
}

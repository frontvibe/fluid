import type {SectionDefaultProps, SectionOfType} from 'types';
import type {ProductVariantFragmentFragment} from 'types/shopify/storefrontapi.generated';

import {Await, useLoaderData} from 'react-router';
import {stegaClean} from '@sanity/client/stega';
import {flattenConnection} from '@shopify/hydrogen-react';
import {createContext, Suspense, useContext} from 'react';

import type {Route} from '../../routes/+types/($locale).products.$productHandle';
import {cn, getAspectRatioData} from '~/lib/utils';
import {MediaGallery} from '../product/media-gallery';
import {ProductDetails} from '../product/product-details';
import {Skeleton} from '../skeleton';

export type ProductInformationSectionProps =
  SectionOfType<'productInformationSection'>;

type ProductVariantsContextType = {
  variants: ProductVariantFragmentFragment[];
};

export function ProductInformationSection(
  props: SectionDefaultProps & {
    data: ProductInformationSectionProps;
  },
) {
  const loaderData = useLoaderData<Route.ComponentProps['loaderData']>();
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
  createContext<null | ProductVariantsContextType>(null);

export function useProductVariants() {
  return useContext(ProductVariantsContext);
}

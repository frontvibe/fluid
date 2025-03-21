import type {PortableTextComponents} from '@portabletext/react';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {PriceBlockProps} from '../blocks/price-block';
import type {ShopifyDescriptionBlockProps} from '../blocks/shopify-description-block';
import type {ShopifyTitleBlockProps} from '../blocks/shopify-title-block';
import type {ExternalLinkAnnotationProps} from '../sanity/richtext/components/external-link-annotation';
import type {InternalLinkAnnotationProps} from '../sanity/richtext/components/internal-link-annotation';
import type {FeaturedProductSectionProps} from '../sections/featured-product-section';
import type {ProductInformationSectionProps} from '../sections/product-information-section';
import type {AddToCartButtonBlockProps} from './product-form';

import {PriceBlock} from '../blocks/price-block';
import {ShopifyDescriptionBlock} from '../blocks/shopify-description-block';
import {ShopifyTitleBlock} from '../blocks/shopify-title-block';
import {ExternalLinkAnnotation} from '../sanity/richtext/components/external-link-annotation';
import {InternalLinkAnnotation} from '../sanity/richtext/components/internal-link-annotation';
import {ProductForm} from './product-form';

export function ProductDetails({
  data,
}: {
  data: FeaturedProductSectionProps | ProductInformationSectionProps;
}) {
  const Components = useMemo(
    () => ({
      marks: {
        externalLink: (props: {
          children: React.ReactNode;
          value: ExternalLinkAnnotationProps;
        }) => {
          return (
            <ExternalLinkAnnotation {...props.value}>
              {props.children}
            </ExternalLinkAnnotation>
          );
        },
        internalLink: (props: {
          children: React.ReactNode;
          value: InternalLinkAnnotationProps;
        }) => {
          return (
            <InternalLinkAnnotation {...props.value}>
              {props.children}
            </InternalLinkAnnotation>
          );
        },
      },
      types: {
        addToCartButton: (props: {value: AddToCartButtonBlockProps}) => (
          <ProductForm {...props.value} />
        ),
        price: (props: {value: PriceBlockProps}) => (
          <PriceBlock {...props.value} />
        ),
        shopifyDescription: (props: {value: ShopifyDescriptionBlockProps}) => (
          <ShopifyDescriptionBlock {...props.value} />
        ),
        shopifyTitle: (props: {value: ShopifyTitleBlockProps}) => (
          <ShopifyTitleBlock {...props.value} />
        ),
      },
    }),
    [],
  );

  return (
    <div className="container space-y-4 lg:max-w-none lg:px-0">
      {data.richtext && (
        <PortableText
          components={Components as PortableTextComponents}
          value={data.richtext}
        />
      )}
    </div>
  );
}

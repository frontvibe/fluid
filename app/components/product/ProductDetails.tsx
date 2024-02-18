import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {ADD_TO_CART_BUTTON_BLOCK_FRAGMENT} from '~/qroq/blocks';

import type {PriceBlockProps} from '../blocks/PriceBlock';
import type {ShopifyDescriptionBlockProps} from '../blocks/ShopifyDescriptionBlock';
import type {ShopifyTitleBlockProps} from '../blocks/ShopifyTitleBlock';
import type {ExternalLinkAnnotationProps} from '../sanity/richtext/components/ExternalLinkAnnotation';
import type {InternalLinkAnnotationProps} from '../sanity/richtext/components/InternalLinkAnnotation';
import type {FeaturedProductSectionProps} from '../sections/FeaturedProductSection';
import type {ProductInformationSectionProps} from '../sections/ProductInformationSection';

import {PriceBlock} from '../blocks/PriceBlock';
import {ShopifyDescriptionBlock} from '../blocks/ShopifyDescriptionBlock';
import {ShopifyTitleBlock} from '../blocks/ShopifyTitleBlock';
import {ExternalLinkAnnotation} from '../sanity/richtext/components/ExternalLinkAnnotation';
import {InternalLinkAnnotation} from '../sanity/richtext/components/InternalLinkAnnotation';
import {ProductForm} from './ProductForm';

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
        addToCartButton: (props: {
          value: TypeFromSelection<typeof ADD_TO_CART_BUTTON_BLOCK_FRAGMENT>;
        }) => <ProductForm {...props.value} />,
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
          value={data.richtext as PortableTextBlock[]}
        />
      )}
    </div>
  );
}

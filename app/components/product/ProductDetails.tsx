import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {AddToCartButtonBlockProps} from '../blocks/AddToCartButtonBlock';
import type {PriceBlockProps} from '../blocks/PriceBlock';
import type {ShopifyDescriptionBlockProps} from '../blocks/ShopifyDescriptionBlock';
import type {ShopifyTitleBlockProps} from '../blocks/ShopifyTitleBlock';
import type {ExternalLinkAnnotationProps} from '../sanity/richtext/components/ExternalLinkAnnotation';
import type {InternalLinkAnnotationProps} from '../sanity/richtext/components/InternalLinkAnnotation';
import type {ProductInformationSectionProps} from '../sections/ProductInformationSection';

import {AddToCartButtonBlock} from '../blocks/AddToCartButtonBlock';
import {PriceBlock} from '../blocks/PriceBlock';
import {ShopifyDescriptionBlock} from '../blocks/ShopifyDescriptionBlock';
import {ShopifyTitleBlock} from '../blocks/ShopifyTitleBlock';
import {ExternalLinkAnnotation} from '../sanity/richtext/components/ExternalLinkAnnotation';
import {InternalLinkAnnotation} from '../sanity/richtext/components/InternalLinkAnnotation';

export function ProductDetails(props: {data: ProductInformationSectionProps}) {
  const components = useMemo(
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
        addToCartButton: (props: {value: AddToCartButtonBlockProps}) => {
          return <AddToCartButtonBlock {...props.value} />;
        },
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
    <div className="space-y-4">
      {props.data.richtext && (
        <PortableText
          components={components as PortableTextComponents}
          value={props.data.richtext as PortableTextBlock[]}
        />
      )}
    </div>
  );
}

import type {EncodeDataAttributeCallback} from '@sanity/react-loader';
import type {ShopifySalesChannel} from '@shopify/hydrogen';
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';

import type {
  ALL_SECTIONS_QUERYResult,
  internalGroqTypeReferenceTo,
  Richtext,
  SanityImageCrop,
  SanityImageHotspot,
} from './sanity/sanity.generated';
export type I18nLocale = Locale & {
  default: boolean;
  pathPrefix: string;
};

export type Locale = {
  country: CountryCode;
  currency: CurrencyCode;
  isoCode: string;
  label: string;
  language: LanguageCode;
  languageLabel: string;
  salesChannel: keyof typeof ShopifySalesChannel;
};

export type Localizations = Record<string, Locale>;

export type SectionDefaultProps = {
  encodeDataAttribute?: EncodeDataAttributeCallback;
};

/**
 * All possible sections _types
 */
type AllSectionsTypes = NonNullable<
  NonNullable<ALL_SECTIONS_QUERYResult>['sections']
>[number]['_type'];

type AllFootersTypes = NonNullable<
  NonNullable<ALL_SECTIONS_QUERYResult>['footers']
>[number]['_type'];

export type SectionDataType = NonNullable<
  NonNullable<ALL_SECTIONS_QUERYResult>['sections']
>[0];

export type FooterDataType = NonNullable<
  NonNullable<ALL_SECTIONS_QUERYResult>['footers']
>[0];

export type SectionOfType<T extends AllSectionsTypes> =
  NonNullable<ALL_SECTIONS_QUERYResult>['sections'] extends Array<
    infer S
  > | null
    ? S extends {_type: T}
      ? S
      : never
    : never;

export type FooterOfType<T extends AllFootersTypes> =
  NonNullable<ALL_SECTIONS_QUERYResult>['footers'] extends Array<infer S> | null
    ? S extends {_type: T}
      ? S
      : never
    : never;

export type RichTextBlock = NonNullable<
  SectionOfType<'richtextSection'>['richtext']
>[0] & {
  _type: 'block';
};

export type SanityImage = null | {
  _ref: null | string;
  _type: 'image';
  altText: null | string;
  asset: null | {
    _ref: string;
    _type: 'reference';
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: 'sanity.imageAsset' | undefined;
  };
  crop: null | SanityImageCrop;
  hotspot: null | SanityImageHotspot;
};

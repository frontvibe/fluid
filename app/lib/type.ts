import type {EncodeDataAttributeCallback} from '@sanity/react-loader';
import type {ShopifySalesChannel} from '@shopify/hydrogen';
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';
import type {TypeFromSelection} from 'groqd';

import type {IMAGE_FRAGMENT} from '~/qroq/fragments';

export type I18nLocale = {
  default: boolean;
  pathPrefix: string;
} & Locale;

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

export type SanityImageFragment = TypeFromSelection<typeof IMAGE_FRAGMENT>;

export type SectionDefaultProps = {
  encodeDataAttribute?: EncodeDataAttributeCallback;
};

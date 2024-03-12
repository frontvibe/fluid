import {lazy} from 'react';

import {ImageBannerSection} from '~/components/sections/ImageBannerSection';
import {RichtextSection} from '~/components/sections/RichtextSection';

import {FooterSocialLinksOnly} from '../components/footers/FooterSocialLinksOnly';
import {CarouselSection} from '../components/sections/CarouselSection';
import {CollectionBannerSection} from '../components/sections/CollectionBannerSection';
import {CollectionListSection} from '../components/sections/CollectionListSection';
import {CollectionProductGridSection} from '../components/sections/CollectionProductGridSection';
import {FeaturedCollectionSection} from '../components/sections/FeaturedCollectionSection';
import {FeaturedProductSection} from '../components/sections/FeaturedProductSection';
import {ProductInformationSection} from '../components/sections/ProductInformationSection';
import {RelatedProductsSection} from '../components/sections/RelatedProductsSection';

export const sections: {
  [key: string]: React.FC<any>;
} = {
  carouselSection: CarouselSection,
  // lazy(() =>
  //   import('../components/sections/CarouselSection').then((module) => ({
  //     default: module.CarouselSection,
  //   })),
  // ),
  collectionBannerSection: CollectionBannerSection,
  // lazy(() =>
  //   import('../components/sections/CollectionBannerSection').then((module) => ({
  //     default: module.CollectionBannerSection,
  //   })),
  // ),
  collectionListSection: CollectionListSection,
  // lazy(() =>
  //   import('../components/sections/CollectionListSection').then((module) => ({
  //     default: module.CollectionListSection,
  //   })),
  // ),
  collectionProductGridSection: CollectionProductGridSection,
  // lazy(() =>
  //   import('../components/sections/CollectionProductGridSection').then(
  //     (module) => ({
  //       default: module.CollectionProductGridSection,
  //     }),
  //   ),
  // ),
  featuredCollectionSection: FeaturedCollectionSection,
  // lazy(() =>
  //   import('../components/sections/FeaturedCollectionSection').then(
  //     (module) => ({
  //       default: module.FeaturedCollectionSection,
  //     }),
  //   ),
  // ),
  featuredProductSection: FeaturedProductSection,
  // lazy(() =>
  //   import('../components/sections/FeaturedProductSection').then((module) => ({
  //     default: module.FeaturedProductSection,
  //   })),
  // ),
  imageBannerSection: ImageBannerSection,
  // lazy(() =>
  //   import('../components/sections/ImageBannerSection').then((module) => ({
  //     default: module.ImageBannerSection,
  //   })),
  // ),
  productInformationSection: ProductInformationSection,
  // lazy(() =>
  //   import('../components/sections/ProductInformationSection').then(
  //     (module) => ({
  //       default: module.ProductInformationSection,
  //     }),
  //   ),
  // ),
  relatedProductsSection: RelatedProductsSection,
  // lazy(() =>
  //   import('../components/sections/RelatedProductsSection').then((module) => ({
  //     default: module.RelatedProductsSection,
  //   })),
  // ),
  richtextSection: RichtextSection,
  // lazy(() =>
  //   import('../components/sections/RichtextSection').then((module) => ({
  //     default: module.RichtextSection,
  //   })),
  // ),
  socialLinksOnly: FooterSocialLinksOnly,
  // lazy(() =>
  //   import('../components/footers/FooterSocialLinksOnly').then((module) => ({
  //     default: module.FooterSocialLinksOnly,
  //   })),
  // ),
};

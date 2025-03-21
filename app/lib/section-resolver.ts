import {FooterSocialLinksOnly} from '~/components/footers/footer-social-links-only';
import {CarouselSection} from '~/components/sections/carousel-section';
import {CollectionBannerSection} from '~/components/sections/collection-banner-section';
import {CollectionListSection} from '~/components/sections/collection-list-section';
import {CollectionProductGridSection} from '~/components/sections/collection-product-grid-section';
import {FeaturedCollectionSection} from '~/components/sections/featured-collection-section';
import {FeaturedProductSection} from '~/components/sections/featured-product-section';
import {ImageBannerSection} from '~/components/sections/image-banner-section';
import {ProductInformationSection} from '~/components/sections/product-information-section';
import {RelatedProductsSection} from '~/components/sections/related-products-section';
import {RichtextSection} from '~/components/sections/richtext-section';

export const sections: {
  [key: string]: React.FC<any>;
} = {
  carouselSection: CarouselSection,
  collectionBannerSection: CollectionBannerSection,
  collectionListSection: CollectionListSection,
  collectionProductGridSection: CollectionProductGridSection,
  featuredCollectionSection: FeaturedCollectionSection,
  featuredProductSection: FeaturedProductSection,
  imageBannerSection: ImageBannerSection,
  productInformationSection: ProductInformationSection,
  relatedProductsSection: RelatedProductsSection,
  richtextSection: RichtextSection,
  socialLinksOnly: FooterSocialLinksOnly,
};

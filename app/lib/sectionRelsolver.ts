import {FooterSocialLinksOnly} from '~/components/footers/FooterSocialLinksOnly';
import {CarouselSection} from '~/components/sections/CarouselSection';
import {CollectionBannerSection} from '~/components/sections/CollectionBannerSection';
import {CollectionListSection} from '~/components/sections/CollectionListSection';
import {CollectionProductGridSection} from '~/components/sections/CollectionProductGridSection';
import {FeaturedCollectionSection} from '~/components/sections/FeaturedCollectionSection';
import {FeaturedProductSection} from '~/components/sections/FeaturedProductSection';
import {ImageBannerSection} from '~/components/sections/ImageBannerSection';
import {ProductInformationSection} from '~/components/sections/ProductInformationSection';
import {RelatedProductsSection} from '~/components/sections/RelatedProductsSection';
import {RichtextSection} from '~/components/sections/RichtextSection';

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

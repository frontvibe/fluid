import blogPost from './documents/blogPost';
import collection from './documents/collection';
import collectionTemplate from './documents/collectionTemplate';
import color from './documents/color';
import page from './documents/page';
import product from './documents/product';
import productTemplate from './documents/productTemplate';
import productVariant from './documents/productVariant';
import socialLinksOnly from './objects/footers/socialLinksOnly';
import announcementBar from './objects/global/announcementBar';
import aspectRatios from './objects/global/aspectRatios';
import bannerRichtext from './objects/global/bannerRichtext';
import contentPosition from './objects/global/contentPosition';
import footersList from './objects/global/footersList';
import headerNavigation from './objects/global/headerNavigation';
import paddingObject from './objects/global/padding';
import productRichtext from './objects/global/productRichtext';
import richtext from './objects/global/richtext';
import sectionSettings from './objects/global/sectionSettings';
import sectionsList, {
  collectionSections,
  productSections,
} from './objects/global/sectionsList';
import seo from './objects/global/seo';
import carouselSection from './objects/sections/carouselSection';
import collectionBanner from './objects/sections/collectionBanner';
import collectionListSection from './objects/sections/collectionListSection';
import collectionProductGrid from './objects/sections/collectionProductGrid';
import featuredCollection from './objects/sections/featuredCollectionSection';
import featuredProductSection from './objects/sections/featuredProductSection';
import imageBannerSection from './objects/sections/imageBannerSection';
import productInformationSection from './objects/sections/productInformationSection';
import relatedProductsSection from './objects/sections/relatedProductsSection';
import richtextSection from './objects/sections/richtextSection';
import inventory from './objects/shopify/inventory';
import options from './objects/shopify/options';
import placeholderString from './objects/shopify/placeholderString';
import priceRange from './objects/shopify/priceRange';
import proxyString from './objects/shopify/proxyString';
import shopifyCollection from './objects/shopify/shopifyCollection';
import shopifyCollectionRule from './objects/shopify/shopifyCollectionRule';
import shopifyProduct from './objects/shopify/shopifyProduct';
import shopifyProductVariant from './objects/shopify/shopifyProductVariant';
import footer from './singletons/footer';
import header from './singletons/header';
import home from './singletons/home';
import settings from './singletons/settings';
import themeContent from './singletons/themeContent';

const singletons = [home, header, footer, settings, themeContent];
const documents = [
  page,
  color,
  collection,
  product,
  productTemplate,
  collectionTemplate,
  blogPost,
  productVariant,
];
const sections = [
  imageBannerSection,
  featuredCollection,
  featuredProductSection,
  collectionListSection,
  productInformationSection,
  relatedProductsSection,
  carouselSection,
  richtextSection,
  collectionBanner,
  collectionProductGrid,
];
const footers = [socialLinksOnly];
const objects = [
  footersList,
  sectionsList,
  productSections,
  collectionSections,
  productRichtext,
  bannerRichtext,
  seo,
  sectionSettings,
  headerNavigation,
  announcementBar,
  inventory,
  options,
  placeholderString,
  priceRange,
  proxyString,
  shopifyProduct,
  shopifyProductVariant,
  shopifyCollection,
  shopifyCollectionRule,
  paddingObject,
  contentPosition,
  richtext,
  aspectRatios,
];

export const schemaTypes = [
  ...objects,
  ...sections,
  ...footers,
  ...singletons,
  ...documents,
];

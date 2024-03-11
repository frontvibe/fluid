import color from './documents/color';
import footer from './singletons/footer';
import header from './singletons/header';
import page from './documents/page';
import settings from './singletons/settings';
import themeContent from './singletons/themeContent';
import imageBannerSection from './objects/sections/imageBannerSection';
import home from './singletons/home';
import collection from './documents/collection';
import product from './documents/product';
import blogPost from './documents/blogPost';
import sectionsList, {
  productSections,
  collectionSections,
} from './objects/global/sectionsList';
import seo from './objects/global/seo';
import sectionSettings from './objects/global/sectionSettings';
import headerNavigation from './objects/global/headerNavigation';
import inventory from './objects/shopify/inventory';
import options from './objects/shopify/options';
import placeholderString from './objects/shopify/placeholderString';
import priceRange from './objects/shopify/priceRange';
import proxyString from './objects/shopify/proxyString';
import shopifyProduct from './objects/shopify/shopifyProduct';
import shopifyProductVariant from './objects/shopify/shopifyProductVariant';
import productVariant from './documents/productVariant';
import shopifyCollection from './objects/shopify/shopifyCollection';
import shopifyCollectionRule from './objects/shopify/shopifyCollectionRule';
import paddingObject from './objects/global/padding';
import footersList from './objects/global/footersList';
import socialLinksOnly from './objects/footers/socialLinksOnly';
import contentPosition from './objects/global/contentPosition';
import featuredCollection from './objects/sections/featuredCollectionSection';
import collectionListSection from './objects/sections/collectionListSection';
import featuredProductSection from './objects/sections/featuredProductSection';
import productInformationSection from './objects/sections/productInformationSection';
import productRichtext from './objects/global/productRichtext';
import relatedProductsSection from './objects/sections/relatedProductsSection';
import carouselSection from './objects/sections/carouselSection';
import richtextSection from './objects/sections/richtextSection';
import richtext from './objects/global/richtext';
import productTemplate from './documents/productTemplate';
import collectionTemplate from './documents/collectionTemplate';
import collectionBanner from './objects/sections/collectionBanner';
import collectionProductGrid from './objects/sections/collectionProductGrid';
import announcementBar from './objects/global/announcementBar';
import aspectRatios from './objects/global/aspectRatios';
import bannerRichtext from './objects/global/bannerRichtext';

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

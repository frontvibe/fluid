import {projectDetails} from '../project.details';

const SHOPIFY_SHOP_HANDLE = projectDetails.shopifyShopHandle;

const storeUrl = `https://admin.shopify.com/store/${SHOPIFY_SHOP_HANDLE}`;

export const collectionUrl = (collectionId: number) => {
  if (!SHOPIFY_SHOP_HANDLE) {
    return null;
  }
  return `${storeUrl}/collections/${collectionId}`;
};

export const productUrl = (productId: number) => {
  if (!SHOPIFY_SHOP_HANDLE) {
    return null;
  }
  return `${storeUrl}/products/${productId}`;
};

export const productVariantUrl = (
  productId: number,
  productVariantId: number,
) => {
  if (!SHOPIFY_SHOP_HANDLE) {
    return null;
  }
  return `${storeUrl}/products/${productId}/variants/${productVariantId}`;
};

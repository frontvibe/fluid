export const projectDetails = {
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2023-10-01',
  previewUrl: process.env.SANITY_STUDIO_PRODUCTION_URL,
  previewSecret: process.env.SANITY_STUDIO_PREVIEW_SECRET,
  shopifyShopHandle: process.env.SANITY_STUDIO_SHOPIFY_SHOP_HANDLE,
};

import type {DocumentActionDescription} from 'sanity';

import {EarthGlobeIcon} from '@sanity/icons';

import type {ShopifyDocument, ShopifyDocumentActionProps} from './types';

import {usePluginContext} from './studio-layout';

export default (
  props: ShopifyDocumentActionProps,
): DocumentActionDescription | undefined => {
  const {published, type}: {published: ShopifyDocument; type: string} = props;
  const {shopifyStoreDomain} = usePluginContext();
  const storeHandle = shopifyStoreDomain.replace('.myshopify.com', '');
  const storeUrl = `https://admin.shopify.com/store/${storeHandle}`;

  if (!published || published?.store?.isDeleted) {
    return;
  }

  let url: null | string = null;

  if (type === 'collection') {
    url = `${storeUrl}/collections/${published?.store?.id}`;
  }
  if (type === 'product') {
    url = `${storeUrl}/products/${published?.store?.id}`;
  }
  if (type === 'productVariant') {
    url = `${storeUrl}/products/${published?.store?.productId}/variants/${published?.store?.id}`;
  }

  if (!url) {
    return;
  }

  if (published && !published?.store?.isDeleted) {
    return {
      label: 'Edit in Shopify',
      icon: EarthGlobeIcon,
      onHandle: () => {
        if (url) {
          window.open(url);
        }
      },
      shortcut: 'Ctrl+Alt+E',
    };
  }
};

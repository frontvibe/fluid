import {CopyIcon} from '@sanity/icons';
import {defineField, defineType} from 'sanity';

import ShopifyIcon from '../../components/icons/shopify-icon';
import ProductVariantHiddenInput from '../../components/shopify/product-variant-input';
import ShopifyDocumentStatus from '../../components/shopify/shopify-document-status';

export default defineType({
  name: 'productVariant',
  title: 'Product variant',
  type: 'document',
  __experimental_formPreviewTitle: false,
  icon: CopyIcon,
  groups: [
    {
      name: 'shopifySync',
      title: 'Shopify sync',
      icon: ShopifyIcon,
    },
  ],
  fields: [
    // Product variant hidden status
    defineField({
      name: 'hidden',
      type: 'string',
      components: {
        field: ProductVariantHiddenInput,
      },
      hidden: ({parent}) => {
        const isDeleted = parent?.store?.isDeleted;

        return !isDeleted;
      },
    }),
    // Title (proxy)
    defineField({
      title: 'Title',
      name: 'titleProxy',
      type: 'proxyString',
      options: {field: 'store.title'},
    }),
    // Shopify product variant
    defineField({
      name: 'store',
      title: 'Shopify',
      description: 'Variant data from Shopify (read-only)',
      type: 'shopifyProductVariant',
      group: 'shopifySync',
    }),
  ],
  preview: {
    select: {
      isDeleted: 'store.isDeleted',
      previewImageUrl: 'store.previewImageUrl',
      sku: 'store.sku',
      status: 'store.status',
      title: 'store.title',
    },
    prepare(selection) {
      const {isDeleted, previewImageUrl, sku, status, title} = selection;

      return {
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            title={title}
            type="productVariant"
            url={previewImageUrl}
          />
        ),
        subtitle: sku,
        title,
      };
    },
  },
});

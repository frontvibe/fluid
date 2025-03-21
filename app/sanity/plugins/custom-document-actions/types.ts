import type {DocumentActionProps, SanityDocument} from 'sanity';

export type ShopifyDocument = SanityDocument & {
  store: {
    id: number;
    isDeleted: boolean;
    productId: number;
  };
};

export interface ShopifyDocumentActionProps extends DocumentActionProps {
  draft: ShopifyDocument;
  published: ShopifyDocument;
}

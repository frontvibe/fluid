import type {
  DocumentActionComponent,
  DocumentActionsResolver,
  NewDocumentOptionsResolver,
} from 'sanity';

import {definePlugin} from 'sanity';

import {LOCKED_DOCUMENT_TYPES, SHOPIFY_DOCUMENT_TYPES} from './constants';
import shopifyDelete from './shopify-delete';
import shopifyLink from './shopify-link';
import {createStudioLayout} from './studio-layout';

export const resolveDocumentActions: DocumentActionsResolver = (
  prev,
  {schemaType},
) => {
  if (LOCKED_DOCUMENT_TYPES.includes(schemaType)) {
    prev = prev.filter(
      (previousAction: DocumentActionComponent) =>
        previousAction.action === 'publish' ||
        previousAction.action === 'discardChanges',
    );
  }

  if (SHOPIFY_DOCUMENT_TYPES.includes(schemaType)) {
    prev = prev.filter(
      (previousAction: DocumentActionComponent) =>
        previousAction.action === 'publish' ||
        previousAction.action === 'unpublish' ||
        previousAction.action === 'discardChanges',
    );

    return [
      ...prev,
      shopifyDelete as DocumentActionComponent,
      shopifyLink as DocumentActionComponent,
    ];
  }

  return prev;
};

export const resolveNewDocumentOptions: NewDocumentOptionsResolver = (prev) => {
  const options = prev.filter((previousOption) => {
    return (
      !LOCKED_DOCUMENT_TYPES.includes(previousOption.templateId) &&
      !SHOPIFY_DOCUMENT_TYPES.includes(previousOption.templateId)
    );
  });

  return options;
};

export const customDocumentActions = definePlugin<{
  shopifyStoreDomain: string;
}>((props) => {
  return {
    name: 'custom-document-actions',
    studio: {
      components: {
        layout: createStudioLayout({
          shopifyStoreDomain: props.shopifyStoreDomain,
        }),
      },
    },
    document: {
      actions: resolveDocumentActions,
      newDocumentOptions: resolveNewDocumentOptions,
    },
  };
});

import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from 'sanity/structure';

import {LayoutTemplate, PanelsTopLeft} from 'lucide-react';

import {collections} from './collection-structure';
import {products} from './product-structure';
import {singleton, SINGLETONS} from './singletons';

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => {
  return S.document().views([S.view.form()]);
};

export const structure: StructureResolver = (S, context) => {
  return S.list()
    .title('Content')
    .items([
      singleton(S, SINGLETONS.home),
      S.documentTypeListItem('page').icon(PanelsTopLeft),
      products(S, context),
      collections(S, context),
      S.divider(),
      singleton(S, SINGLETONS.header),
      singleton(S, SINGLETONS.footer),
      S.divider(),
      singleton(S, SINGLETONS.settings),
      S.listItem()
        .title('Templates')
        .icon(LayoutTemplate)
        .child(
          S.list()
            .title('Templates')
            .items([
              S.listItem()
                .title('Products')
                .icon(false)
                .child(S.documentTypeList('productTemplate')),
              S.listItem()
                .title('Collections')
                .icon(false)
                .child(S.documentTypeList('collectionTemplate')),
            ]),
        ),
      S.documentTypeListItem('colorScheme').showIcon(true),
      singleton(S, SINGLETONS.typography),
      singleton(S, SINGLETONS.themeContent),
    ]);
};

import {ListItemBuilder} from 'sanity/structure';
import defineStructure from '../utils/defineStructure';
import {InfoOutlineIcon} from '@sanity/icons';
import {IconTag} from '../components/icons/Tag';
import {projectDetails} from '../project.details';

const {apiVersion} = projectDetails;

export const products = defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Products')
    .icon(IconTag)
    .schemaType('product')
    .child(
      S.documentTypeList('product')
        // .defaultLayout('detail')
        .child(async (id) =>
          S.list()
            .title('Product')
            .canHandleIntent(
              (intentName, params) =>
                intentName === 'edit' && params.type === 'product',
            )
            .items([
              // Details
              S.listItem()
                .title('Details')
                .icon(InfoOutlineIcon)
                .schemaType('product')
                .id(id)
                .child(S.document().schemaType('product').documentId(id)),
              // Product variants
              S.listItem()
                .title('Variants')
                .schemaType('productVariant')
                .child(
                  S.documentList()
                    .title('Variants')
                    .schemaType('productVariant')
                    .filter(
                      `
                      _type == "productVariant"
                      && store.productId == $productId
                    `,
                    )
                    .apiVersion(apiVersion)
                    .params({
                      productId: Number(id.replace('shopifyProduct-', '')),
                    })
                    .canHandleIntent(
                      (intentName, params) =>
                        intentName === 'edit' &&
                        params.type === 'productVariant',
                    ),
                ),
            ]),
        ),
    ),
);

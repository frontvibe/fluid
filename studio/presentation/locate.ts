// locate.ts
import {
  DocumentLocationResolver,
  DocumentLocationsState,
} from 'sanity/presentation';
import {map, Observable} from 'rxjs';
import {getAllLanguages} from '../../countries';

const languages = getAllLanguages();
const defaultLanguage = languages[0];
const sanityPreviewPath = (slug?: string) => `/sanity/preview?slug=/${slug}`;

export const locate: DocumentLocationResolver = (params, context) => {
  if (
    params.type === 'collection' ||
    params.type === 'home' ||
    params.type === 'page' ||
    params.type === 'product'
  ) {
    /* 
      Listen to all changes in the selected document 
      and all documents that reference it
    */
    const doc$ = context.documentStore.listenQuery(
      `*[_id==$id || references($id)]{_type,slug,title,_id,store}`,
      params,
      {perspective: 'previewDrafts'},
    ) as Observable<
      | {
          _id: string;
          _type: string;
          slug?: {current: string};
          title?: {_key: 'string'; value: string}[];
          store?: {slug: {current: string}; title: string};
        }[]
      | null
    >;
    // pipe the real-time results to RXJS's map function
    return doc$.pipe(
      map((docs) => {
        if (!docs) {
          return {
            message: 'Unable to map document type to locations',
            tone: 'critical',
          } satisfies DocumentLocationsState;
        }
        /**
         * Home
         */
        const home = docs.find(({_type}) => _type === 'home');
        const homeLocations = home
          ? languages.map(({id, title}) => ({
              href:
                id === defaultLanguage.id
                  ? sanityPreviewPath('')
                  : sanityPreviewPath(id),
              title: `Home (${title})`,
            }))
          : [];

        /**
         * Pages
         */
        const pages = docs.filter(({_type, slug}) => _type === 'page' && slug);
        const pagesLocations = pages
          .map(({slug, title}) => {
            const locations: Array<{
              href: string;
              title: string;
            }> = [];

            for (const lang of languages) {
              const isDefaultLanguage = lang.id === defaultLanguage.id;
              const pageTitle = title?.find((t) => t._key === lang.id)?.value;

              locations.push({
                href: isDefaultLanguage
                  ? sanityPreviewPath(slug?.current)
                  : sanityPreviewPath(`${lang.id}/${slug?.current}`),
                title: pageTitle
                  ? `${pageTitle} (${lang.title})`
                  : `Page (${lang.title})`,
              });
            }

            return locations;
          })
          .flat();

        /**
         * Products
         */
        const products = docs.filter(
          ({_type, store}) => _type === 'product' && store?.slug?.current,
        );
        const productsLocations = products
          .map(({store}) => {
            const locations: Array<{
              href: string;
              title: string;
            }> = [];

            for (const lang of languages) {
              const isDefaultLanguage = lang.id === defaultLanguage.id;
              locations.push({
                href: isDefaultLanguage
                  ? sanityPreviewPath(`products/${store?.slug?.current}`)
                  : sanityPreviewPath(
                      `${lang.id}/products/${store?.slug?.current}`,
                    ),
                title:
                  `${store?.title} (${lang.title})` ||
                  `Product (${lang.title})`,
              });
            }

            return locations;
          })
          .flat();

        /**
         * Collections
         */
        const collections = docs.filter(
          ({_type, store}) => _type === 'collection' && store?.slug?.current,
        );

        const collectionsLocations = collections
          .map(({store}) => {
            const locations: Array<{
              href: string;
              title: string;
            }> = [];

            for (const lang of languages) {
              const isDefaultLanguage = lang.id === defaultLanguage.id;

              locations.push({
                href: isDefaultLanguage
                  ? sanityPreviewPath(`collections/${store?.slug?.current}`)
                  : sanityPreviewPath(
                      `${lang.id}/collections/${store?.slug?.current}`,
                    ),
                title: store?.title
                  ? `${store?.title} (${lang.title})`
                  : `Collection (${lang.title})`,
              });
            }

            return locations;
          })
          .flat();

        return {
          locations: [
            ...collectionsLocations,
            ...pagesLocations,
            ...productsLocations,
            ...homeLocations,
          ].filter(Boolean),
        } satisfies DocumentLocationsState;
      }),
    );
  }

  return null;
};
